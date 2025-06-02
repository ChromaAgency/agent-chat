import { mapAgent } from "./agentMapper"

export async function getIntegrations() {
    return 
}
export async function getAgents() : Promise<Agent[]> {

    const agentsResp = await fetch('https://cd41-38-156-229-45.ngrok-free.app/api/agents',{method:'GET'})
    const agents:ApiResult<ApiAgent> = await agentsResp.json()
    const  agentResult = agents.results;
    return agentResult.map(mapAgent)
    
    
}
