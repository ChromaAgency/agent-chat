interface ApiMessage {
    id: string; 
    thread_id: string; 
    sender_id: number; 
    content: string;
    created_at: string; 
    updated_at: string; 
    url?: string; 
}

// interface Message {
//     id: string;
//     threadId: string;
//     senderId: string;
//     content: string;
//     createdAt: string; 
//     updatedAt: string; 
//     url?: string;
// }
interface Message {
    id: string;
    text: string;
    isUser: boolean;
    time: string;
  }

interface NewMessage {
    text: string;
}

interface ApiMessageListResponse {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results: ApiMessage[];
}