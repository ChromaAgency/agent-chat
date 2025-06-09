// Basic example, adjust according to your exact API and frontend needs
export function mapChannel(apiChannel: ApiChannel): Channel {
    return {
        id: apiChannel.id,
        url: apiChannel.url,
        name: apiChannel.name,
        channel_type: apiChannel.channel_type,
        channel_integration: apiChannel.channel_integration,
        external_id: apiChannel.external_id,
        description: apiChannel.description,
        created_at: apiChannel.created_at,
        agent: apiChannel.agent,
        access_token: apiChannel.access_token,
    };
}

export function mapApiChannel(channel: NewChannel | UpdateChannel): Partial<ApiChannel> {
    // Assuming your API expects all these fields for create/update
    // Adjust if some fields are not sent or have different names
    return {
        name: channel.name,
        channel_type: channel.channel_type,
        channel_integration: channel.channel_integration,
        external_id: channel.external_id,
        description: channel.description,
        agent: channel.agent,
        access_token: channel.access_token,
        // 'id' and 'url' are usually handled by the backend or not sent on create
    };
}