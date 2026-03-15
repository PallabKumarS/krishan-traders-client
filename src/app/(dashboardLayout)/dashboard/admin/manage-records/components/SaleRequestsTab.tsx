/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import { use } from "react";
import { TStockSellRequest } from "@/types";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
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

  // Flatten data for DataTable - since we're not using GroupedTable anymore, 
  // we follow the user's request to make it look like Buy Requests tab.
  // We'll show each individual stock item as a row, but grouped by Request Date/ID if needed manually or just listed.
  // The user said "make sure the table is showing like the buy requests tab table"
  
  const flattenedData = requests.flatMap(req => 
    req.stocks.map(item => ({
      ...req,
      _requestId: req._id,
      stockItem: item.stock,
      itemQuantity: item.quantity,
    }))
  );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortableHeader column={column} title="Date" />,
      cell: ({ row }) => (
        <span className="text-xs">
          {format(new Date(row.original.createdAt), "dd MMM HH:mm")}
        </span>
      ),
    },
    {
      accessorKey: "stockItem.size.product.name",
      id: "product_name",
      header: "Product",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-col items-center">
          <span className="font-medium text-center">{row.original.stockItem?.size?.product?.name}</span>
          <span className="text-[10px] text-muted-foreground">
            {row.original.stockItem?.size?.label} {row.original.stockItem?.size?.unit}
          </span>
        </div>
      )
    },
    {
      accessorKey: "itemQuantity",
      header: "Qty",
      enableSorting: false,
    },
    {
      accessorKey: "soldTo",
      header: "Customer",
      enableSorting: false,
      cell: ({ row }) => {
          const val = row.original.soldTo;
          if(typeof val === 'string') return val;
          return val?.name || val?.phoneNumber || "Walk-in";
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={status === "pending" ? "outline" : status === "accepted" ? "default" : "destructive"}
            className="capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "requestedBy.name",
      id: "By",
      header: "By",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => <span className="text-xs">{row.original.requestedBy?.name || "N/A"}</span>,
    },
    {
      id: "Actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        if (row.original.status !== "pending") return null;
        return (
          <div className="flex items-center gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-green-600 border-green-200"
              onClick={() => handleAction(row.original._requestId, "accepted")}
            >
              <Check className="h-4 w-4 mr-1" /> Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-destructive border-destructive/20"
              onClick={() => handleAction(row.original._requestId, "rejected")}
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
      <DataTable
        columns={columns}
        data={flattenedData}
        searchKey="product_name"
        enableColumnToggle
        enablePagination
      />
    </div>
  );
}
