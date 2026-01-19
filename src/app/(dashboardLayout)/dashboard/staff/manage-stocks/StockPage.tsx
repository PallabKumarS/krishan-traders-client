/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import LoadingData from "@/components/shared/LoadingData";

import { getAllCompany } from "@/services/CompanyService";
import { getAllStocksByCompany } from "@/services/StockService";

import { TCompany, TMongoose } from "@/types";
import { StockTableRow } from "./utils";
import { ColumnDef } from "@tanstack/react-table";

// biome-ignore lint/correctness/noUnusedFunctionParameters: <>
const StockPage = ({ query }: { query: Record<string, unknown> }) => {
  // Main data states
  const [companies, setCompanies] = useState<(TCompany & TMongoose)[]>([]);
  const [stocks, setStocks] = useState<StockTableRow[]>([]);

  const [selectedCompany, setSelectedCompany] = useState<
    (TCompany & TMongoose) | null
  >(null);

  //   loading states
  const [companyLoading, setCompanyLoading] = useState(true);
  const [stockLoading, setStockLoading] = useState(true);

  // load companies
  const fetchCompanies = async () => {
    try {
      const res = await getAllCompany();
      if (res?.success) {
        setCompanies(res.data);
        setSelectedCompany(res.data[0]);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setCompanyLoading(false);
    }
  };

  // load stocks
  const fetchStocks = async (companyId: string) => {
    try {
      const res = await getAllStocksByCompany(companyId);
      if (res?.success) {
        setStocks(res.data);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setStockLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany?._id) {
      fetchStocks(selectedCompany._id);
    }
  }, [selectedCompany]);

  useEffect(() => {
    fetchStocks(selectedCompany?._id as string);
  }, [selectedCompany]);

  //   stock columns
  const stockColumns: ColumnDef<StockTableRow>[] = [
    {
      accessorKey: "productName",
      header: ({ column }) => (
        <SortableHeader column={column} title="Product" />
      ),
    },
    {
      accessorKey: "sizeLabel",
      header: ({ column }) => <SortableHeader column={column} title="Size" />,
    },
    {
      accessorKey: "unitQuantity",
      header: ({ column }) => <SortableHeader column={column} title="Unit" />,
      cell: ({ row }) => `${row.original.unitQuantity} ${row.original.unit}`,
    },
    {
      accessorKey: "totalQuantity",
      header: ({ column }) => (
        <SortableHeader column={column} title="Stock Qty" />
      ),
    },
    {
      accessorKey: "buyingPrice",
      header: ({ column }) => (
        <SortableHeader column={column} title="Buy Price" />
      ),
    },
    {
      accessorKey: "sellingPrice",
      header: ({ column }) => (
        <SortableHeader column={column} title="Sell Price" />
      ),
    },
  ];

  if (companyLoading && stockLoading) return <LoadingData />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Stock Overview</h1>

      <Tabs defaultValue={selectedCompany?._id}>
        {/* COMPANY TABS */}
        <TabsList
          defaultValue={companies?.[0]?._id}
          className="flex flex-wrap gap-5 h-full border mb-5"
        >
          {companies.map((company) => (
            <TabsTrigger
              key={company._id}
              value={company._id}
              onClick={() => setSelectedCompany(company)}
              className={`min-w-60 border border-accent rounded-xl ${company.isDisabled && "opacity-50"} ${
                selectedCompany?._id === company._id && "bg-accent/50"
              } px-4 data-[state=active]:bg-base data-[state=active]:shadow-none`}
            >
              {company.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCompany?._id as string}>
          <DataTable
            columns={stockColumns}
            data={stocks}
            stickyHeader={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockPage;
