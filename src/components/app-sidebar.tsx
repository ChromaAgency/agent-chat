"use client"
import * as React from "react"
import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconMessage,
  IconReport,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import useAuthStore, { useUser } from "@/services/authStore"
import PageSidebar from "./page-sidebar"

const data = {

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Chats",
      url: "/chats",
      icon: IconMessage,
    },
    {
      title: "Channels",
      url: "/channels",
      icon:IconFolder,
    },
    {
      title: "Agentes",
      url: "/agents",
      icon: IconSettings,
    },
    // {
    //   title: "Team",
    //   url: "/team",
    //   icon: IconUsers,
    // },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
 
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {data:user} = useUser()
  
  return (
    
    <Sidebar collapsible="offcanvas" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row">
           <Sidebar collapsible="none" {...props}>
             <SidebarHeader>
               <SidebarMenu>
                 <SidebarMenuItem>
                   <SidebarMenuButton
                     asChild
                     className="data-[slot=sidebar-menu-button]:!p-1.5"
                   >
                     <Link href="/dashboard">
                       <IconInnerShadowTop className="!size-5" />
                       <span className="text-base font-semibold">Quantum Agents</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               </SidebarMenu>
             </SidebarHeader>
             <SidebarContent>
               <NavMain items={data.navMain} />
               {/* <NavDocuments items={data.documents} /> */}
               <NavSecondary items={data.navSecondary} className="mt-auto" />
             </SidebarContent>
             <SidebarFooter>
               <NavUser user={user} />
             </SidebarFooter>
           </Sidebar>
           <PageSidebar />

        
    </Sidebar>
  )       
}
