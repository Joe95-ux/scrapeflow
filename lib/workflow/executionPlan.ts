import { AppNode } from "@/types/appNode";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanphase,
} from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/Registry";

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
};

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    throw new Error("TODO: Handle this error");
  }

  const planned = new Set<string>();
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  for (
    let phase = 2;
    phase < +nodes.length || planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanphase = { phase, nodes: [] };
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        //Node already put in the execution plan.
        continue;
      }
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // If all incoming incomers /edges are planned and there are still invalid inputs
          // this means that this particular node has an invalid input
          // which means that the workflow is invalid
          console.error("invalid inputs", currentNode.id, invalidInputs);
          throw new Error("TODO: HANDLE ERROR 1");
        } else {
          // let's skip this node for now
          continue;
        }
      }
      nextPhase.nodes.push(currentNode);
      planned.add(currentNode.id);
    }
  }
  return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;
    if (inputValueProvided) {
      // this input is fine, so we can move on
      continue;
    }

    // if a value is not provided by the user then we need to check if there is an output linked to the current input
    const incomingEdges = edges.filter((edge)=> edge.target === node.id);

    const inputLinkedToOutput = incomingEdges.find((edge)=>edge.targetHandle === input.name);

    const requiredInputProvidedByVisitedOutput = input.required && inputLinkedToOutput && planned.has(inputLinkedToOutput.source);

    if(requiredInputProvidedByVisitedOutput){
        // the input is required and we have a      valid value for it provided by a task that isalready planned
        continue;
    }else if(!input.required){
        // if the input is not required but there
        // is an output linked to it then we need
        // to be sure that the output is already planned
        if(!inputLinkedToOutput) continue;

    }

  }
}
