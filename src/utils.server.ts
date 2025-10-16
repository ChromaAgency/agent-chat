import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { convertTimestampToIsostringDate } from "./utils";

export function setAuthCookies(cookieStore:ReadonlyRequestCookies, accessToken: string, refreshToken: string, expires: number) {

    // Set the new tokens in cookies
    const cookieOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/'
      };
      const expireDate = convertTimestampToIsostringDate(Date.now() + expires * 1000);

      cookieStore.set('refresh_token', refreshToken, {...cookieOptions, httpOnly: true});
      cookieStore.set('access_token', accessToken, cookieOptions);
      cookieStore.set('access_token_expire', expireDate, cookieOptions);
  

}