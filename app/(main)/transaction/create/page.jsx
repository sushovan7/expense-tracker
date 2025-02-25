import { getUserAccounts } from "@/actions/dashboard.action";
import AddTransactionForm from "../_components/AddTransactionForm";
import { defaultCategories } from "@/data/categories";

async function TransactionPage() {
  const accounts = await getUserAccounts();

  return (
    <div className="max-w-3xl font-bold mx-auto px-5">
      <h1 className="text-5xl mb-8">Add Transactions</h1>

      <AddTransactionForm accounts={accounts} categories={defaultCategories} />
    </div>
  );
}

export default TransactionPage;
