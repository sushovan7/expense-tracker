"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

function serializeTransactions(obj) {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
}

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const balance = parseFloat(data.balance);
    if (isNaN(balance)) {
      throw new Error("Invalid balance amount");
    }

    const existingAccounts = await db.account.findMany({
      where: {
        userId: user.id,
      },
    });

    const shouldBeDefaultAccount =
      existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefaultAccount) {
      await db.account.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balance,
        isDefault: shouldBeDefaultAccount,
        userId: user.id,
      },
    });

    const serializedAccount = serializeTransactions(account);
    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Account created successfully",
      data: serializedAccount,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getUserAccounts() {
  try {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Find user in database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Fetch user's accounts
    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { transactions: true } },
      },
    });

    // Map the accounts (if needed)
    const serializedAccounts = accounts.map(serializeTransactions);

    return {
      success: true,
      message: "User's accounts retrieved successfully",
      data: serializedAccounts,
    };
  } catch (error) {
    console.error("Error fetching user accounts:", error); // Log error for debugging
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
      data: null,
    };
  }
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransactions);
}
