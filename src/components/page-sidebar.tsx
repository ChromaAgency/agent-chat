"use client"

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { SidebarGroupContent } from "./ui/sidebar";
import { usePathname } from "next/navigation";

import * as React from "react"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInput,
  SidebarGroup,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { getAgents } from "@/services/agentService";
const pageRouteMap: Record<string, ()=>Promise<any[]>> = {  
    "chats": "/chats",
    "agents": getAgents,
}
type Agent = {
    id:string;
name:string;
role:string;
description:string;
}

type Chat = {
    id:string;
    email:string;
name:string;
date:string;
subject:string;
teaser:string;
}
function usePageSidebar({page}:{page: string}) {
    
    return useQuery({
        queryKey: [page], // query key (agents) indica si react query tiene que volver a hacer la funcion o no 
        queryFn: async (s) => {
            return await pageRouteMap[page]();
        }
    });

}
const queryClient = new QueryClient();
export default function PageSidebarWrapper() {

    return <QueryClientProvider client={queryClient}>
        <PageSidebar />
    </QueryClientProvider>
}
const mapSidegroupContentByPage:Record<string, ({ data }: { data: any[]; }) => React.JSX.Element> = {
    "chats": ChatsSideGroupContent,
    "agents": AgentsSideGroupContent,
}
function AgentsSideGroupContent({data}:{data: Agent[]}) {
    return <SidebarGroupContent>
    {data.map((mail:Agent) => (
      <Link
        href={`/agents/${mail.id}`}
        key={mail.id}
        className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <div className="flex w-full items-center gap-2">
          <span>{mail.name}</span>{" "}
          <span className="ml-auto text-xs">{mail.role}</span>
        </div>
        <span className="line-clamp-2 w-full whitespace-break-spaces text-xs">
          {mail.description}
        </span>
      </Link>
    ))}
  </SidebarGroupContent>
  
}
function ChatsSideGroupContent({data}:{data: Chat[]}) {
    return <SidebarGroupContent>
    {data.map((mail:Chat) => (
      <Link
        href={`/chats/${mail.id}`}
        key={mail.id}
        className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <div className="flex w-full items-center gap-2">
          <span>{mail.name}</span>{" "}
          <span className="ml-auto text-xs">{mail.date}</span>
        </div>
        <span className="font-medium">{mail.subject}</span>
        <span className="line-clamp-2 w-full whitespace-break-spaces text-xs">
          {mail.teaser}
        </span>
      </Link>
    ))}
  </SidebarGroupContent>
}
function PageSidebar() {
    
    const pathname = usePathname()
    const [,page, ] = pathname.split('/')
    const {isLoading, data:mails, isError } = usePageSidebar({page});
    if (isError || !pageRouteMap[page]) return null
    return <Sidebar collapsible="none" className="hidden md:flex">
    <SidebarHeader className="gap-3.5 border-b p-4">
      <div className="flex w-full items-center justify-between">
        <div className="text-base font-medium text-foreground capitalize">
           {page}
        </div>
        <Label className="flex items-center gap-2 text-sm">
          <span>Unreads</span>
          <Switch className="shadow-none" />
        </Label>
      </div>
      <SidebarInput placeholder="Type to search..." />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup className="px-0">
        {isLoading ? <SidebarGroupContent>
            <div className="flex flex-col items-center gap-2">
                <span>Loading...</span>
            </div>
        </SidebarGroupContent> :
        mapSidegroupContentByPage[page] ? mapSidegroupContentByPage[page]({data: mails}): null}
  </SidebarGroup>
    </SidebarContent>
  </Sidebar>

}