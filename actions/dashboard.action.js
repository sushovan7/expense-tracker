"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

function serializeTransactions(obj) {
  const serialized = { ...obj };

  if (obj.balance?.toNumber) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount?.toNumber) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
}

function response(success, message, data = null) {
  return { success, message, data };
}

async function getAuthenticatedUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  return user || null;
}

export async function createAccount(data) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return response(false, "Unauthorized");

    const balance = parseFloat(data.balance);
    if (isNaN(balance)) return response(false, "Invalid balance amount");

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefaultAccount =
      existingAccounts.length === 0 ? true : !!data.isDefault;

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
        balance,
        isDefault: shouldBeDefaultAccount,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");

    return response(
      true,
      "Account created successfully",
      serializeTransactions(account)
    );
  } catch (error) {
    console.error("createAccount error:", error);
    return response(false, error.message || "Internal server error");
  }
}

export async function getUserAccounts() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return response(false, "Unauthorized");

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { transactions: true } },
      },
    });

    const serializedAccounts = accounts.map(serializeTransactions);

    return response(
      true,
      "User's accounts retrieved successfully",
      serializedAccounts
    );
  } catch (error) {
    console.error("getUserAccounts error:", error);
    return response(false, error.message || "Internal server error");
  }
}

export async function getDashboardData() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return response(false, "Unauthorized");

    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    const serialized = transactions.map(serializeTransactions);

    return response(true, "Transactions fetched successfully", serialized);
  } catch (error) {
    console.error("getDashboardData error:", error);
    return response(false, error.message || "Internal server error");
  }
}
