"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
    // Generate a random string for code challenge
    // We could use this to make a landing page with a button to go to the app, then the protected routes would make the redirects to the auth server
    const generateCodeChallenge = () => {
        return '38abd03107ec4718ffe86cfe0c89a8afb5c4fba53d623eb3a5d67cba03838a9c'
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    };
    
    const codeChallenge = generateCodeChallenge();
    const loginUrl = `${process.env.NEXT_PUBLIC_CORE_API_URL}/o/authorize?client_id=${process.env.NEXT_PUBLIC_CORE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_CORE_REDIRECT_URI}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=plain`;
    return (
        <div className="h-screen flex items-center justify-center">
            <Link href={loginUrl}>
                <Button>Login</Button>
            </Link>
        </div>
    )
}
