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
import {
  ChevronDown,
  ChevronUp,
  Delete,
  Ellipsis,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

function TransactionsTable({ transactions }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllCkecked, setIsAllChecked] = useState(false);
  const [isIndividualChecked, setIndividualChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [serchType, setSearchType] = useState("");
  const [allTypes, setAllTypes] = useState("");

  const [sort, setSort] = useState({
    field: "date",
    direction: "desc",
  });
  console.log(sort);

  const filterAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter((transaction) => {
        return transaction.description?.toLowerCase().includes(searchLower);
      });
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sort.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;

        default:
          comparison = 0;
          break;
      }
      return sort.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, serchType, searchQuery, sort]);

  function handleAllChange(e) {
    const isChecked = e.target.checked;

    if (isChecked) {
      const ids = filterAndSortedTransactions.map((transaction) => {
        return transaction.id;
      });
      setSelectedIds(ids);
      setIsAllChecked(isChecked);
    } else {
      setSelectedIds([]);
      setIsAllChecked(false);
    }
  }

  function handleIndividualChange(e, id) {
    const isChecked = e.target.checked;
    setSelectedIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((itemId) => itemId !== id);
      } else {
        return [...prevIds, id];
      }
    });
    setIndividualChecked(isChecked);
  }

  function handleSort(field) {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  function handleDelete() {}
  function handleBulkDelete() {}

  return (
    <div className="pt-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-2 top-2.5 h-4 w-4 " />
          <Input
            className="px-6 py-4"
            placeholder="Search your transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <Select value={allTypes} onValueChange={setAllTypes}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">INCOME</SelectItem>
              <SelectItem value="EXPENSE">EXPENSE</SelectItem>
            </SelectContent>
          </Select>
          {selectedIds.length > 0 && (
            <div>
              <Button variant="destructive" onClick={handleBulkDelete}>
                Delete {selectedIds.length}{" "}
                {selectedIds.length > 1 ? "transactions" : "transaction"}
              </Button>
            </div>
          )}

          {(searchQuery || allTypes) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setAllTypes("");
                setSelectedIds([]);
                setIsAllChecked(false);
              }}
            >
              <X className="h-4 w-5" />
            </Button>
          )}
        </div>
      </div>
      <Table>
        <TableCaption>A list of your recent transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <input
                type="checkbox"
                checked={isAllCkecked}
                onChange={handleAllChange}
              />{" "}
              All
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">
                Date{" "}
                {sort.field === "date" && sort.direction === "asc" ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                  </>
                )}
              </div>
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
              <div className="flex  items-center justify-end">
                Amount{" "}
                {sort.field === "amount" && sort.direction === "asc" ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                  </>
                )}
              </div>
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
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(transaction.id)}
                      onChange={(e) =>
                        handleIndividualChange(e, transaction.id)
                      }
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
