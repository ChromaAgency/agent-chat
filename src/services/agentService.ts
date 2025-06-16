import { mapAgent, mapApiAgent } from "./agentMapper"
import useAuthStore from "./authStore";
import { coreApiFetch } from "./baseService";

export async function getIntegrations() {
    return 
}
export async function getAgents() : Promise<Agent[]> {
    const agentsResp = await coreApiFetch('/api/agents/',{method:'GET'})
    const agents:ApiResult<ApiAgent> = await agentsResp.json()
    const  agentResult = agents.results;
    return agentResult.map(mapAgent)

    
}
export async function getAgentById(agentId: string) : Promise<Agent> {
    const agentResp = await coreApiFetch(`/api/agents/${agentId}`, {method:'GET'});
    if(agentResp && !agentResp.ok) {
        if (agentResp.status === 404) {
            throw new Error('Agente no encontrado');
        }
        throw new Error('Error al obtener el Id del Agente, contacte un administrador');
    }
    const agent: ApiAgent = await agentResp.json();
    return mapAgent(agent);
}

export async function addNewAgent(agent:NewAgent) : Promise<Agent> {
    const apiAgent = mapApiAgent(agent);
    const agentsResp = await coreApiFetch('/api/agents/',{
        method:'POST', 
        body:JSON.stringify(apiAgent),
        headers: {'Content-Type':'application/json'}})
    if( !agentsResp.ok) {
        throw new Error('Error al crear Agente, contacte un administrador')
    }
    const agents:ApiAgent = await agentsResp.json()
    return  mapAgent(agents);

}
export async function updateAgent(agent:Agent) : Promise<Agent> {
    const agentsResp = await coreApiFetch(`/api/agents/${agent.id}/`, {   
            method:'PUT',
            body:JSON.stringify(mapApiAgent(agent)),
            headers: {'Content-Type':'application/json'}
        })
    if(agentsResp && !agentsResp.ok) {
        throw new Error('Error al actualizar Agente, contacte un administrador')
    }
    const agents:ApiAgent = await agentsResp.json()
    return  mapAgent(agents);
}
