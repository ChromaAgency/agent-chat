import { NextRequest } from "next/server";
import { agents } from "../agent";

export async function GET(request: NextRequest,   { params }: { params: Promise<{ agentId: string }> }) {
    const { agentId } = await params;
    return Response.json({
            result: agents.find((agent) => agent.id.toString() === agentId )
    })
}