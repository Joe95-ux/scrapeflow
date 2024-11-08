import React from 'react'
import {CoinsIcon, HomeIcon, Layers2Icon, ShieldCheckIcon} from "lucide-react";
import Logo from "@/components/Logo";

const routes = [
    {
        href:"",
        label:"Home",
        icon: HomeIcon
     
    },
    {
        href:"workflows",
        label:"Workflows",
        icon: Layers2Icon
     
    },
    {
        href:"credentials",
        label:"Credentials",
        icon: ShieldCheckIcon
     
    },
    {
        href:"billing",
        label:"Billing",
        icon: CoinsIcon
     
    }
]

const DesktopSidebar = () => {
 
  return (
    <div className='hidden relative md:block min-w-[280px]
     max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 
     dark:text-foreground text-muted-foreground border-r-2 border-separate'>
        <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
            <Logo/>
        </div>

    </div>
  )
}

export default  DesktopSidebar