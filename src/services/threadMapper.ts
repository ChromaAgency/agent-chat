import type { newApiThread, NewThread, Thread } from "./thread.d.ts";

export function mapThread(thread: Thread): Thread {
    return {
        id: thread.id,
        name: thread.name,
        created_at: thread.created_at,
        updated_at: thread.updated_at,
    };
}
export function mapApiThread(thread: NewThread): newApiThread {
    return {
        name: thread.name,
    };
}