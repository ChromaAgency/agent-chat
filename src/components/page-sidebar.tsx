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
import { getChannels } from "@/services/channelsService"; // Import getChannels
import { Channel as ServiceChannel } from "@/services/channel.d.ts"; // Import Channel type
import { queryClient } from "./agent-form";

const pageRouteMap: Record<string, () => Promise<any[]>> = {
    "chats": "/chats" as any, // Kept as is, assuming it's handled differently or placeholder
    "agents": getAgents,
    "channels": getChannels, // Add channels route
};

type Agent = {
    id: string;
    name: string;
    role: string;
    description: string;
};

// Define Channel type for this component, ideally import from services
// Using ServiceChannel to avoid naming conflict if Channel was already defined locally
type Channel = ServiceChannel;

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
export default function PageSidebarWrapper() {

    return <QueryClientProvider client={queryClient}>
        <PageSidebar />
    </QueryClientProvider>
}
const mapSidegroupContentByPage:Record<string, ({ data }: { data: any[]; }) => React.JSX.Element> = {
    "chats": ChatsSideGroupContent,
    "agents": AgentsSideGroupContent,
    "channels": ChannelsSideGroupContent, // Add channels content renderer
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
// New component to render channels list
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
    const {isLoading, data:items, isError } = usePageSidebar({page}); // Renamed data to items for clarity

    if (isError || !pageRouteMap[page] || typeof pageRouteMap[page] !== 'function') { // Ensure it's a function
        // If it's the 'chats' placeholder or any other non-function, don't render or handle differently
        if (page === 'chats') {
            // Potentially render ChatsSideGroupContent if data fetching for chats is handled elsewhere
            // For now, returning null if it's not a function to avoid errors.
            // You might need a separate useQuery or data fetching mechanism for 'chats' if it's dynamic.
        }
        return null;
    }
    
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
        mapSidegroupContentByPage[page] ? mapSidegroupContentByPage[page]({data: items || []}): null} {/* Pass items to the content renderer, ensure items is not undefined */}
  </SidebarGroup>
    </SidebarContent>
  </Sidebar>

}