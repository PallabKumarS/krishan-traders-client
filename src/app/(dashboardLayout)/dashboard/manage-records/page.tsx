import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Records | Krishan Traders",
  description: "View and manage transaction records for Krishan Traders",
};

const ManageRecordsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Transaction Records</h1>
      <p className="text-muted-foreground mb-8">
        View, filter, and export transaction records for your business.
      </p>
      
      {/* Records table will be added here */}
      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-center text-muted-foreground">
          Transaction records table will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default ManageRecordsPage;