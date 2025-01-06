import { Browser } from "puppeteer";

export type Environment = {
    browser?: Browser,
    phases: {
        [key: string]: {
            inputs: Record<string, string>;
            outputs: Record<string, string>
        }
    };
}