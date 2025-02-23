"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { updateBudget } from "@/actions/budget.action";
import { toast } from "sonner";

function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(initialBudget?.toString());

  const percentageUsed = initialBudget
    ? (currentExpenses / initialBudget?.amount) * 100
    : 0;

  const {
    loading: isLoding,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  async function handleUpdate() {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  }

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to update budget");
    }
  }, [error]);

  function handleCancle() {
    setNewBudget(initialBudget?.amount.toString() || "");
    setIsEditing(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Monthly Budget (Default Account)</CardTitle>
        <div className="mt-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                type="number"
                value={newBudget}
                placeholder="Enter amount"
                className=" px-4 py-2 w-50"
                onChange={(e) => setNewBudget(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                disabled={isLoding}
                onClick={handleUpdate}
              >
                <Check className="text-green-500 " />
              </Button>
              <Button
                variant="ghost"
                disabled={isLoding}
                size="icon"
                onClick={handleCancle}
              >
                <X className="text-red-500 " />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <CardDescription>
                {" "}
                {initialBudget ? (
                  <>
                    {`$${currentExpenses.toFixed(2)}
                    of $${initialBudget?.amount} is spent`}
                  </>
                ) : (
                  "No budget set"
                )}
              </CardDescription>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget && (
          <div>
            <Progress
              value={percentageUsed}
              extraStyles={
                percentageUsed >= 90
                  ? "bg-red-500"
                  : percentageUsed >= 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }
            />
          </div>
        )}
      </CardContent>
      <div className="flex items-center justify-end">
        {" "}
        <CardFooter>
          <span className="text-gray-700">
            {Math.round(percentageUsed)}% used
          </span>
        </CardFooter>
      </div>
    </Card>
  );
}

export default BudgetProgress;
