"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCurrentBudget(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized", data: null };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, message: "User not found", data: null };
    }

    const budget = await db.budget.findFirst({
      where: { userId: user.id },
    });

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: { amount: true },
    });

    return {
      success: true,
      message: "Budget fetched successfully",
      data: {
        budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
        currentExpenses: expenses._sum.amount?.toNumber() || 0,
      },
    };
  } catch (error) {
    console.error("getCurrentBudget error:", error);
    return {
      success: false,
      message: error?.message || "Failed to fetch budget",
      data: null,
    };
  }
}

export async function updateBudget(amount) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized", data: null };
    }

    if (typeof amount !== "number" || isNaN(amount)) {
      return { success: false, message: "Invalid budget amount", data: null };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, message: "User not found", data: null };
    }

    const budget = await db.budget.upsert({
      where: { userId: user.id },
      update: { amount },
      create: { userId: user.id, amount },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Budget updated successfully",
      data: {
        ...budget,
        amount: budget.amount.toNumber(),
      },
    };
  } catch (error) {
    console.error("updateBudget error:", error);
    return {
      success: false,
      message: error?.message || "Failed to update budget",
      data: null,
    };
  }
}
