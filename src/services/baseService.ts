import useAuthStore from "./authStore"

export async function coreApiFetch(endpoint:string, options:RequestInit = {}) {
    const authStore = useAuthStore.getState()
    const accessToken = await authStore.getAccessToken()
    console.log({url:(process.env.NEXT_PUBLIC_CORE_API_URL || '') + endpoint, accessToken})
    return fetch((process.env.NEXT_PUBLIC_CORE_API_URL || '') + endpoint, {headers:{'Authorization':`Bearer ${accessToken}`}, ...options, })
}