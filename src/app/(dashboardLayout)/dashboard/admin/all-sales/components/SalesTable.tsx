"use client";

import { use } from "react";
import { TSell } from "@/types";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { toast } from "sonner";
import { deleteSell } from "@/services/SellService";

interface SalesTableProps {
  salesPromise: Promise<{ data: TSell[]; success: boolean }>;
}

export default function SalesTable({ salesPromise }: SalesTableProps) {
  const res = use(salesPromise);
  const sales = res?.data || [];

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting sale...");
    try {
      const res = await deleteSell(id);
      if (res.success) {
        toast.success(res.message || "Sale deleted successfully", { id: toastId });
      } else {
        toast.error(res.message || "Failed to delete sale", { id: toastId });
      }
    // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { id: toastId });
    }
  };

  const columns: ColumnDef<TSell>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortableHeader column={column} title="Date" />,
      cell: ({ row }) => (
        <span className="text-xs">
          {format(new Date(row.original.createdAt), "dd MMM yyyy HH:mm")}
        </span>
      ),
    },
    {
      accessorKey: "_id",
      header: "Sale ID",
      cell: ({ row }) => (
        <span className="text-[10px] font-mono uppercase bg-muted px-1 rounded">
          {row.original._id.slice(-8)}
        </span>
      ),
    },
    {
      accessorKey: "soldTo",
      header: "Customer",
      cell: ({ row }) => {
        const soldTo = row.original.soldTo;
        if (typeof soldTo === "string") return <span>{soldTo}</span>;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-xs">{soldTo.name || "Walk-in"}</span>
            <span className="text-[10px] text-muted-foreground">{soldTo.phoneNumber}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => <SortableHeader column={column} title="Total" />,
      cell: ({ row }) => (
        <span className="font-bold">৳{row.original.totalAmount.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "totalProfit",
      header: "Profit",
      cell: ({ row }) => (
        <span className="text-green-600 font-medium">৳{row.original.totalProfit.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "soldBy.name",
      header: "Sold By",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-normal">
          {row.original.soldBy?.name || "N/A"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/admin/all-sales/${row.original._id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/staff/invoice/sell/${row.original._id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
              <Printer className="h-4 w-4" />
            </Button>
          </Link>
          <ConfirmationBox
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            onConfirm={() => handleDelete(row.original._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={sales}
        searchKey="_id"
        enableColumnToggle
        enablePagination
      />
    </div>
  );
}
