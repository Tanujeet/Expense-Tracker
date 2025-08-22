import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  try {
    const recentTransactions = await prisma.expense.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(recentTransactions);
  } catch (e) {
    console.error("Failed to get Recent Transactions", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
