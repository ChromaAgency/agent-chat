import { mapAgent } from "./agentMapper"

export async function getIntegrations() {
    return 
}
export async function getAgents() : Promise<Agent[]> {

    const agentsResp = await fetch('https://quantum-agents-api.quantumcorp.com.mx/api/agents',{method:'GET'})
    const agents:ApiResult<ApiAgent> = await agentsResp.json()
    const  agentResult = agents.results;
    return agentResult.map(mapAgent)
    
    
}
