import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }
  const { id } = await paramsPromise;

  try {
    const getCategories = await prisma.category.findUnique({
      where: { id },
    });

    if (!getCategories) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(getCategories);
  } catch (e) {
    console.error("Failed to fetch categories", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
