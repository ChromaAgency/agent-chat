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
import { getChannels } from "@/services/channelsService";
import type { Channel as ServiceChannel } from "@/services/channel.d.ts";
import { getThreads } from "@/services/threadsService"; 
import type { Thread as ServiceThread } from "@/services/thread.d.ts"; 
import { queryClient } from "./agent-form";

const pageRouteMap: Record<string, () => Promise<any[]>> = {
    "chats": getThreads,
    "agents": getAgents,
    "channels": getChannels,
};

type Agent = {
    id: string;
    name: string;
    role: string;
    description: string;
};

type Channel = ServiceChannel;

type Thread = ServiceThread;

function usePageSidebar({page}:{page: string}) {
    
    return useQuery({
        queryKey: [page], 
        queryFn: async () => { 
            if (typeof pageRouteMap[page] === 'function') {
                return await pageRouteMap[page]();
            }
            console.warn(`No data fetching function found for page: ${page}`);
            return [];
        },
        enabled: !!pageRouteMap[page] && typeof pageRouteMap[page] === 'function', 

})}
export default function PageSidebarWrapper() {

    return <QueryClientProvider client={queryClient}>
        <PageSidebar />
    </QueryClientProvider>
}
const mapSidegroupContentByPage:Record<string, ({ data }: { data: any[]; }) => React.JSX.Element> = {
    "chats": ThreadsSideGroupContent, // Map "chats" route to ThreadsSideGroupContent
    "agents": AgentsSideGroupContent,
    "channels": ChannelsSideGroupContent,
    // "threads": ThreadsSideGroupContent, // If you use 'threads' as key
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

function ChannelsSideGroupContent({ data }: { data: Channel[] }) {
    return <SidebarGroupContent>
        {data.map((channel: Channel) => (
            <Link
                href={`/channels/${channel.id}`}
                key={channel.id}
                className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
                <div className="flex w-full items-center gap-2">
                    <span>{channel.name}</span>
                    <span className="ml-auto text-xs">{channel.channel_type}</span>
                </div>
                <span className="line-clamp-2 w-full whitespace-break-spaces text-xs">
                    {channel.description}
                </span>
            </Link>
        ))}
    </SidebarGroupContent>
}



function ThreadsSideGroupContent({data}:{data: Thread[]}) {
    if (!Array.isArray(data)) {
        console.error("ThreadsSideGroupContent received non-array data:", data);
        return <SidebarGroupContent><p>Error loading threads.</p></SidebarGroupContent>; 
    }
    return <SidebarGroupContent>
    {data.map((thread:Thread) => (
      <Link
        href={`/chats/${thread.id}`} 
        key={thread.id}
        className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <div className="flex w-full items-center gap-2">

          <span>{thread.name}</span> 

          <span className="ml-auto text-xs">{thread.id}</span>
        </div>
      </Link>
    ))}
  </SidebarGroupContent>
}

function PageSidebar() {
    
    const pathname = usePathname()
    const [,page, ] = pathname.split('/') 
    const {isLoading, data:items, isError } = usePageSidebar({page});

 
    if (isError) {
        return <Sidebar collapsible="none" className="hidden md:flex"><SidebarContent><p>Error loading data.</p></SidebarContent></Sidebar>;
    }
    if (!pageRouteMap[page] || typeof pageRouteMap[page] !== 'function') {
        return <Sidebar collapsible="none" className="hidden md:flex"><SidebarContent><p>No items to display for {page}.</p></SidebarContent></Sidebar>;
    }
    
    const ContentRenderer = mapSidegroupContentByPage[page];

    return   <Sidebar collapsible="none" className="hidden md:flex">
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
        ContentRenderer ? <ContentRenderer data={items || []} /> : <p>No content configured for {page}.</p>}
  </SidebarGroup>
    </SidebarContent>
  </Sidebar>

}