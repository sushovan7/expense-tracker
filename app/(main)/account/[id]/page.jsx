import { getAccountWithTransactions } from "@/actions/account.action";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import TransactionsTable from "../_components/TransactionsTable";
import { BarLoader } from "react-spinners";
import AccountChart from "../_components/AccountChart";

async function AccountsPage({ params }) {
  try {
    const { id } = await params;
    const accountData = await getAccountWithTransactions(id);

    const { transactions, ...account } = accountData;

    if (!accountData) {
      notFound();
    }

    return (
      <div className="space-y-8 px-5 f">
        <div className="flex gap-4 items-end justify-between">
          <div>
            <h1 className="text-5xl font-mono sm:text-6xl font-bold  text-blue-500 capitalize">
              {account.name}
            </h1>
            <p>
              {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
              Account
            </p>
          </div>
          <div className="text-right pb-2">
            <div className="text-xl sm:text-2xl font-bold">
              ${parseFloat(account.balance).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              {account._count.transactions} Transactions
            </p>
          </div>
        </div>

        {/* chart sections */}
        <Suspense
          fallback={
            <BarLoader
              height={4}
              className="mt-4"
              width="100%"
              color="#9333ea"
            />
          }
        >
          <AccountChart transactions={transactions} />
        </Suspense>

        {/* transactions table */}
        <Suspense
          fallback={
            <BarLoader
              height={4}
              className="mt-4"
              width="100%"
              color="#9333ea"
            />
          }
        >
          <TransactionsTable transactions={transactions} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error fetching account:", error.message);
    notFound();
  }
}

export default AccountsPage;
