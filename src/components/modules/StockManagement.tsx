"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, LucideArrowDownSquare, Trash2 } from "lucide-react";
import { TMeta, TStock } from "@/types";
import { ManagementTable } from "@/components/shared/ManagementTable";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { toast } from "sonner";
import {
  acceptStock,
  deleteStock,
  getAllStocks,
} from "@/services/StockService";
import { useEffect, useState } from "react";
import LoadingData from "@/components/shared/LoadingData";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const StockManagement = ({ query }: { query: Record<string, unknown> }) => {
  const [stocks, setStocks] = useState<TStock[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await getAllStocks({
          ...query,
        });

        if (res.success) {
          setStocks(res.data);
          setMeta(res.meta);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchStocks();
  }, [query]);

  // Stock manage actions
  const handleStockStatusChange = async (
    id: string,
    status: TStock["status"]
  ) => {
    const toastId = toast.loading(
      `${status === "accepted" ? "Accepting" : "Rejecting"} stock request...`
    );

    try {
      const res = await acceptStock(id);

      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
      } else {
        toast.error(res.message as string, {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(
        `Error ${
          status === "accepted" ? "accepting" : "rejecting"
        } stock request`,
        {
          id: toastId,
        }
      );
      console.log(error);
    }
  };

  const handleStockDelete = async (id: string) => {
    const toastId = toast.loading("Deleting stock...");

    try {
      const res = await deleteStock(id);
      if (res.success) {
        // Remove the deleted stock from the local state
        setStocks(stocks.filter((stock) => stock._id !== id));

        toast.success(res.message, {
          id: toastId,
        });
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error("Error deleting stock", {
        id: toastId,
      });
      console.log(error);
    }
  };

  const handleStockEdit = (id: string) => {
    toast.info(`Editing stock with ID: ${id}`);
  };

  // column definition
  const columns: ColumnDef<TStock>[] = [
    {
      accessorKey: "productName",
      header: "Product Name",
    },
    {
      accessorKey: "brandName",
      header: "Brand Name",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const quantity = row.original.quantity;
        const size = row.original.size;

        return (
          <div className="flex items-center gap-2">
            <span>{quantity}</span>
            <Badge variant="outline">{size}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) => {
        const expiryDate = row.getValue("expiryDate") as string;

        return format(new Date(expiryDate), "PPP");
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="capitalize">
                {status} <LucideArrowDownSquare className="ml-2 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              {["pending", "accepted", "rejected"].map((s) => (
                <DropdownMenuItem
                  disabled={status === s}
                  className="capitalize"
                  key={s}
                  onSelect={() =>
                    handleStockStatusChange(
                      row.original._id,
                      s as TStock["status"]
                    )
                  }
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const stock = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStockEdit(stock._id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <ConfirmationBox
              trigger={
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
              onConfirm={() => handleStockDelete(stock._id)}
            />
          </div>
        );
      },
    },
  ];

  if (isFetching) return <LoadingData />;

  return (
    <div className="space-y-7">
      <ManagementTable data={stocks} columns={columns} />

      <PaginationComponent meta={meta} />
    </div>
  );
};

export default StockManagement;
