// app/account/page.tsx

import LoadingData from "@/components/shared/LoadingData";
import { getAllAccounts } from "@/services/Account";
import { getAllTransactions } from "@/services/AccountTransactions";
import { Metadata } from "next";
import { Suspense } from "react";
import AccountPage from "./AccountPage";

export const metadata: Metadata = {
  title: "Account | Krishan Traders",
  description: "Manage your account settings for Krishan Traders",
};

// 1. Make the component async
const Page = async () => {
  const accountsPromise = getAllAccounts();
  const transactionsPromise = getAllTransactions();

  return (
    // 3. Pass the promises as props to the Client Component
    <Suspense fallback={<LoadingData />}>
      <AccountPage
        accountsPromise={accountsPromise}
        transactionsPromise={transactionsPromise}
      />
    </Suspense>
  );
};

export default Page;
