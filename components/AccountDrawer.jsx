"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { Button } from "./ui/button";
import { accountSchema } from "@/utils/schema";
import { useFetch } from "@/hooks/useFetch";
import { createAccount } from "@/actions/dashboard.action";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function AccountDrawer({ children }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    data: newAccount,
    error,
    fn: createAccountFn,
    loading: createAccountLoading,
  } = useFetch(createAccount);

  useEffect(() => {
    if (newAccount && !createAccountLoading) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, createAccountLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
    console.log(error);
  }, [error]);

  async function onSubmit(data) {
    await createAccountFn(data);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new account:</DrawerTitle>
        </DrawerHeader>
        <div className="container px-4 mx-auto">
          <form
            className="flex  flex-col pb-8 gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col  gap-2">
              {" "}
              <Label htmlFor="name">Name:</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                type="text"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">AccountType:</Label>
              <Select
                id="type"
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">CURRENT</SelectItem>
                  <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {" "}
              <Label htmlFor="balance">Balance:</Label>
              <Input
                id="balance"
                placeholder="0.00"
                type="number"
                step="0.01"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>
            <div className="flex  gap-2 items-center justify-between rounded-lg border p-3">
              <div className="flex flex-col items-start">
                <Label htmlFor="is Default">Set as default:</Label>
                <p className="text-xs">
                  This account will be selected by default for transactions
                </p>
              </div>

              <Switch
                id="isDefault"
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                checked={watch("isdefault")}
              />
            </div>
            <div className="flex items-center gap-3">
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                disabled={createAccountLoading}
                type="submit"
                className="flex-1"
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                    ...Creating{" "}
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default AccountDrawer;
