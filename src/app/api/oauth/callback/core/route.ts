import { setAuthCookies } from "@/utils.server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const cookieStore = await cookies();

    const code = url.searchParams.get('code');
    try {
        if (!url.searchParams) {
            throw new Error('Invalid URL parameters');
        }
    } catch (error) {
        console.error('Error parsing URL parameters:', error);
        return new Response('Invalid request parameters', { status: 400 });
    }
    if (!code) {
        return new Response('Missing code', { status: 400 });
    }
    const clientID = process.env.NEXT_PUBLIC_CORE_CLIENT_ID
    if (!clientID) {
        return new Response('Missing client ID', { status: 400 });
    }
    const clientSecret = process.env.CORE_API_CLIENT_SECRET
    if (!clientSecret) {
        return new Response('Missing client secret', { status: 400 });
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_URL}/o/token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
        },
        body:new URLSearchParams({
            code,
            grant_type: 'authorization_code',
            client_id: encodeURIComponent(clientID),
            client_secret: encodeURIComponent(clientSecret),
            redirect_uri: process.env.NEXT_PUBLIC_CORE_REDIRECT_URI || 'http://localhost:3000/oauth/callback',
            code_verifier: '38abd03107ec4718ffe86cfe0c89a8afb5c4fba53d623eb3a5d67cba03838a9c'
        })
    });
    
    if (!response.ok) {
        return new Response('Failed to get tokens ' + await response.text(), { status: 400 });
    }
    
    const data = await response.json();
    const { access_token, refresh_token, expires_in } = data;

    setAuthCookies(cookieStore, access_token, refresh_token, expires_in);
    return Response.redirect(new URL('/dashboard', request.url), 302);
}