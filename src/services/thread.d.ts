export interface Thread {
  id: string;
  name?: string; // Or any other relevant fields for a thread
  created_at: string;
  updated_at: string;
  // Potentially add last_message_summary or similar if available from API
}

export type NewApiThread = {
  title?: string;
  external_id?: string;
}
export type ApiThread = {
  id: string;
  created_at: string;
  updated_at: string;
} & NewApiThread

export interface NewThread {
  name: string;
  // other fields required to create a new thread
}