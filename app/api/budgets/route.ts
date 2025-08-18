import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { userId } = await auth()
    if (!userId) {
        return new NextResponse("Unauthorised",{status:403})
    }
    try {
        
    } catch (e) {
        console.error("Failed to get budget", e)
        return new NextResponse("Internal Server Error",{status:500})        
    }
}
export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) {
        return new NextResponse("Unauthorised",{status:403})
    }
    try {
        
    } catch (e) {
        console.error("Failed to create budget", e)
        return new NextResponse("Internal Server Error",{status:500})        
    }
}