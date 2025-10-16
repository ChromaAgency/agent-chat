import { NextResponse, NextRequest } from "next/server";

export default function middleware(request: NextRequest){
    const headers = new Headers(request.headers)
    headers.set('X-QC-Path', request.nextUrl.pathname)
    return NextResponse.next({
        request:{
            headers
        }
    })
}