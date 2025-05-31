"use client";

import { getAllRecords } from "@/services/RecordService";
import { TMeta, TRecord } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PaginationComponent } from "../shared/PaginationComponent";
import LoadingData from "../shared/LoadingData";
import { Package } from "lucide-react";
import RecordCard from "./RecordCard";

const PendingStockManagement = ({
  query,
}: {
  query: Record<string, unknown>;
}) => {
  const [records, setRecords] = useState<TRecord[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsFetching(true);
      try {
        const res = await getAllRecords({
          ...query,
          status: "pending",
          sort: "createdAt",
        });

        if (res.success) {
          setRecords(res.data);
          setMeta(res.meta);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchRecords();
  }, [query]);

  return (
    <div className="space-y-6">
      {renderRecordsList()}
      {meta && <PaginationComponent meta={meta} />}
    </div>
  );

  //   extra function to do the rendering of the records list
  function renderRecordsList() {
    if (isFetching) return <LoadingData />;

    if (records.length === 0) {
      return (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Transactions Found</h3>
          <p className="text-muted-foreground">
            There are no transactions matching your current filter.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-4 mb-10">
        {records.map((record) => (
          <RecordCard key={record._id} record={record} />
        ))}
      </div>
    );
  }
};

export default PendingStockManagement;
