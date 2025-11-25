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
        // @ts-ignore
                1,
        // @ts-ignore
                6,
        // @ts-ignore
                7,
        // @ts-ignore
                9
            ]
    }
}