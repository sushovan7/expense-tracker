import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import Dashboard from "../dashboard/page";
import { auth } from "@clerk/nextjs/server";

async function DashboardLayout() {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold tracking-tight gradient-title text-[#2563EB]">
          Dashboard
        </h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <Dashboard />
      </Suspense>
    </div>
  );
}

export default DashboardLayout;
