import { waitFor } from "@/lib/helper/waitFor";
import { Environment } from "@/types/executor";
import puppeteer from "puppeteer";

export async function LaunchBrowserExecutor(environment:any): Promise<boolean>{
   try {
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