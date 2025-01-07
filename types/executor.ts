import { Browser } from "puppeteer";

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