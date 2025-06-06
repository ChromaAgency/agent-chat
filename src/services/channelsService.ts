import { mapChannel } from "./channelMapper";

export async function getChannels() : Promise<Channel[]> {
    const channelsResp = await fetch('https://quantum-agents-api.quantumcorp.com.mx/api/channels',{method:'GET'})
    const channels:ApiResult<ApiChannel> = await channelsResp.json()
    const  channelsResult = channels.results;
    return channelsResult.map(mapChannel);
}