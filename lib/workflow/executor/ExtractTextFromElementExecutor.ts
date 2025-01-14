import {ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement.tsx";
export async function ExtractTextFromElementExecutor(environment:ExecutionEnvironment<typeof ExtractTextFromElementTask>): Promise<boolean>{
   try {
    const selector = environment.getInput("Selector");
    if(!selector){
      return false;
    }
    const html = environment.getInput("Html");
    if(!html){
      return false;
    }
   return true;
   } catch (error) {
    console.log(error);
    return false;
   }
}