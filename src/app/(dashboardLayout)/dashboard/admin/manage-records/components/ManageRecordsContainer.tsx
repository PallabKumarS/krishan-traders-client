"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";

import { TRecord, TStockAddRequest, TStockSellRequest } from "@/types";
import RecordsTab from "./RecordsTab";
import BuyRequestsTab from "./BuyRequestsTab";
import SaleRequestsTab from "./SaleRequestsTab";

interface ManageRecordsContainerProps {
  recordsPromise: Promise<{ data: TRecord[] }>;
  buyRequestsPromise: Promise<{ data: TStockAddRequest[] }>;
  saleRequestsPromise: Promise<{ data: TStockSellRequest[] }>;
}

export default function ManageRecordsContainer({
  recordsPromise,
  buyRequestsPromise,
  saleRequestsPromise,
}: ManageRecordsContainerProps) {
  return (
    <Tabs defaultValue="records" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="records">Records</TabsTrigger>
        <TabsTrigger value="buy-requests">Buy Requests</TabsTrigger>
        <TabsTrigger value="sale-requests">Sale Requests</TabsTrigger>
      </TabsList>

      <TabsContent value="records">
        <Suspense fallback={<div>Loading Records...</div>}>
          <RecordsTab recordsPromise={recordsPromise} />
        </Suspense>
      </TabsContent>

      <TabsContent value="buy-requests">
        <Suspense fallback={<div>Loading Buy Requests...</div>}>
          <BuyRequestsTab buyRequestsPromise={buyRequestsPromise} />
        </Suspense>
      </TabsContent>

      <TabsContent value="sale-requests">
        <Suspense fallback={<div>Loading Sale Requests...</div>}>
          <SaleRequestsTab saleRequestsPromise={saleRequestsPromise} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
