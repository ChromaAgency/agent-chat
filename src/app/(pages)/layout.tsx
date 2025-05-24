import '@/app/globals.css';

export const metadata = {
  title: 'Chat Agent',
  description: 'Create AI Chat Agents',
}
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { headers} from 'next/headers';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import PageSidebar from '@/components/page-sidebar';

export default  async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider>
    <AppSidebar />
    <PageSidebar/>

    <SidebarInset>
      <SiteHeader /> 
      <main className="h-full w-full">
        {children}
      </main>
      </SidebarInset>
     </SidebarProvider>
    )
}

