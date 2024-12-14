"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow(form:{workflowId: string, flowDefinition?: string}){
    const {userId} = await auth();

    if(!userId){
        throw new Error("unauthenticated!");
    }

    const {workflowId, flowDefinition} =form;
    if(!workflowId){
        throw new Error("workflowId is required");
    }

    const workflow = await prisma.workflow.findUnique({
        where:{
            userId, id:workflowId,
        }
    })
}