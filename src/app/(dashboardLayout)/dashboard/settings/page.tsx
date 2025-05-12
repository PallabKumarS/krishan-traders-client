import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Krishan Traders",
  description: "Configure system settings for Krishan Traders management system",
};

const SettingsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>
      <p className="text-muted-foreground mb-8">
        Configure application settings and preferences for Krishan Traders.
      </p>
      
      {/* Settings form will be added here */}
      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-center text-muted-foreground">
          System settings configuration interface will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;