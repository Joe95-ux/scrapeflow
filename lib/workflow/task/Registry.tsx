import { TaskType } from "@/types/task.js";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement.tsx";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";
import { WorkflowTask } from "@/types/workflow.js";
import { FillInputTask } from "./FillInput.jsx";

type Registry = {
    [K in TaskType]: WorkflowTask & {type: K};
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
    FILL_INPUT: FillInputTask,
}