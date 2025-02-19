"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function RemoveWorkflowSchedule(id: string){
    const {userId} = await auth();

    if(!userId){
        throw new Error("unauthenticated");
    }

    try {
       await prisma.workflow.update({
        where:{
            id, userId
        },
        data:{
            cron: null,
            nextRunAt:null,
        }
    }) 
    } catch (error: any) {
        console.error("Error removing workflow schedule:", error.message);
        throw new Error("Error removing workflow schedule");
    }
    revalidatePath("/workflows");
}