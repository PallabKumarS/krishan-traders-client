import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Stock | Krishan Traders",
  description: "Add new fertilizer and agricultural products to inventory",
};

const AddStockPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Stock</h1>
      <p className="text-muted-foreground mb-8">
        Use this form to add new fertilizer and agricultural products to your inventory.
      </p>
      
      {/* Form will be added here */}
      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-center text-muted-foreground">
          Stock addition form will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default AddStockPage;