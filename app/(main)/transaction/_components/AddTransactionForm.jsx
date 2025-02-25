"use client";

import { createTransaction } from "@/actions/transaction.action";
import { useFetch } from "@/hooks/useFetch";
import { transactionSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AccountDrawer from "@/components/AccountDrawer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar1, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddTransactionForm({ accounts, categories }) {
  const router = useRouter();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: accounts?.data.find((ac) => ac.isDefault)?.id,
      date: new Date(),
      isRecurring: false,
    },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
    error,
  } = useFetch(createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    transactionFn(formData);
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success("Transaction created successfull");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading]);

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  return (
    <form className="space-y-6 " onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2 ">
        <Label className="text-sm font-medium">Type</Label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}
        >
          <SelectTrigger className="sm:w-[250px] w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">EXPENSE</SelectItem>
            <SelectItem value="INCOME">INCOME</SelectItem>
          </SelectContent>
        </Select>

        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full sm:flex sm:flex-row">
        <div className="space-y-2 sm:w-[50%] w-full">
          <Label className="text-sm font-medium">Amount</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-2 w-full sm:w-[50%]">
          <Label className="text-sm font-medium">Account</Label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.data.map((account) => {
                return (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}({parseFloat(account.balance).toFixed(2)})
                  </SelectItem>
                );
              })}
              <AccountDrawer>
                <Button
                  className="w-full select-none items-center text-sm outline-none"
                  variant="ghost"
                >
                  Create Account
                </Button>
              </AccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-red-500">{errors.accountId.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2 w-full sm:w-[50%]">
        <Label className="text-sm font-medium">Select category</Label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => {
              return (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full pl-3 text-left font-normal"
            >
              <Calendar1 className="" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>

        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>
      <div className="space-y-2 sm:w-[50%] w-full">
        <Label className="text-sm font-medium">Description</Label>
        <Input
          type="text"
          placeholder="description"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div className="flex  gap-2 items-center justify-between rounded-lg border p-3">
        <div className="flex flex-col items-start">
          <Label htmlFor="is Default">Recurring transaction</Label>
          <p className="text-xs text-gray-400">
            Set up a recurring schedule for this transactions
          </p>
        </div>

        <Switch
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
          checked={isRecurring}
        />
      </div>
      {isRecurring && (
        <div className="space-y-2 w-full sm:w-[50%]">
          <Label className="text-sm font-medium">Recurring interval</Label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">DAILY</SelectItem>
              <SelectItem value="WEEKLY">WEEKLY</SelectItem>
              <SelectItem value="MONTHLY">MONTHLY</SelectItem>
              <SelectItem value="YEARLY">YEARLY</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-[50%]"
          onClick={() => router.back()}
        >
          Cancle
        </Button>
        <Button type="submit" className="w-50%" disabled={transactionLoading}>
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" /> ...Creating{" "}
            </>
          ) : (
            "Create transaction"
          )}
        </Button>
      </div>
    </form>
  );
}

export default AddTransactionForm;
