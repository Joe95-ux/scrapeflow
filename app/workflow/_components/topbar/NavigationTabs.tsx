"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

function NavigationTabs({ workflowId }: { workflowId: string }) {
  return (
    <Tabs defaultValue="editor" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="editor">
          <Link href={`/workflow/editor/${workflowId}`}>Editor</Link>
        </TabsTrigger>
        <TabsTrigger value="runs">
          <Link href={`/workflow/runs/${workflowId}`}>Runs</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default NavigationTabs;
