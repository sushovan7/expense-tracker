import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import AccountDrawer from "@/components/AccountDrawer";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard.action";
import AccountCard from "./_components/AccountCard";
import { getCurrentBudget } from "@/actions/budget.action";
import BudgetProgress from "./_components/BudgetProgress";
import { DashboardOverview } from "./_components/DashboardOverview";

async function Dashboard() {
  const { data } = await getUserAccounts();

  const defaultAccount = data.filter((account) => account.isDefault === true);

  let budgetData = null;

  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const transactions = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* Budget Progress */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData.currentExpenses || 0}
        />
      )}

      {/* Dashboard Overview */}
      <DashboardOverview accounts={data} transactions={transactions || []} />

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer ">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2 text-blue-500" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </AccountDrawer>
        {data &&
          data.length > 0 &&
          data?.map((item) => <AccountCard key={item.id} data={item} />)}
      </div>
    </div>
  );
}

export default Dashboard;
