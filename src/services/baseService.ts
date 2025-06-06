export function coreApiFetch(endpoint:string, options:RequestInit = {}) {
    return fetch((process.env.NEXT_PUBLIC_CORE_API_URL || '') + endpoint, options)
}