"use client";

import { use } from "react";
import { TStockSellRequest } from "@/types";
import { GroupedTable } from "@/components/ui/grouped-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { acceptSellStockRequest } from "@/services/RequestService";

interface SaleRequestsTabProps {
  saleRequestsPromise: Promise<{ data: TStockSellRequest[] }>;
}

export default function SaleRequestsTab({ saleRequestsPromise }: SaleRequestsTabProps) {
  const requests = use(saleRequestsPromise)?.data || [];

  const handleAction = async (id: string, status: "accepted" | "rejected") => {
    const toastId = toast.loading(`${status === "accepted" ? "Accepting" : "Rejecting"} request...`);
    try {
      const res = await acceptSellStockRequest(id, status);
      if (res.success) {
        toast.success(res.message, { id: toastId });
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { id: toastId });
    }
  };

  // Flatten data for GroupedTable if necessary, but GroupedTable seems to expect a flat array and handles grouping
  // Looking at SaleRequest, it has an array of 'stocks'. GroupedTable might need one row per stock item.
  
  const flattenedData = requests.flatMap(req => 
    req.stocks.map(item => ({
      ...req,
      _requestId: req._id, // Keep original ID for actions
      stockItem: item.stock,
      quantity: item.quantity,
      // Create a unique key for grouping that includes metadata
      groupKey: `${req._id}_${req.createdAt}`
    }))
  );

  const columns = [
    {
      key: "groupKey",
      title: "Request Info",
      render: (_: any, row: any) => (
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold">
            {format(new Date(row.createdAt), "dd MMM HH:mm")}
          </span>
          <span className="text-[10px]">{row.requestedBy?.name}</span>
          <Badge className="mt-1 scale-75 capitalize" variant={row.status === "pending" ? "outline" : row.status === "accepted" ? "default" : "destructive"}>
            {row.status}
          </Badge>
        </div>
      )
    },
    {
      key: "stockItem.size.product.name",
      title: "Product",
      render: (_: any, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.stockItem?.size?.product?.name}</span>
          <span className="text-[10px] text-muted-foreground">
            {row.stockItem?.size?.label} {row.stockItem?.size?.unit}
          </span>
        </div>
      )
    },
    {
      key: "quantity",
      title: "Qty"
    },
    {
      key: "soldTo",
      title: "Customer",
      render: (val: any) => {
          if(typeof val === 'string') return val;
          return val?.name || val?.phoneNumber || "Walk-in";
      }
    },
    {
      key: "actions",
      title: "Actions",
      render: (_: any, row: any) => {
        if (row.status !== "pending") return null;
        return (
          <div className="flex items-center gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-green-600 border-green-200"
              onClick={() => handleAction(row._requestId, "accepted")}
            >
              <Check className="h-4 w-4 mr-1" /> Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-destructive border-destructive/20"
              onClick={() => handleAction(row._requestId, "rejected")}
            >
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-4">
      <GroupedTable
        data={flattenedData}
        columns={columns}
        groupBy="groupKey"
        searchKeys={["stockItem.size.product.name", "requestedBy.name", "soldTo.name"]}
      />
    </div>
  );
}
