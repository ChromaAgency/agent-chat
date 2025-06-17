import AgentForm from "@/components/agent-form";

export const metadata = {
  title: "Agents",
  description: "Agents to use in a chat",
}
export default function Page() {
  return (
    <>

        <div className="flex flex-1 flex-col bg-slate-100 min-h-screen">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
              <div className="px-4 lg:px-6">     
                 
                <AgentForm  />                    
              </div>              
            </div>
          </div>
          </div>
    </>

  )
}
