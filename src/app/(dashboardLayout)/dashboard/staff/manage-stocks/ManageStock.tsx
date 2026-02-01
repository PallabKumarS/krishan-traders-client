/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GroupedTable } from "@/components/ui/grouped-table";
import LoadingData from "@/components/shared/LoadingData";

import { getAllCompany } from "@/services/CompanyService";
import { getAllStocksByCompany } from "@/services/StockService";

import { TCompany, TMongoose } from "@/types";
import { StockTableRow } from "./utils";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import StockAddForm from "@/components/forms/StockAddForm";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// biome-ignore lint/correctness/noUnusedFunctionParameters: <>
const ManageStock = ({ query }: { query: Record<string, unknown> }) => {
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
      render: (value: any) =>
        value ? (
          <Badge variant="secondary" className="font-normal">
            {value}
          </Badge>
        ) : (
          "—"
        ),
    },
    {
      key: "unitQuantity",
      title: "Unit",
      sortable: true,
      render: (value: any, row: StockTableRow) =>
        `${row.unitQuantity} ${row.unit}`,
    },
    {
      key: "totalQuantity",
      title: "Stock Qty",
      sortable: true,
      render: (value: any) => (
        <span
          className={`font-medium ${
            Number(value) < 10
              ? "text-red-500"
              : Number(value) < 50
                ? "text-yellow-500"
                : "text-green-500"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "buyingPrice",
      title: "Buy Price",
      sortable: true,
      render: (value: any) => `₹${Number(value).toFixed(2)}`,
    },
    {
      key: "sellingPrice",
      title: "Sell Price",
      sortable: true,
      render: (value: any) => `₹${Number(value).toFixed(2)}`,
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
          className="flex flex-wrap gap-5 h-full border mb-3"
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
            content={<StockAddForm selectedCompany={selectedCompany} />}
          />
        </div>

        <TabsContent value={selectedCompany?._id as string}>
          <GroupedTable
            data={stocks}
            columns={stockColumns}
            groupBy="productName"
            searchKeys={["productName", "sizeLabel", "unit"]}
            enableColumnToggle
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageStock;
