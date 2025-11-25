export interface Channel {
    id: string;
    url: string;
    name: string;
    channel_type: string;
    channel_integration: string;
    external_id: string;
    description: string;
    created_at: string;
    agent: number; // Assuming agent is an ID, adjust if it's an object
    access_token: string;
}

export interface ApiChannel {
    id: string;
    url: string;
    name: string;
    channel_type: string;
    channel_integration: string;
    external_id: string;
    description: string;
    created_at: string;
    agent: number;
    access_token: string;
}

export interface NewChannel {
    name: string;
    channel_type: string;
    channel_integration: string;
    external_id: string;
    description: string;
    agent: number;
    access_token: string;
}

export interface UpdateChannel extends NewChannel {
    id: string;
}