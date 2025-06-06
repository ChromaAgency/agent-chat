export function mapChannel(channel:ApiChannel):Channel {
    return {
        id:channel.id,
        name:channel.name,
        description:channel.description,
        agent:channel.agent,
        channelType:channel.channelType,
        channelIntegration:channel.channelIntegration,
        accessToken:channel.accessToken,
        createdAt:channel.createdAt,
    }
}