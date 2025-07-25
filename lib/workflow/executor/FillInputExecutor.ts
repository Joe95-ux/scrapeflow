import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "@/lib/workflow/task/FillInput";
export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector not defined");
    }

    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("input->value not defined");
    }

    await environment.getPage()!.type(selector, value);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
