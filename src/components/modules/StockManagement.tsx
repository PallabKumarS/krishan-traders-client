"use client";

import { useEffect, useState } from "react";
import StockAddForm from "../forms/StockAddForm";
import { useAppContext } from "@/providers/ContextProvider";
import { getAllStocks } from "@/services/StockService";
import { TMeta, TStock } from "@/types";
import LoadingData from "../shared/LoadingData";
import { Modal } from "../shared/Modal";
import { Button } from "../ui/button";
import { Package } from "lucide-react";
import { PaginationComponent } from "../shared/PaginationComponent";
import StockCard from "./StockCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type StatusType = "" | "rejected" | "expired" | "accepted" | "sold";

const StockManagement = ({ query }: { query: Record<string, unknown> }) => {
  const [isFetching, setIsFetching] = useState(true);
  const [stockData, setStockData] = useState<TStock[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [activeStatus, setActiveStatus] = useState<StatusType>("accepted");
  const { user } = useAppContext();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await getAllStocks({
          ...query,
          status: activeStatus,
          sort: "expiryDate",
        });

        if (res.success) {
          setStockData(res.data);
          setMeta(res.meta);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchStocks();
  }, [query, activeStatus]);

  const handleTabChange = (value: string) => {
    setActiveStatus(value as StatusType);
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Stock</h1>
        <Modal
          title="Add Stock"
          trigger={<Button variant="secondary">Add Stock</Button>}
          content={<StockAddForm />}
        />
      </div>

      <p className="text-muted-foreground mb-8">
        View, manage, and sell your inventory of fertilizers and agricultural
        products.
      </p>

      {user?.role === "admin" && (
        <Tabs
          defaultValue="accepted"
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="overflow-x-auto pb-2 mx-auto">
            <TabsList className="w-full">
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
              <TabsTrigger value="sold">Sold</TabsTrigger>
              <TabsTrigger value="">All</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="accepted" className="mt-4">
            {renderRecordsList()}
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            {renderRecordsList()}
          </TabsContent>
          <TabsContent value="expired" className="mt-4">
            {renderRecordsList()}
          </TabsContent>
          <TabsContent value="sold" className="mt-4">
            {renderRecordsList()}
          </TabsContent>
          <TabsContent value="" className="mt-4">
            {renderRecordsList()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );

  function renderRecordsList() {
    if (isFetching) return <LoadingData />;

    return (
      <div>
        {stockData.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Stock Available</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any stock items in your inventory yet.
            </p>
            <Modal
              title="Add Stock"
              trigger={<Button>Add Your First Stock</Button>}
              content={<StockAddForm />}
            />
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-4 mb-10">
            {stockData.map((stock) => (
              <StockCard key={stock._id} stock={stock} />
            ))}
          </div>
        )}

        {meta && meta.totalPage > 0 && <PaginationComponent meta={meta} />}
      </div>
    );
  }
};

export default StockManagement;
