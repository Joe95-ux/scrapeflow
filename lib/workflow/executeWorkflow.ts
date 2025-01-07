import "server-only"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/Registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment } from "@/types/executor";

export async function ExecuteWorkflow(executionId: string){
    const execution = await prisma.workflowExecution.findUnique({
        where:{
            id: executionId
        },
        include: {workflow: true, phases: true},
    });
    if(!execution){
        throw new Error("execution not found");
    }

    // setup execution environment
    const environment: Environment = {phases:{}}

    // initialise workflow execution

    await initializeWorkflowExecution(executionId, execution.workflowId);
    
    await initializePhaseStatuses(execution);
    let creditsConsumed = 0;
    let executionFailed = false;
    for(const phase of execution.phases){
        // TODO: consume credits
        // execute phase
        const phaseExecution = await executeWorkflowPhase(phase, environment);
        if(!phaseExecution.success){
            executionFailed = true;
            break;
        }
    }

    // finalise execution

    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);

    // TODO: clean up environment

    revalidatePath("/workflows/runs");
}

async function initializeWorkflowExecution(executionId: string, workflowId: string){
    await prisma.workflowExecution.update({
        where: {id: executionId},
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING
        },
    });
    
    await prisma.workflow.update({
        where: {id: workflowId},
        data:{
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId,
        },
    });
}

async function initializePhaseStatuses(execution: any){
    await prisma.executionPhase.updateMany({
        where: {
            id:{
                in:execution.phases.map((phase:any)=>phase.id)
            },
        },
        data:{
            status: ExecutionPhaseStatus.PENDING
        }
    })
}

async function finalizeWorkflowExecution(executionId: string, workflowId: string, executionFailed: boolean, creditsConsumed: number){
   const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED;

   await prisma.workflowExecution.update({
    where: {id: executionId},
    data: {
        status: finalStatus,
        completedAt: new Date(),
        creditsConsumed
    }
   });

   await prisma.workflow.update({
    where:{id: workflowId, lastRunId: executionId},
    data:{
        lastRunStatus: finalStatus
    }
   }).catch((err)=>[
    // ignore
    // this means that we have triggered other runs 
    // for this workflow while an execution was runx
   ]);
}

async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment){
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;
    setupEnvironmentForPhase(node, environment);

    // update phase status
    await prisma.executionPhase.update({
        where:{id: phase.id},
        data:{
            status: ExecutionPhaseStatus.RUNNING,
            startedAt,
        }
    });
    const creditsRequired = TaskRegistry[node.data.type].credits;
    console.log(`Executing phase ${phase.name} with ${creditsRequired} credits required`);

    // TODO: decrement user balance (with required credits)

    // Execute phase
    const success = await executePhase(phase, node, environment);
    

    await finalizePhase(phase.id, success);
    return {success};

}
 
async function finalizePhase(phaseId: string, success: boolean){
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where: {id: phaseId},
        data:{
            status: finalStatus,
            completedAt: new Date(),
        }
    })
}

async function executePhase(phase: ExecutionPhase, node: AppNode, environment: Environment): Promise<boolean>{
    const runFn = ExecutorRegistry[node.data.type];
    if(!runFn){
        return false;
    }
    return await runFn(environment.phases[node.id]);

}

function setupEnvironmentForPhase(node: AppNode, environment: Environment){
    environment.phases[node.id] = {inputs:{}, outputs:{}};
    const inputs = TaskRegistry[node.data.type].inputs;
    for(const input of inputs){
        const inputValue = node.data.inputs[input.name];
        if(inputValue){
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }
    }

}