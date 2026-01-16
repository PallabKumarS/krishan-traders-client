/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
"use client";

import CompanyForm from "@/components/forms/CompanyForm";
import ProductForm from "@/components/forms/ProductForm";
import LoadingData from "@/components/shared/LoadingData";
import { Modal } from "@/components/shared/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getAllCompany } from "@/services/CompanyService";
import { getAllSizes } from "@/services/SizeService";
import { TCompany, TMongoose, TProduct, TSize } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
const ManageInfoPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSizeLoading, setIsSizeLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<(TCompany & TMongoose) | null>(
    null
  );
  const [editProduct, setEditProduct] = useState<(TProduct & TMongoose) | null>(
    null
  );
  const [selectedCompany, setSelectedCompany] = useState<
    (TCompany & TMongoose) | null
  >(null);

  // data states
  const [companies, setCompanies] = useState<(TCompany & TMongoose)[]>([]);
  const [sizes, setSizes] = useState<(TSize & TMongoose)[]>([]);

  // load companies
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
  useEffect(() => {
    fetchCompanies();
  }, []);

  // size loading
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
  useEffect(() => {
    fetchSizes();
  }, []);

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
      enableSorting: true,
      header: ({ column }) => (
        <SortableHeader column={column} title="Product Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium flex gap-2 justify-center items-center">
          <span>{row.original.product.name}</span>
          {/* Edit button */}
          <Button
            size="icon"
            variant="ghost"
            className="h-4 w-4 p-3"
            onClick={(e) => {
              e.stopPropagation();
              setEditProduct({
                ...row.original.product,
                _id: row.original.product._id,
              });
            }}
          >
            <Pen className="h-6 w-6" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "label",
      enableSorting: true,
      header: ({ column }) => (
        <SortableHeader column={column} title="Size Label" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("label")}</div>
      ),
    },
    {
      accessorKey: "unitQuantity",
      enableSorting: true,
      header: ({ column }) => (
        <SortableHeader column={column} title="Unit Quantity" />
      ),
      cell: ({ row }) => {
        const quantity = row.getValue("unitQuantity") as number;
        return (
          <div>
            {quantity} {row.original.unit}
          </div>
        );
      },
    },
    {
      accessorKey: "stackCount",
      enableSorting: true,
      header: ({ column }) => (
        <SortableHeader column={column} title="Stack Count" />
      ),
    },
    {
      accessorKey: "isActive",
      enableSorting: false,
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
        <TabsList className="flex flex-wrap gap-5 h-full border mb-5">
          {companies.map((company) => (
            <div
              key={company._id}
              className={`flex items-center gap-2 min-w-60 border border-accent rounded-xl ${
                selectedCompany?._id === company._id && "bg-accent/50"
              } ${company.isDisabled && "opacity-50"}`}
            >
              {/* TAB */}
              <TabsTrigger
                value={company._id}
                onClick={() => setSelectedCompany(company)}
                className="px-4 grow data-[state=active]:bg-base data-[state=active]:shadow-none"
              >
                <span className="truncate">{company.name}</span>
              </TabsTrigger>

              {/* Edit button */}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 border-l border-accent text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditCompany(company);
                }}
              >
                <Pen className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {/* Add company */}
          <Modal
            key={"add-company"}
            title="Add New Company"
            trigger={
              <Button className="gap-2 min-w-60">
                <Plus className="h-4 w-4" />
                Add Company
              </Button>
            }
            content={
              <CompanyForm
                edit={false}
                onSuccess={() => {
                  fetchCompanies();
                  setAddModalOpen(false);
                }}
              />
            }
            open={addModalOpen}
            onOpenChange={setAddModalOpen}
          />
        </TabsList>

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

      {/* edit company modal */}
      <Modal
        trigger={null}
        title="Edit Company"
        open={!!editCompany}
        onOpenChange={(open) => {
          if (!open) setEditCompany(null);
        }}
        content={
          editCompany && (
            <CompanyForm
              edit
              companyData={editCompany}
              onSuccess={() => {
                fetchCompanies();
                setEditCompany(null);
              }}
            />
          )
        }
      />

      {/* edit product modal */}
      <Modal
        trigger={null}
        title="Edit Product"
        open={!!editProduct}
        onOpenChange={(open) => {
          if (!open) setEditProduct(null);
        }}
        content={
          editProduct && (
            <ProductForm
              edit
              productData={editProduct}
              companies={companies}
              onSuccess={() => {
                fetchSizes();
                setEditProduct(null);
              }}
            />
          )
        }
      />
    </div>
  );
};

export default ManageInfoPage;
