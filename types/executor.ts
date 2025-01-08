import { Browser } from "puppeteer";
import { WorkflowTask } from "./workflow";

export type Environment = {
    browser?: Browser,
    // phases with nodeId as key
    phases: {
        [key: string]: {
            inputs: Record<string, string>;
            outputs: Record<string, string>
        }
    };
}

export type ExecutionEnvironment<T extends WorkflowTask> = {
    getInput(name: T["inputs"][number]["name"]): string;
}