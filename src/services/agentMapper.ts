export function mapAgent(agent:ApiAgent):Agent {
    return {
        id:agent.id,
        name:agent.name,
        prompt:agent.prompt,
        integrations:agent.tools,
    }
}

export function mapApiAgent(agent:NewAgent):NewApiAgent {
    return {
        name:agent.name,
        prompt:agent.prompt,
        tools:agent.integrations || [],
    }
}