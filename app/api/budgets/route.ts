import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }
  try {
  } catch (e) {
    console.error("Failed to get budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { limit, endDate, startDate, categoryId } = await req.json();
  try {
    const newBudget = await prisma.budget.create({
      data: {
        userId: userId,
        categoryId: categoryId,
        limit: limit,
        startDate: startDate,
        endDate: endDate,
      },
    });

    return NextResponse.json(newBudget);
  } catch (e) {
    console.error("Failed to create budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
