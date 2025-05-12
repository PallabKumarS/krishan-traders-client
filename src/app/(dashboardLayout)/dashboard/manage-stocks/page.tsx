import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Stocks | Krishan Traders",
  description: "View and manage existing stock inventory for Krishan Traders",
};

const ManageStocksPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      <p className="text-muted-foreground mb-8">
        View current stock levels, update quantities, and manage product information.
      </p>
      
      {/* Stock table will be added here */}
      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-center text-muted-foreground">
          Stock inventory management interface will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default ManageStocksPage;