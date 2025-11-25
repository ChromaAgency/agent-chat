"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { redirect } from "next/navigation";
import useAuthStore from "@/services/authStore";

export default function SidebarLayout({children}: { children: React.ReactNode }){
     // We need this as client comp. as we need to check for the access token and refresh it if necessary.
    // We could make a layout that is a HOC that checks for the access token and refreshes it if necessary. 
    // But also check here just the access token in the cookie, if it is not present then we redirect server side.
    // Another possible way would be to make this in a middleware just for protected routes, but i should think how to do that.
    // This works for now
    // Generate a random string for code challenge
    const generateCodeChallenge = () => {
        return '38abd03107ec4718ffe86cfe0c89a8afb5c4fba53d623eb3a5d67cba03838a9c'
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    };

    const codeChallenge = generateCodeChallenge();
    const loginUrl = `${process.env.NEXT_PUBLIC_CORE_API_URL}/o/authorize?client_id=${process.env.NEXT_PUBLIC_CORE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_CORE_REDIRECT_URI}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=plain`;

    try {
        const getAccessToken = useAuthStore((state) => state.getAccessToken);
        getAccessToken().then(accessToken => {

        if (!accessToken) {
            redirect(loginUrl);
        }
        })
    } catch (error) {
        console.log(error);
        redirect(loginUrl);
    }

    return  <SidebarProvider  style={{
      // @ts-ignore
      "--sidebar-width": "30rem"
    }}>
      <AppSidebar />

      <SidebarInset>
        <SiteHeader />
        <main className="h-full w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
}