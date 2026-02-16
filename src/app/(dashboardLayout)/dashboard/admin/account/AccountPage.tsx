"use client";

import { use } from "react";
import { AccountSummary } from "./AccountSummary";
import { DataTable } from "@/components/ui/data-table";
import { transactionColumns } from "./transaction.column";
import { TAccountTransaction } from "@/types/account-transactions.type";
import { TAccount } from "@/types/account.type";
import AccountView from "./AccountView";
import { useUser } from "@/providers/ContextProvider";

// 1. Accept the promises as props
export default function AccountPage({
  accountsPromise,
  transactionsPromise,
}: {
  accountsPromise: Promise<{ data: TAccount[] }>;
  transactionsPromise: Promise<{ data: TAccountTransaction[] }>;
}) {
  const { user } = useUser();
  const accountRes = use(accountsPromise);
  const transactionRes = use(transactionsPromise);

  const accounts = accountRes?.data || [];
  const transactions = transactionRes?.data || [];

  return (
    <div className="space-y-10 p-6">
      <AccountSummary accounts={accounts} />

      <div className="space-y-4">
        <AccountView accounts={accounts} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <DataTable columns={transactionColumns} data={transactions} />
      </div>
    </div>
  );
}
