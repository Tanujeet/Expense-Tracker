import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
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

export async function PATCH(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }

  const { id } = await paramsPromise;
  const { name, icon } = await req.json();

  if (!name) {
    return new NextResponse("Name doest exist", { status: 404 });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    if (category.userId !== userId) {
      return new NextResponse("Unauthorised", { status: 403 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, icon },
    });

    return NextResponse.json(updatedCategory);
  } catch (e) {
    console.error("Failed to update categories", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }
  const { id } = await paramsPromise;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    if (category.userId !== userId) {
      return new NextResponse("Unauthorised", { status: 403 });
    }

    const deleteCategory = await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(deleteCategory);
  } catch (e) {
    console.error("Failed to delete categories", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
