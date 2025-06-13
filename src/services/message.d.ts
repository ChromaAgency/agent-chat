interface ApiMessage {
    id: string; 
    thread_id: string; 
    sender_id: string; 
    content: string;
    created_at: string; 
    updated_at: string; 
    url?: string; 
}

interface Message {
    id: string;
    threadId: string;
    senderId: string;
    content: string;
    createdAt: string; 
    updatedAt: string; 
    url?: string;
}


interface NewMessage {
    threadId: string | number; 
    content: string;
    senderId?: string | number; 
}

interface ApiMessageListResponse {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results: ApiMessage[];
}