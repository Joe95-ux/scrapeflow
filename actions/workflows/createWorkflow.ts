"use server";

import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/shema/workflow";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }
}
