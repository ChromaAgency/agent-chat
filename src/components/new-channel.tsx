"use client"

import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { coreApiFetch } from "@/services/baseService";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

//   @ts-ignore
export function processWhatsappSignupResponse(response) {
    console.log('response: ', response);
    if (response.authResponse) {
        const code = response.authResponse.code;
        coreApiFetch('/api/chat/whatsapp/code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, redirect_uri: window.location.href })
            
        })
    } else {
        console.log('response: ', response);
    }

}
const fbLoginCallback = (response) => {
    processWhatsappSignupResponse(response);
}
export function NewChannel() {
    const p = useSearchParams();
    if (p.get("code")) fbLoginCallback({
        authResponse: {
        code: p.get("code"),
        redirect_uri: "http://localhost:3000/channels"
        }
    })
    // const launchWhatsappSignup = () => {


    //     // Response callback
    //     //   @ts-ignore

    //     //   @ts-ignore
    //     FB.login(fbLoginCallback, {
    //         config_id: '1634382450564883', // configuration ID goes here
    //         response_type: 'code', // must be set to 'code' for System User access token
    //         override_default_response_type: true, // when true, any response types passed in the "response_type" will take precedence over the default types}
    //         redirect_uri: window.location.href,
    //         extras: {      setup: {},
    //         featureType: 'whatsapp_business_app_onboarding',
    //         sessionInfoVersion: '3'}
    //     });


    // };
    useEffect(() => {
        // SDK initialization
        //   @ts-ignore
        window.fbAsyncInit = function () {
            //   @ts-ignore
            FB.init({
                appId: '1074335547935537',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v23.0'
            });
        };
 

        window.addEventListener('message', (event) => {
            if (event.origin !== "https://www.facebook.com") return;
            try {
                if (event.origin !== "https://www.facebook.com" && event.origin !== "https://web.facebook.com") {
                    return;
                }
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'WA_EMBEDDED_SIGNUP') {
                        // if user finishes the Embedded Signup flow
                        if (data.event === 'FINISH') {
                            const { phone_number_id, waba_id } = data.data;
                            console.log("Phone number ID ", phone_number_id, " WhatsApp business account ID ", waba_id);
                            // if user cancels the Embedded Signup flow
                        } else if (data.event === 'CANCEL') {
                            const { current_step } = data.data;
                            console.warn("Cancel at ", current_step);
                            // if user reports an error during the Embedded Signup flow
                        } else if (data.event === 'ERROR') {
                            const { error_message } = data.data;
                            console.error("error ", error_message);
                        }
                    }
                } catch {
                    console.log('Non JSON Responses', event.data);
                }
            } catch {
            }
        });
    }, [])
    const params = new URLSearchParams({
        "app_id":"1074335547935537",
        "client_id":"1074335547935537",
        "config_id":"1634382450564883",
        "display":"popup",
        "domain":"localhost",
        "e2e":encodeURI("{}"),
        "extras":encodeURI(JSON.stringify({"setup":{},"featureType":"","sessionInfoVersion":"3"})),
        "locale":"en_US",
        "logger_id":"f6a2ca6499a5ac1b6",
        "origin":"1",
        "override_default_response_type":"true",
        "redirect_uri":encodeURI("http://localhost:3000/channels"),
        "response_type":"code",
        "sdk":"joey",
        "version":"v23.0",
    });
    return (
        <>  
        <Link target="_blank" href={`https://www.facebook.com/v23.0/dialog/oauth?${params.toString()}`}>
            <Button >
                <MessageCircle className="h-6 w-6" />
                <span>WhatsApp</span>
            </Button>
            </Link>
            <script async defer crossOrigin="anonymous"
  src="https://connect.facebook.net/en_US/sdk.js">
</script>
        </>
    )
}