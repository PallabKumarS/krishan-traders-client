"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TCompany } from "@/types";
import { getAllCompany } from "@/services/CompanyService";
import { Button } from "@/components/ui/button";
import { Modal } from "../shared/Modal";
import { Building2, Plus } from "lucide-react";
import CompanyCard from "./CompanyCard";
import LoadingData from "../shared/LoadingData";
import CompanyForm from "../forms/CompanyForm";

const CompanyManagement = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [companyData, setCompanyData] = useState<TCompany[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchCompanies = async () => {
    setIsFetching(true);
    try {
      const res = await getAllCompany();
      if (res?.success) {
        setCompanyData(res.data);
      } else {
        toast.error("Failed to fetch companies");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch companies");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddSuccess = () => {
    setAddModalOpen(false);
    fetchCompanies(); // Refresh the list
  };

  const handleUpdate = () => {
    fetchCompanies(); // Refresh the list after edit/delete
  };

  if (isFetching) {
    return <LoadingData />;
  }

  return (
    <div className="mx-auto">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Company Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your business partners and suppliers
          </p>
        </div>
        <Modal
          title="Add New Company"
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Company
            </Button>
          }
          content={<CompanyForm edit={false} onSuccess={handleAddSuccess} />}
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
        />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Companies</p>
              <p className="text-2xl font-bold">{companyData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Partners</p>
              <p className="text-2xl font-bold">
                {companyData.filter((c) => c.isDisabled === false).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recent Additions</p>
              <p className="text-2xl font-bold">
                {
                  companyData.filter((company) => {
                    const createdDate = new Date(company.createdAt);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return createdDate > thirtyDaysAgo;
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      {companyData.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Companies Found</h3>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t added any companies yet. Start by adding your first
            business partner.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6">
          {companyData.map((company) => (
            <CompanyCard
              key={company._id}
              company={company}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
