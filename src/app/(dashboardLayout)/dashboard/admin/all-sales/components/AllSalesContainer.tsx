"use client";

import { Suspense } from "react";
import { TSell } from "@/types";
import LoadingData from "@/components/shared/LoadingData";
import SalesTable from "./SalesTable";

interface AllSalesContainerProps {
  salesPromise: Promise<{ data: TSell[]; success: boolean }>;
}

export default function AllSalesContainer({ salesPromise }: AllSalesContainerProps) {
  return (
    <div className="w-full">
      <Suspense fallback={<LoadingData />}>
        <SalesTable salesPromise={salesPromise} />
      </Suspense>
    </div>
  );
}
