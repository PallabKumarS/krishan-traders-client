"use client";

import { use } from "react";
import { TRecord } from "@/types";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { toast } from "sonner";
import { deleteRecord } from "@/services/RecordService";

interface RecordsTabProps {
  recordsPromise: Promise<{ data: TRecord[] }>;
}

export default function RecordsTab({ recordsPromise }: RecordsTabProps) {
  const records = use(recordsPromise)?.data || [];

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting record...");
    try {
      const res = await deleteRecord(id);
      if (res.success) {
        toast.success(res.message, { id: toastId });
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { id: toastId });
    }
  };

  const columns: ColumnDef<TRecord>[] = [
    {
      accessorKey: "interactedDate",
      header: ({ column }) => <SortableHeader column={column} title="Date" />,
      cell: ({ row }) => (
        <span className="text-xs">
          {format(new Date(row.original.interactedDate), "dd MMM yyyy")}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      enableSorting: false,
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <Badge
            variant={type === "stock_in" ? "default" : "secondary"}
            className="capitalize"
          >
            {type.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "size.product.name",
      id: "product_name",
      header: "Product",
      enableSorting: false,
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
      enableSorting: false,
    },
    {
      accessorKey: "buyingPrice",
      header: "Buy Price",
      enableSorting: false,
      cell: ({ row }) => <span>৳{row.original.buyingPrice}</span>,
    },
    {
      accessorKey: "sellingPrice",
      header: "Sell Price",
      enableSorting: false,
      cell: ({ row }) => <span>৳{row.original.sellingPrice}</span>,
    },
    {
      accessorKey: "profit",
      header: "Profit",
      enableSorting: false,
      cell: ({ row }) => (
        <span className={row.original.profit >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
          ৳{row.original.profit.toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "interactedBy.name",
      id: "By",
      header: "By",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-xs">{row.original.interactedBy?.name || "N/A"}</span>
      ),
    },
    {
      id: "Actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ConfirmationBox
          trigger={
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          }
          onConfirm={() => handleDelete(row.original._id)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={records}
        searchKey="product_name"
        enableColumnToggle
        enablePagination
      />
    </div>
  );
}
