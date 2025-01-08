import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(environment:ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean>{
   try {
    const websiteUrl = environment.getInput("Website Url");
    console.log("@@WEBSITE URL", websiteUrl);
    const browser = await puppeteer.launch({
        headless: false // for testing only
    });
    await waitFor(3000);
    await browser.close();
    return true;
   } catch (error) {
    console.log(error);
    return false;
   }
}