
import {create, StoreApi, UseBoundStore} from 'zustand';
import axios from 'axios';
import { convertIsoStringDateToDate, convertTimestampToDate } from '@/utils';
import { coreApiFetch } from './baseService';

type AuthStore = {accessToken: string, accessTokenExpires:Date, 
    initializeFromCookies:()=>void
    getAccessToken:()=>Promise<string|null>,
    getProfile:()=>Promise<any|null>,
    profile:any|null
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
  profile: null,
  getProfile: async () => {
  
    const res = await coreApiFetch('/api/users/me', { method: 'GET' });
    console.log({res})
    const profile = await res.json();
    console.log({profile})
    set({
        profile
    })

    return profile
  },
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
      await get().getProfile();
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
        await get().getProfile();
    }
  }
}));

export default useAuthStore;

// Initialize the store from cookies on load
useAuthStore.getState().initializeFromCookies();