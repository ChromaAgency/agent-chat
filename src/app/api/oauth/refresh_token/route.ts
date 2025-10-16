import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { setAuthCookies } from '@/utils.server';

export async function getNewRefreshToken(refreshToken: string) {

  const response = await fetch('http://localhost:8000/o/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: encodeURIComponent(process.env.NEXT_PUBLIC_CORE_CLIENT_ID || ''),
      client_secret: encodeURIComponent(process.env.CORE_API_CLIENT_SECRET || ''),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token' + await response.text());
  }

  const data = await response.json();
  return data;
}
export async function POST() {
  const cookieStore = await cookies();
  try {
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      cookieStore.delete('refresh_token');
      cookieStore.delete('access_token');
      cookieStore.delete('access_token_expire');
      return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
    }
    const data = await getNewRefreshToken(refreshToken);
    setAuthCookies(cookieStore, data.access_token, data.refresh_token, data.expires_in);

    return NextResponse.json({ success: true, accessToken: data.access_token, expiresIn: data.expires_in});
  } catch (error) {
    console.error('Error refreshing token:', error);
    cookieStore.delete('refresh_token');
    cookieStore.delete('access_token');
    cookieStore.delete('access_token_expire');
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });

  }
}
