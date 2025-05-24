import { NextRequest, NextResponse } from "next/server"
import { agents } from "./agent"


export async function GET(request: NextRequest):Promise<NextResponse<{result:unknown}>> {
    return NextResponse.json({
            result: agents
    })
}