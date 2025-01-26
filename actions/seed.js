"use server";

import { db } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { subDays } from "date-fns";
import { v4 as uuidv4 } from "uuid"; // Use this if `crypto.randomUUID()` is unavailable

const ACCOUNT_ID = "10e48405-1ac3-4f52-9a83-093caffc75ea";
const USER_ID = "7893ecc5-305e-4e91-8423-3da7fde76f0e";

const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [5000, 8000] },
    { name: "freelance", range: [1000, 3000] },
    { name: "investments", range: [500, 2000] },
    { name: "other-income", range: [100, 1000] },
  ],
  EXPENSE: [
    { name: "housing", range: [1000, 2000] },
    { name: "transportation", range: [100, 500] },
    { name: "groceries", range: [200, 600] },
    { name: "utilities", range: [100, 300] },
    { name: "entertainment", range: [50, 200] },
    { name: "food", range: [50, 150] },
    { name: "shopping", range: [100, 500] },
    { name: "healthcare", range: [100, 1000] },
    { name: "education", range: [200, 1000] },
    { name: "travel", range: [500, 2000] },
  ],
};

function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

export async function seedTransactions() {
  try {
    const transactions = [];
    let totalBalance = new Decimal(0);

    for (let i = 90; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);

        transactions.push({
          id: uuidv4(), // Replace with crypto.randomUUID() if supported
          type,
          amount: new Decimal(amount), // Ensure Decimal is used for Prisma
          description: `${
            type === "INCOME" ? "Received" : "Paid for"
          } ${category}`,
          data: date, // Ensure field name matches your schema
          category,
          status: "COMPLETED",
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          createdAt: date,
          updatedAt: date,
        });

        totalBalance =
          type === "INCOME"
            ? totalBalance.add(new Decimal(amount))
            : totalBalance.sub(new Decimal(amount));
      }
    }

    if (transactions.length === 0) {
      throw new Error("No transactions generated. Check your logic.");
    }

    await db.$transaction(async (tx) => {
      console.log("Deleting existing transactions...");
      await tx.transaction.deleteMany({
        where: { accountId: ACCOUNT_ID },
      });

      console.log("Inserting new transactions...");
      await tx.transaction.createMany({
        data: transactions,
        skipDuplicates: true,
      });

      console.log("Updating account balance...");
      await tx.account.update({
        where: { id: ACCOUNT_ID },
        data: { balance: totalBalance },
      });
    });

    return {
      success: true,
      message: `Created ${transactions.length} transactions.`,
    };
  } catch (error) {
    console.error("Error seeding transactions:", error);
    return { success: false, error: error.message };
  }
}
