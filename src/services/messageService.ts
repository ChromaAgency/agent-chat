import { coreApiFetch } from "./baseService";

function mapMessage(apiMessage: ApiMessage): Message {
    return {
        id: apiMessage.id,
        text: apiMessage.content,
        userId: apiMessage.user,
        time: apiMessage.created_at,
    };
}

export async function getMessagesByThreadId(threadId: string | number): Promise<Message[]> {
    try {
        const response = await coreApiFetch(`/api/threads/${threadId}/messages/`, { method: 'GET' }); 
        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Error fetching messages for thread ${threadId}:`, response.status, errorData);
            throw new Error(`Error fetching messages for thread ${threadId}: ${response.status}`);
        }
        const apiMessages: ApiMessage[] = await response.json();
        const messages = apiMessages.map(mapMessage)
        messages.reverse();
        return messages

    } catch (error) {
        console.error(`Failed to get messages for thread ${threadId}:`, error);
        throw error;
    }
}

export async function addMessageToThread(threadId: string | number, messageContent: string, senderId?: string | number): Promise<Message> {
    try {
        const newMessagePayload: { thread: number | string; content: string; sender: number | string } = {
            sender: typeof senderId === 'string' ? senderId : Number(senderId),
            thread: typeof threadId === 'string' ? threadId : Number(threadId),
            content: messageContent,
        };


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