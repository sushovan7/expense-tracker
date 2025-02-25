"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { date } from "zod";

const DATE_RANGE = {
  "7D": {
    label: "Last 7 days",
    days: 7,
  },
  "1M": {
    label: "Last Month",
    days: 30,
  },
  "3M": {
    label: "Last 3 months",
    days: 90,
  },
  "6M": {
    label: "Last 6 months",
    days: 180,
  },
  All: {
    label: "All time",
    days: null,
  },
};

function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const filterData = useMemo(() => {
    const range = DATE_RANGE[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filteredData = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filteredData.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filterData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      {
        income: 0,
        expense: 0,
      }
    );
  }, [filterData]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle>Transaction Information</CardTitle>
        <Select onValueChange={(value) => setDateRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGE).map(([key, { label }]) => {
              return (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row mb-10 items-start justify-around gap-3">
          <div>
            {" "}
            <p className="font-bold">Total income</p>
            <p className="text-lg text-blue-500 font-bold">
              {totals.income.toFixed(2)}
            </p>
          </div>
          <div>
            {" "}
            <p className="font-bold">Total expense</p>
            <p className="text-lg text-red-500 font-bold">
              {totals.expense.toFixed(2)}
            </p>
          </div>
          <div>
            {" "}
            <p className="font-bold text-lg ">Net</p>
            <p
              className={`text-lg ${
                totals.income >= totals.expense
                  ? "text-blue-500"
                  : "text-red-500"
              } font-bold`}
            >
              {totals.income > totals.expense ? (
                <span>+{(totals.income - totals.expense).toFixed(2)}</span>
              ) : (
                <span>+{(totals.income - totals.expense).toFixed(2)}</span>
              )}
            </p>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filterData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip formatter={(value) => [`$${value}`, undefined]} />
              <Legend />
              <Bar
                dataKey="income"
                fill="#4186F6"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                fill="#EF4345"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountChart;
