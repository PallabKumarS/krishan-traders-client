/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import { Suspense, use, useState, useMemo, useEffect } from "react";

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
import {
  clearCache,
  getCompaniesPromise,
  getStocksPromise,
  getStatsPromise,
} from "./utils";

// TODO Error showing on development mode. Need to fix later.

const ALL_COMPANY_ID = "all";

const ManageStock = ({
  // biome-ignore lint/correctness/noUnusedFunctionParameters: <>
  query,
  initialCompaniesPromise,
  initialStocksPromise,
  initialStatsPromise,
}: {
  query: Record<string, unknown>;
  initialCompaniesPromise: Promise<TCompany[]>;
  initialStocksPromise: Promise<TStock[]>;
  initialStatsPromise: Promise<{
    totalProducts: number;
    itemsSold: number;
    lowStockCount: number;
    expiringSoonCount: number;
    inventoryValue: number;
    potentialRevenue: number;
  }>;
}) => {
  // Main data states
  const [refreshKey, setRefreshKey] = useState(0); // Key to force refresh
  const [selectedCompanyId, setSelectedCompanyId] =
    useState<string>(ALL_COMPANY_ID);
  const [editStock, setEditStock] = useState<TStock | null>(null);

  // modal states
  const [addStockModalOpen, setAddStockModalOpen] = useState(false);

  // Active promises state
  const [companiesPromise, setCompaniesPromise] = useState(
    initialCompaniesPromise,
  );
  const [stocksPromise, setStocksPromise] = useState(initialStocksPromise);
  const [statsPromise, setStatsPromise] = useState(initialStatsPromise);

  // Update promises when dependencies change
  useEffect(() => {
    setCompaniesPromise(getCompaniesPromise(refreshKey));
  }, [refreshKey]);

  useEffect(() => {
    setStocksPromise(getStocksPromise(selectedCompanyId, refreshKey));
    setStatsPromise(getStatsPromise(selectedCompanyId, refreshKey));
  }, [selectedCompanyId, refreshKey]);

  const companies = use(companiesPromise);
  const stocks = use(stocksPromise);
  const stats = use(statsPromise);

  const selectedCompany = useMemo(() => {
    if (selectedCompanyId === ALL_COMPANY_ID) return null;
    return companies.find((c: TCompany) => c._id === selectedCompanyId) || null;
  }, [companies, selectedCompanyId]);

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
            {row.size?.stackCount
              ? Math.floor(row.quantity / row.size.stackCount)
              : row.quantity}
          </span>{" "}
          |{" "}
          <span>
            <span className="flex items-center">
              <PillBottleIcon className="mr-2 h-4 w-4" />{" "}
              {row.size?.stackCount ? row.quantity % row.size.stackCount : 0}
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
            <span className="hover:underline">
              {row.stockedBy?.name ?? "Unknown"}
            </span>
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
        <Tabs value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
          {/* COMPANY TABS */}
          <TabsList className="flex flex-wrap gap-5 h-full border mb-3">
            {/* ALL COMPANIES TAB */}
            <div
              className={`flex items-center min-w-60 border border-accent rounded-xl ${
                selectedCompanyId === ALL_COMPANY_ID && "bg-accent/50"
              }`}
            >
              <TabsTrigger
                value={ALL_COMPANY_ID}
                className={`grow px-4 data-[state=active]:bg-bg-accent/50 data-[state=active]:shadow-none`}
              >
                All Companies
              </TabsTrigger>
            </div>

            {companies.map((company: TCompany) => (
              <div
                key={company._id}
                className={`flex items-center min-w-60 border border-accent rounded-xl ${company.isDisabled && "opacity-50"} ${
                  selectedCompanyId === company._id && "bg-accent/50"
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

          {/* STATISTICS SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <div className="bg-accent/10 p-4 rounded-xl border border-accent/50 flex flex-col gap-1">
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <PillBottleIcon className="h-4 w-4" /> Products
              </span>
              <span className="text-2xl font-bold">
                {stats?.totalProducts ?? 0}
              </span>
            </div>

            <div className="bg-accent/10 p-4 rounded-xl border border-accent/50 flex flex-col gap-1">
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <Boxes className="h-4 w-4" /> Items Sold
              </span>
              <span className="text-2xl font-bold">
                {stats?.itemsSold ?? 0}
              </span>
            </div>

            <div
              className={`p-4 rounded-xl border flex flex-col gap-1 ${(stats?.lowStockCount ?? 0) > 0 ? "bg-destructive/10 border-destructive/50" : "bg-accent/10 border-accent/50"}`}
            >
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <Plus className="h-4 w-4 rotate-45" /> Low Stock
              </span>
              <span
                className={`text-2xl font-bold ${(stats?.lowStockCount ?? 0) > 0 ? "text-destructive" : ""}`}
              >
                {stats?.lowStockCount ?? 0}
              </span>
            </div>

            <div
              className={`p-4 rounded-xl border flex flex-col gap-1 ${(stats?.expiringSoonCount ?? 0) > 0 ? "bg-orange-500/10 border-orange-500/50" : "bg-accent/10 border-accent/50"}`}
            >
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <Trash className="h-4 w-4" /> Expiring Soon
              </span>
              <span
                className={`text-2xl font-bold ${(stats?.expiringSoonCount ?? 0) > 0 ? "text-orange-500" : ""}`}
              >
                {stats?.expiringSoonCount ?? 0}
              </span>
            </div>

            <div className="bg-accent/10 p-4 rounded-xl border border-accent/50 flex flex-col gap-1">
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-2 text-green-600">
                Inventory Value
              </span>
              <span className="text-2xl font-bold font-mono">
                ৳{(stats?.inventoryValue ?? 0).toLocaleString()}
              </span>
            </div>

            <div className="bg-primary/10 p-4 rounded-xl border border-primary/50 flex flex-col gap-1">
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-2 text-primary">
                Est. Profit
              </span>
              <span className="text-2xl font-bold font-mono text-primary">
                ৳
                {(
                  (stats?.potentialRevenue ?? 0) - (stats?.inventoryValue ?? 0)
                ).toLocaleString()}
              </span>
            </div>
          </div>

          {/* add stock modal */}
          <div className="flex justify-end mb-3">
            <Modal
              open={addStockModalOpen}
              onOpenChange={setAddStockModalOpen}
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
                    setAddStockModalOpen(false);
                    clearCache();
                    setRefreshKey((prev) => prev + 1);
                  }}
                />
              }
            />
          </div>

          <TabsContent value={selectedCompanyId}>
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
