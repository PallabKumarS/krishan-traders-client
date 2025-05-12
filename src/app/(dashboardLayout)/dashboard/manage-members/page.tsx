import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Members | Krishan Traders",
  description: "Add and manage team members for Krishan Traders",
};

const ManageMembersPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Team Members</h1>
      <p className="text-muted-foreground mb-8">
        Add, edit, or remove team members and manage their access permissions.
      </p>
      
      {/* Members list will be added here */}
      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-center text-muted-foreground">
          Team members management interface will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default ManageMembersPage;