import { coreApiFetch } from "./baseService";
import type { ApiThread, NewThread, Thread } from "./thread.d.ts"; 
import { mapApiThread } from "./threadMapper";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const mapThread = (apiThread: any): Thread => ({
  id: apiThread.id,
  name: apiThread.name || `Thread ${apiThread.id}`, 
  created_at: apiThread.created_at,
  updated_at: apiThread.updated_at,
});

export const getThreads = async (): Promise<Thread[]> => {
  try {
    const response = await coreApiFetch('/api/threads',{ method: 'GET' });
    const threads:ApiThread = await response.json();

    console.log(threads);
    
    return mapThread(response);
  } catch (error) {
    console.error("Failed to fetch threads:", error);

    throw error;
  }
};

export const getThreadById = async (id: string): Promise<Thread | null> => {
  try {
    const response = await coreApiFetch<any>(`/api/threads/${id}/`,{ method: 'GET' });
    return response ? mapThread(response) : null;
  } catch (error) {
    console.error(`Failed to fetch thread with id ${id}:`, error);
    throw error;
  }
};
export async function addNewThread(thread:NewThread) : Promise<Thread> {
  const apiThread = mapApiThread(thread);
  const threadsResp = await coreApiFetch('/api/threads/',{
    method:'POST', 
    body:JSON.stringify(apiThread),
    headers: {'Content-Type':'application/json'}})
  if( !threadsResp.ok) {
    throw new Error('Error al crear Thread, contacte un administrador')
  }
  const threads:ApiThread = await threadsResp.json()
  return  mapThread(threads);
}
export async function updateThread(thread:Thread) : Promise<Thread> {
  const threadsResp = await coreApiFetch(`/api/threads/${thread.id}/`, {   
      method:'PUT',
      body:JSON.stringify(mapApiThread(thread)),
      headers: {'Content-Type':'application/json'}
    })
  if(threadsResp && !threadsResp.ok) {
    throw new Error('Error al actualizar Thread, contacte un administrador')
  }
  const threads:ApiThread = await threadsResp.json()
  return  mapThread(threads);
}