/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import { Suspense, use, useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GroupedTable } from "@/components/ui/grouped-table";
import LoadingData from "@/components/shared/LoadingData";
import { deleteStock } from "@/services/StockService";
import { TCompany, TStock, TStockStatus } from "@/types";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import StockAddForm from "@/components/forms/StockAddForm";
import { Boxes, Pen, PillBottleIcon, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { toast } from "sonner";
import Link from "next/link";
import { clearCache, getCompaniesPromise, getStocksPromise } from "./utils";

// TODO Error showing on development mode. Need to fix later.

// biome-ignore lint/correctness/noUnusedFunctionParameters: <>
const ManageStock = ({ query }: { query: Record<string, unknown> }) => {
  // Main data states
  const [refreshKey, setRefreshKey] = useState(0); // Key to force refresh
  const [selectedCompany, setSelectedCompany] = useState<TCompany | null>(null);
  const [editStock, setEditStock] = useState<TStock | null>(null);

  // Create a new promise each time the refresh key changes
  const companiesPromise = useMemo(
    () => getCompaniesPromise(refreshKey),
    [refreshKey],
  );
  const companies = use(companiesPromise);

  // Set the initial selected company if not set
  if (!selectedCompany && companies.length > 0) {
    setSelectedCompany(companies[0]);
  }

  const stocksPromise = useMemo(() => {
    if (!selectedCompany) return Promise.resolve([]);
    return getStocksPromise(selectedCompany._id, refreshKey);
  }, [selectedCompany, refreshKey]);
  const stocks = selectedCompany ? use(stocksPromise) : [];

  // Function to handle stock deletion
  const handleDeleteStock = async (stockId: string) => {
    const toastId = toast.loading("Deleting stock...");

    try {
      const res = await deleteStock(stockId);
      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
        // Force refresh by clearing cache and incrementing the key
        clearCache();
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(error.message, {
        id: toastId,
      });
    }
  };

  //   stock columns for GroupedTable
  const stockColumns = [
    {
      key: "productName",
      title: "Product",
      sortable: true,
    },
    {
      key: "sizeLabel",
      title: "Size",
      sortable: true,
      render: (value: TStock["size"]["label"]) =>
        value ? (
          <Badge variant="secondary" className="font-normal">
            {value}
          </Badge>
        ) : (
          "—"
        ),
    },
    {
      key: "quantity",
      title: "Quantity",
      sortable: true,
      render: (_value: TStock["quantity"], row: TStock) => (
        <p className="flex gap-2 items-center justify-center">
          <span className="flex items-center">
            <Boxes className="mr-2 h-4 w-4" />{" "}
            {Math.floor(row.quantity / row.size.stackCount)}
          </span>{" "}
          |{" "}
          <span>
            <span className="flex items-center">
              <PillBottleIcon className="mr-2 h-4 w-4" />{" "}
              {row.quantity % row.size.stackCount}
            </span>
          </span>
        </p>
      ),
    },
    {
      key: "buyingPrice",
      title: "Buy Price",
      sortable: true,
      render: (value: TStock["buyingPrice"]) =>
        `${Number(value).toFixed(2)} BDT`,
    },
    {
      key: "sellingPrice",
      title: "Sell Price",
      sortable: true,
      render: (value: TStock["sellingPrice"]) =>
        `${Number(value).toFixed(2)} BDT`,
    },
    {
      key: "expiryDate",
      title: "Expiry Date",
      sortable: true,
      render: (value: TStock["expiryDate"]) =>
        `${new Date(value).toDateString()}`,
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value: TStockStatus) => (
        <Badge
          variant={
            value === "available"
              ? "default"
              : value === "sold"
                ? "secondary"
                : "destructive"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "stockedBy.name",
      title: "Stocked",
      sortable: false,
      render: (_value: TStock["stockedBy"]["name"], row: TStock) => (
        <Link href={"/dashboard/admin/manage-members"}>
          <p className="flex flex-col justify-center">
            <span className="hover:underline">{row.stockedBy.name}</span>
            <span className="text-muted-foreground">
              ({new Date(row.stockedDate).toDateString()})
            </span>
          </p>
        </Link>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_value: any, row: TStock) => (
        <div className="flex items-center justify-center gap-2">
          {row._id !== "empty" && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditStock(row)}
              >
                <Pen className="h-4 w-4" />
              </Button>
              <ConfirmationBox
                trigger={
                  <Button size="sm" variant="ghost">
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                }
                onConfirm={() => handleDeleteStock(row._id)}
                title="Delete this size?"
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Stock Overview</h1>

      <Suspense fallback={<LoadingData />}>
        <Tabs defaultValue={selectedCompany?._id}>
          {/* COMPANY TABS */}
          <TabsList
            defaultValue={companies?.[0]?._id}
            className="flex flex-wrap gap-5 h-full border mb-3"
          >
            {companies.map((company: TCompany) => (
              <div
                key={company._id}
                onClick={() => setSelectedCompany(company)}
                className={`flex items-center min-w-60 border border-accent rounded-xl ${company.isDisabled && "opacity-50"} ${
                  selectedCompany?._id === company._id && "bg-accent/50"
                }`}
              >
                <TabsTrigger
                  value={company._id}
                  className={`grow px-4 data-[state=active]:bg-bg-accent/50 data-[state=active]:shadow-none`}
                >
                  {company.name}
                </TabsTrigger>
              </div>
            ))}
          </TabsList>
          {/* add stock modal */}
          <div className="flex justify-end mb-3">
            <Modal
              title="Add Stock"
              trigger={
                <Button className="w-60">
                  <Plus className="ml-2 h-4 w-4" />
                  <span>Add Stock</span>
                </Button>
              }
              content={
                <StockAddForm
                  selectedCompany={selectedCompany}
                  onSuccess={() => {
                    // Force refresh by incrementing the key
                    clearCache();
                    setRefreshKey((prev) => prev + 1);
                  }}
                />
              }
            />
          </div>

          <TabsContent value={selectedCompany?._id as string}>
            <GroupedTable
              data={stocks}
              columns={stockColumns}
              groupBy="productName"
              searchKeys={["productName", "sizeLabel"]}
              enableColumnToggle
            />
          </TabsContent>
        </Tabs>

        {/* edit stock modal */}
        <Modal
          trigger={null}
          title="Edit Stock"
          open={!!editStock}
          onOpenChange={(open) => {
            if (!open) setEditStock(null);
          }}
          content={
            editStock && (
              <StockAddForm
                edit
                stockData={editStock}
                selectedCompany={selectedCompany}
                onSuccess={() => {
                  // Force refresh by incrementing the key
                  clearCache();
                  setRefreshKey((prev) => prev + 1);
                  setEditStock(null);
                }}
              />
            )
          }
        />
      </Suspense>
    </div>
  );
};

export default ManageStock;
