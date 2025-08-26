import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "test-user-id"; // Abhi ke liye hardcode kar, baad me apne auth se handle kar lena

  const defaultCategories = [
    { name: "Food", icon: "🍔", userId },
    { name: "Transport", icon: "🚌", userId },
    { name: "Shopping", icon: "🛍️", userId },
    { name: "Bills", icon: "💡", userId },
    { name: "Entertainment", icon: "🎬", userId },
  ];

  for (const cat of defaultCategories) {
    await prisma.category.create({ data: cat });
  }

  console.log("Default categories added ✅");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
