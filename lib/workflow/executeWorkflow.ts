import "server-only"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";

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
    const environment = {phases:{}}

    // initialise workflow execution

    await initializeWorkflowExecution(executionId, execution.workflowId);
    
    await initializePhaseStatuses(execution);
    let creditsConsumed = 0;
    let executionFailed = false;
    for(const phase of execution.phases){
        // TODO: consume credits
        // TODO: execute phase
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