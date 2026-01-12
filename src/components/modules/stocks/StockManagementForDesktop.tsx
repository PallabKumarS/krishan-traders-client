"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/Modal";
import StockAddForm from "@/components/forms/StockAddForm";
import { getAllStocks } from "@/services/StockService";
import { TStock } from "@/types";
import LoadingData from "@/components/shared/LoadingData";
import { toast } from "sonner";
import CompanyStockTableForDesktop from "./CompanyStockTableForDesktop";

type StatusType = "" | "accepted" | "rejected" | "expired" | "sold";

export default function StockManagementForDesktop({
  query,
}: {
  query: Record<string, unknown>;
}) {
  const [stocks, setStocks] = useState<TStock[]>([]);
  const [status, setStatus] = useState<StatusType>("accepted");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStocks() {
      setLoading(true);
      try {
        const res = await getAllStocks({
          ...query,
          status,
          sort: "expiryDate",
        });
        if (res.success) setStocks(res.data);
        // biome-ignore lint/suspicious/noExplicitAny: <>
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStocks();
  }, [query, status]);

  const companies = Array.from(new Set(stocks.map((s) => s.companyName)));

  if (loading) return <LoadingData />;

  return (
    <div className="relative">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center justify-between px-1 py-3">
          <h1 className="text-2xl font-semibold">Stock Management</h1>

          <Modal
            title="Add Stock"
            trigger={
              <Button className="sticky top-16 right-10">Add Stock</Button>
            }
            content={<StockAddForm />}
          />
        </div>

        {/* Sticky Tabs (below header) */}

        <Tabs value={status} onValueChange={(v) => setStatus(v as StatusType)}>
          <TabsList>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable Content */}
      <div className="space-y-10 pt-6">
        {companies.map((company) => (
          <CompanyStockTableForDesktop
            key={company}
            company={company}
            stocks={stocks.filter((s) => s.companyName === company)}
          />
        ))}
      </div>
    </div>
  );
}
