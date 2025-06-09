import AgentForm from "@/components/agent-form";

export default async function Page({params}:{params:Promise<{agentId:string}>}) {
    const {agentId} = await params;
    return (
      <>
          <div className="flex flex-1 flex-col bg-slate-100 min-h-screen">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
                <div className="px-4 lg:px-6">     
                  <AgentForm agentId={agentId} />                    
                </div>              
              </div>
            </div>
          </div>
      </>
    )
  }
  