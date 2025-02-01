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
    const { userId } = await auth();
    console.log(userId);

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

    const accounts = await db.account.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!accounts) {
      throw new Error("No accounts present");
    }

    const serializedAccounts = accounts.map(serializeTransactions);

    return {
      success: true,
      message: "Account of user",
      data: serializedAccounts,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}
