/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import CompanyForm from "@/components/forms/CompanyForm";
import ProductTableForDesktop from "@/components/modules/manage-info/ProductTableForDesktop";
import SizeTableForDesktop from "@/components/modules/manage-info/SizeTableForDesktop";
import LoadingData from "@/components/shared/LoadingData";
import { Modal } from "@/components/shared/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getAllCompany } from "@/services/CompanyService";
import { getAllSizes } from "@/services/SizeService";
import { TCompany, TMongoose, TSize } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
const ManageInfoPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSizeLoading, setIsSizeLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [companies, setCompanies] = useState<(TCompany & TMongoose)[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<
    (TCompany & TMongoose) | null
  >(null);
  const [sizes, setSizes] = useState<(TSize & TMongoose)[]>([]);

  // load companies
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

  // size loading
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const data = await getAllSizes();
        if (data?.success) {
          setSizes(data.data);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsSizeLoading(false);
      }
    };

    fetchSizes();
  }, []);

  const handleAddSuccess = () => {
    setAddModalOpen(false);
    window.location.reload();
  };

  type SizeTableData = TSize &
    TMongoose & {
      product: {
        name: string;
        company: {
          name: string;
        };
      };
    };

  // process data
  const processData = useMemo(() => {
    if (!selectedCompany || !sizes.length) {
      return [];
    }

    return sizes.filter(
      (size) => size.product.company._id === selectedCompany._id
    );
  }, [selectedCompany, sizes]);

  const sizeColumns: ColumnDef<SizeTableData>[] = [
    {
      accessorKey: "product.name",
      header: "Product Name",
    },
    {
      accessorKey: "product.company.name",
      header: "Company",
    },
    {
      accessorKey: "label",
      header: "Size Label",
      cell: ({ row }) => {
        const label = row.getValue("label") as string;
        return <div className="font-medium">{label}</div>;
      },
    },
    {
      accessorKey: "unitQuantity",
      header: "Unit Quantity",
      cell: ({ row }) => {
        const quantity = row.getValue("unitQuantity") as number;
        const unit = row.original.unit;
        return (
          <div>
            {quantity} {unit}
          </div>
        );
      },
    },
    {
      accessorKey: "stackCount",
      header: "Stack Count",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge className={cn("bg-slate-500", isActive && "bg-green-500")}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
  ];

  if (isLoading && isSizeLoading) {
    return <LoadingData />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Information</h1>

      <Tabs
        defaultValue={companies?.[0]?._id}
        className="w-full h-full mx-auto"
      >
        <TabsList className="flex flex-wrap gap-5 h-full border mx-auto">
          {companies.map((company) => (
            <TabsTrigger
              className="border-2 border-accent min-w-60 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground:"
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

        <TabsContent value={selectedCompany?._id as string}>
          <DataTable
            columns={processData.length > 0 ? sizeColumns : []}
            data={processData || []}
            enablePagination={false}
            enableColumnToggle={false}
            stickyHeader={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageInfoPage;
