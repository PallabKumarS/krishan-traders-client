import { Metadata } from "next";
import { getAllRecords } from "@/services/RecordService";
import { getAllAddStockRequests, getAllSellStockRequests } from "@/services/RequestService";
import ManageRecordsContainer from "./components/ManageRecordsContainer";

export const metadata: Metadata = {
  title: "Manage Records | Krishan Traders",
  description: "View and manage transaction records for Krishan Traders",
};

const ManageRecordsPage = async ({
    searchParams,
  }: {
    searchParams: Promise<Record<string, unknown>>;
  }) => {
    const query = await searchParams;

    // Fetching data as promises for React.use()
    const recordsPromise = getAllRecords(query);
    const buyRequestsPromise = getAllAddStockRequests();
    const saleRequestsPromise = getAllSellStockRequests();

    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Transaction Records</h1>
            <p className="text-muted-foreground">
                Manage your business records, buy requests, and sale transactions from one place.
            </p>
        </div>

        <ManageRecordsContainer 
            recordsPromise={recordsPromise}
            buyRequestsPromise={buyRequestsPromise}
            saleRequestsPromise={saleRequestsPromise}
        />
      </div>
    );
  };

export default ManageRecordsPage;
