/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import CompanyForm from "@/components/forms/CompanyForm";
import ProductTableForDesktop from "@/components/modules/manage-info/ProductTableForDesktop";
import SizeTableForDesktop from "@/components/modules/manage-info/SizeTableForDesktop";
import LoadingData from "@/components/shared/LoadingData";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAllCompany } from "@/services/CompanyService";
import { getAllProductsByCompany } from "@/services/ProductService";
import { TCompany, TMongoose, TProduct } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
const ManageInfoPage = () => {
  const [companies, setCompanies] = useState<(TCompany & TMongoose)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<
    (TCompany & TMongoose) | null
  >(null);
  const [products, setProducts] = useState<(TProduct & TMongoose)[]>([]);

  //   load companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getAllCompany();
        if (data?.success && data.data.length > 0) {
          setCompanies(data.data);
          setSelectedCompany(data.data[0]);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  //   load products based on companies
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProductsByCompany(
          selectedCompany?._id as string
        );
        if (data?.success) {
          setProducts(data.data);
        }
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [selectedCompany]);

  const handleAddSuccess = () => {
    setAddModalOpen(false);
    window.location.reload();
  };

  if (isLoading) {
    return <LoadingData />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Information</h1>

      <Tabs defaultValue={companies?.[0]?._id} className="w-full h-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-5 h-full border">
          {companies.map((company) => (
            <TabsTrigger
              className="border-2 border-accent "
              onClick={() => setSelectedCompany(company)}
              key={company._id}
              value={company._id}
            >
              {company.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* add company and product */}
        <div className="flex justify-end">
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

        <TabsContent value="companies">
          <DataTable
            columns={[]}
            data={[]}
            enablePagination={false}
            enableColumnToggle={false}
          />
        </TabsContent>

        <TabsContent value="products">
          <ProductTableForDesktop />
        </TabsContent>

        <TabsContent value="sizes">
          <SizeTableForDesktop />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageInfoPage;
