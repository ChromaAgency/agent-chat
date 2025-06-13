import { coreApiFetch } from "./baseService";

function mapMessage(apiMessage: ApiMessage): Message {
    return {
        id: apiMessage.id,
        threadId: apiMessage.thread_id,
        senderId: apiMessage.sender_id,
        content: apiMessage.content,
        createdAt: apiMessage.created_at,
        updatedAt: apiMessage.updated_at,
    };
}

export async function getMessagesByThreadId(threadId: string | number): Promise<Message[]> {
    try {
        const response = await coreApiFetch(`/api/threads/${threadId}/messages/`, { method: 'GET' }); 
        console.log(response);
        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Error fetching messages for thread ${threadId}:`, response.status, errorData);
            throw new Error(`Error fetching messages for thread ${threadId}: ${response.status}`);
        }
        const apiMessages: ApiMessage[] = await response.json();
        return apiMessages.map(mapMessage);

    } catch (error) {
        console.error(`Failed to get messages for thread ${threadId}:`, error);
        throw error;
    }
}

export async function addMessageToThread(threadId: string | number, messageContent: string, senderId?: string | number): Promise<Message> {
    try {
        const newMessagePayload: { thread_id: number | string; content: string; sender_id?: number | string } = {
            thread_id: typeof threadId === 'string' ? threadId : Number(threadId),
            content: messageContent,
        };
        if (senderId) {
            newMessagePayload.sender_id = senderId;
        }

        const response = await coreApiFetch(`/api/messages/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessagePayload),
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            console.error('Error adding message:', response.status, errorData);
            throw new Error(`Error adding message: ${errorData.detail || response.statusText}`);
        }
        const createdApiMessage: ApiMessage = await response.json();
        return mapMessage(createdApiMessage);
    } catch (error) {
        console.error(`Failed to add message to thread ${threadId}:`, error);
        throw error;
    }
}