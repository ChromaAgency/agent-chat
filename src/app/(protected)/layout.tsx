import dynamic from "next/dynamic";

const SidebarLayout = dynamic(() => import("./sidebar_layout"));

export default function Layout({ children }: { children: React.ReactNode }) {

  return <SidebarLayout >
      {children}
    </SidebarLayout>
}

