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
        translate_to_user_language:true,
        tools:[
                1,
                6,
                7,
                9
            ]
    }
}