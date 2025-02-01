import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import AccountDrawer from "@/components/AccountDrawer";
import { getUserAccounts } from "@/actions/dashboard.action";
import AccountCard from "./_components/AccountCard";

async function Dashboard() {
  const { data } = await getUserAccounts();

  return (
    <div className="space-y-8">
      {/* Budget Progress */}

      {/* Dashboard Overview */}

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
