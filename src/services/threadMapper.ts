import type { ApiThread, NewApiThread, NewThread, Thread } from "./thread.d.ts";

export function mapThread(thread: ApiThread): Thread {
    return {
        id: thread.id,
        name: thread.external_id || `${thread.title}` || `Thread ${thread.id}`,
        created_at: thread.created_at,
        updated_at: thread.updated_at,
    };
}
export function mapApiThread(thread: NewThread): NewApiThread {
    return {
        title: thread.name,
        external_id: thread.name,
    };
}