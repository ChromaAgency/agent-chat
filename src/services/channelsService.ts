import { mapChannel, mapApiChannel } from "./channelMapper"; // Assuming you'll create these mappers
import { coreApiFetch } from "./baseService";

export async function getChannels(): Promise<Channel[]> {
    const channelsResp = await coreApiFetch('/api/channels', { method: 'GET' });
    if (!channelsResp.ok) {
        throw new Error('Error fetching channels');
    }
    const channels: ApiResult<ApiChannel> = await channelsResp.json();
    const channelsResult = channels.results;
    return channelsResult.map(mapChannel);
}

export async function getChannelById(channelId: string): Promise<Channel> {
    const channelResp = await coreApiFetch(`/api/channels/${channelId}`, { method: 'GET' });
    if (!channelResp.ok) {
        if (channelResp.status === 404) {
            throw new Error('Channel not found');
        }
        throw new Error('Error fetching channel by ID');
    }
    const channel: ApiChannel = await channelResp.json();
    return mapChannel(channel);
}

export async function addNewChannel(channel: NewChannel): Promise<Channel> {
    const apiChannel = mapApiChannel(channel); // You'll need to create this mapper
    const channelResp = await coreApiFetch('/api/channels/', {
        method: 'POST',
        body: JSON.stringify(apiChannel),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!channelResp.ok) {
        throw new Error('Error creating channel');
    }
    const newChannel: ApiChannel = await channelResp.json();
    return mapChannel(newChannel);
}

export async function updateChannel(channel: UpdateChannel): Promise<Channel> {
    const apiChannel = mapApiChannel(channel); // You'll need to create this mapper
    const channelResp = await coreApiFetch(`/api/channels/${channel.id}/`, {
        method: 'PUT',
        body: JSON.stringify(apiChannel),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!channelResp.ok) {
        throw new Error('Error updating channel');
    }
    const updatedChannel: ApiChannel = await channelResp.json();
    return mapChannel(updatedChannel);
}