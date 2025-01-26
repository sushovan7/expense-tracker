"use client";

import { updateDefaultAccount } from "@/actions/account.action";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useFetch } from "@/hooks/useFetch";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

function AccountCard({ data }) {
  const { name, type, balance, id, isDefault } = data;

  const {
    data: updateAccount,
    loading: updateDefaultLoading,
    error,
    fn: updateDefaultFn,
  } = useFetch(updateDefaultAccount);

  async function handleDefaultChange(e) {
    e.preventDefault();
    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return;
    }
    await updateDefaultFn(id);
  }

  useEffect(() => {
    if (updateAccount?.success) {
      toast.success("Account updated successfully");
    }
  }, [updateAccount, updateDefaultLoading]);

  useEffect(() => {
    if (error) {
      toast.success("Failed to update account");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <Switch
            disabled={updateDefaultLoading}
            checked={isDefault}
            onClick={handleDefaultChange}
            className="bg-blue-500 data-[state=checked]:bg-blue-700"
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-blue-500 font-bold">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}

export default AccountCard;
