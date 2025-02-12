"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import parser from "cron-parser";

export async function UpdateWorkflowCron({id, cron}:{id: string, cron: string}){
    const {userId} = await auth();

    if(!userId){
        throw new Error("unauthenticated");
    }

    try {
        const interval = parser.parseExpression(cron, {utc:true});
       return await prisma.workflow.update({
        where:{
            id, userId
        },
        data:{
            cron,
            nextRunAt: interval.next().toDate(),
        }
    }) 
    } catch (error: any) {
        console.error("invalid cron:", error.message);
        throw new Error("Invalid cron expression");
    }

    
}