import { Metadata } from "next";
import { Suspense } from "react";
import SaleDetailView from "./components/SaleDetailView";
import LoadingData from "@/components/shared/LoadingData";
import { getSingleSell } from "@/services/SellService";

export const metadata: Metadata = {
  title: "Sale Details | Krishan Traders",
};

const SaleDetailPage = async ({ params }: { params: Promise<{ saleId: string }> }) => {
  const { saleId } = await params;
  const salePromise = getSingleSell(saleId);

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<LoadingData />}>
        <SaleDetailView salePromise={salePromise} />
      </Suspense>
    </div>
  );
};

export default SaleDetailPage;
