"use client";

import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

function TransactionsTable({ transactions }) {
  const router = useRouter();
  const filterAndSortedTransactions = transactions;
  const [selectedIds, setSelectedIds] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  function handleAllIds() {
    const allSelected =
      selectedIds.length === filterAndSortedTransactions.length;

    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(
        filterAndSortedTransactions.map((transaction) => transaction.id)
      );
    }
  }
  console.log(isChecked);

  function handleSelectedIds(id) {
    console.log(id);
    setSelectedIds((prevState) =>
      prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id]
    );
  }
  console.log(selectedIds);

  function handleSort() {}
  function handleDelete() {}
  return (
    <div className="pt-8">
      <Table>
        <TableCaption>A list of your recent transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  selectedIds.length === filterAndSortedTransactions.length
                }
                onChange={handleAllIds}
              />{" "}
              All
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">Date</div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("category")}
            >
              Category
            </TableHead>

            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              <div className="flex  items-center justify-end">Amount</div>
            </TableHead>
            <TableHead className="text-right">Recurring</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterAndSortedTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No Transactions Found
              </TableCell>
            </TableRow>
          ) : (
            filterAndSortedTransactions.map((transaction) => {
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    <Checkbox
                      checked={
                        selectedIds.length ===
                        filterAndSortedTransactions.length
                      }
                      className={
                        selectedIds.includes(transaction.id)
                          ? "data-[state=checked]:bg-blue-500"
                          : ""
                      }
                      onChange={() => handleSelectedIds(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {transaction.type === "EXPENSE" ? (
                      <span className="text-red-500">
                        {format(new Date(transaction.data), "PP")}
                      </span>
                    ) : (
                      <span className="text-green-500">
                        {format(new Date(transaction.data), "PP")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    {transaction.category}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.type === "EXPENSE" ? (
                      <span className="text-red-500">
                        {transaction.amount.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-green-500">
                        {transaction.amount.toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.isRecurring === true
                      ? "Multiple Time"
                      : "One time"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `transactions/create?edit?=${transaction.id}`
                              )
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleDelete([transaction.id])}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default TransactionsTable;
