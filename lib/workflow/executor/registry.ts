import { TaskType } from "@/types/task";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { WorkflowTask } from "@/types/workflow";
import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";

type ExecutorFn<T extends WorkflowTask> = (environment: ExecutionEnvironment<T>)=> Promise<boolean>

type RegistryType = {
    [k in TaskType]: ExecutorFn<WorkflowTask & {type: k}>
}

export const ExecutorRegistry: RegistryType = {
    LAUNCH_BROWSER: LaunchBrowserExecutor,
    PAGE_TO_HTML: PageToHtmlExecutor,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
}