"use client";

import { use } from "react";
import { TStockAddRequest } from "@/types";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { acceptAddStockRequest } from "@/services/RequestService";

interface BuyRequestsTabProps {
  buyRequestsPromise: Promise<{ data: TStockAddRequest[] }>;
}

export default function BuyRequestsTab({ buyRequestsPromise }: BuyRequestsTabProps) {
  const requests = use(buyRequestsPromise)?.data || [];

  const handleAction = async (id: string, status: "accepted" | "rejected") => {
    const toastId = toast.loading(`${status === "accepted" ? "Accepting" : "Rejecting"} request...`);
    try {
      const res = await acceptAddStockRequest(id, status);
      if (res.success) {
        toast.success(res.message, { id: toastId });
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { id: toastId });
    }
  };

  const columns: ColumnDef<TStockAddRequest>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortableHeader column={column} title="Date" />,
      cell: ({ row }) => (
        <span className="text-xs">
          {format(new Date(row.original.createdAt), "dd MMM yyyy")}
        </span>
      ),
    },
    {
      accessorKey: "size.product.name",
      id: "product_name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex flex-col items-center">
          <span className="font-medium text-center">{row.original.size.product.name}</span>
          <span className="text-[10px] text-muted-foreground">
            {row.original.size.label} ({row.original.size.unit})
          </span>
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Qty",
    },
    {
      accessorKey: "buyingPrice",
      header: "Buy Price",
      cell: ({ row }) => <span>৳{row.original.buyingPrice}</span>,
    },
    {
      accessorKey: "sellingPrice",
      header: "Sell Price",
      cell: ({ row }) => <span>৳{row.original.sellingPrice}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
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
      header: "Requested By",
      cell: ({ row }) => <span className="text-xs">{row.original.requestedBy?.name || "N/A"}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        if (row.original.status !== "pending") return null;
        return (
          <div className="flex items-center gap-2 justify-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => handleAction(row.original._id, "accepted")}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/50"
              onClick={() => handleAction(row.original._id, "rejected")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={requests}
        searchKey="product_name"
        enablePagination
      />
    </div>
  );
}
