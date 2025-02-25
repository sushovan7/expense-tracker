import { getUserAccounts } from "@/actions/dashboard.action";
import AddTransactionForm from "../_components/AddTransactionForm";
import { defaultCategories } from "@/data/categories";
import { getTransaction } from "@/actions/transaction.action";

async function TransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl font-bold mx-auto px-5">
      <h1 className="text-5xl mb-8 text-[#2563EB]">
        {" "}
        {editId ? "Update transactions" : " Add Transactions"}
      </h1>

      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}

export default TransactionPage;
