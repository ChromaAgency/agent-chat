export function mapAgent(agent:ApiAgent):Agent {
    return {
        id:agent.id,
        name:agent.name,
        prompt:agent.prompt,
        integrations:agent.tools,
    }
}