
import {create, StoreApi, UseBoundStore} from 'zustand';
import { convertIsoStringDateToDate, convertTimestampToDate } from '@/utils';
import { coreApiFetch } from './baseService';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/components/agent-form';


export function useUser(){
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => await getMyUser(),
    }, queryClient)
  
}
export async function getMyUser(){
  
        const res = await coreApiFetch('/api/users/me', { method: 'GET' });
        const profile = await res.json();
        return profile
}

type AuthStore = {accessToken: string, accessTokenExpires:Date, 
    initializeFromCookies:()=>void
    getAccessToken:()=>Promise<string|null>,
    
}

  export async function clientRefreshAuth () {
    // Use the one in the api route for server
    const response = await fetch('http://localhost:3000/api/oauth/refresh_token', {method: 'POST'});
    if (!response.ok) {
      throw new Error('Failed to refresh token', { cause: await response.text() });
    }
    const { accessToken: newAccessToken, expiresIn } = await response.json();
    const newExpires = convertTimestampToDate(Date.now() + expiresIn * 1000);
    return { newAccessToken, newExpires };
  }
const useAuthStore:UseBoundStore<StoreApi<AuthStore>> = create<AuthStore>((set, get) => ({
  accessToken: '',
  accessTokenExpires: new Date(),
  getAccessToken: async () => {
    const { accessToken, accessTokenExpires } = get();
    const currentTime = new Date();
    if (!accessToken){
        get().initializeFromCookies();
    }
    if (accessToken && currentTime < accessTokenExpires) {
      return accessToken;
    }
    try {
      const { newAccessToken, newExpires } = await clientRefreshAuth();
      set({ accessToken: newAccessToken, accessTokenExpires: newExpires });
      return newAccessToken;
    } catch (error) {
      set({ accessToken: '', accessTokenExpires: new Date() });
      return null;
    }
  },
  initializeFromCookies: async () => {
    let accessToken, accessTokenExpires;
    if(typeof window === 'undefined') {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies()
        accessToken = cookieStore.get('access_token')?.value;
        accessTokenExpires = cookieStore.get('access_token_expire')?.value;
    }else{
        accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        accessTokenExpires = document.cookie.split('; ').find(row => row.startsWith('access_token_expire='))?.split('=')[1];
    }
    console.log({accessToken, accessTokenExpires})
    if (accessToken && accessTokenExpires) {
        
        set({ accessToken, accessTokenExpires:  convertIsoStringDateToDate(decodeURIComponent(accessTokenExpires))});
    }
  }
}));

export default useAuthStore;

// Initialize the store from cookies on load
useAuthStore.getState().initializeFromCookies();