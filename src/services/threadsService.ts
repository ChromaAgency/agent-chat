import { coreApiFetch } from "./baseService";
import type { ApiThread, NewThread, Thread } from "./thread.d.ts"; 
import { mapApiThread } from "./threadMapper";


const mapThread = (apiThread: any): Thread => ({
  id: apiThread.id,
  name: apiThread.name || `Thread ${apiThread.id}`, 
  created_at: apiThread.created_at,
  updated_at: apiThread.updated_at,
});

export const getThreads = async (): Promise<Thread[]> => {
    const response = await coreApiFetch('/api/threads',{ method: 'GET' });
    const threads:ApiResult<ApiThread> = await response.json();
    return threads.results.map(mapThread);
};

export const getThreadById = async (id: string): Promise<Thread | null> => {
    const response = await coreApiFetch(`/api/threads/${id}/`,{ method: 'GET' });
    return response ? mapThread(response) : null;
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