"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

function serializeTransactions(obj) {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
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
        wher: {
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
        isDefauld: shouldBeDefaultAccount,
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
