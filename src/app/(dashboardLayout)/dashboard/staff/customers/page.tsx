import { Metadata } from "next";
import { getCustomersPromise } from "./utils";
import CustomersTable from "./components/CustomersTable";

export const metadata: Metadata = {
  title: "Manage Customers | Krishan Traders",
  description: "View and manage all customer records",
};

const CustomersPage = async () => {
  // Pre-fetch initial data
  const initialCustomersPromise = getCustomersPromise();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Customers</h1>
      </div>
      <CustomersTable initialCustomersPromise={initialCustomersPromise} />
    </div>
  );
};

export default CustomersPage;
