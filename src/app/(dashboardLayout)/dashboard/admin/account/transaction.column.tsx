"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TAccountTransaction } from "@/types/account-transactions.type";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { deleteTransaction } from "@/services/AccountTransactions";
import { useUser } from "@/providers/ContextProvider";

const handleDelete = async (id: string) => {
  const toastId = toast.loading("Deleting transaction...");

  const res = await deleteTransaction(id);

  if (res.success) {
    toast.success(res.message, { id: toastId });
  } else {
    toast.error(res.message, { id: toastId });
  }
};

export const transactionColumns: ColumnDef<TAccountTransaction>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "accountId",
    header: "Account",
    cell: ({ row }) => row.original.accountId?.name || "-",
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.reason}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;

      return (
        <span
          className={
            type === "credit"
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {type === "credit" ? "Credit" : "Debit"}
        </span>
      );
    },
  },
  {
    id: "credit",
    header: "Credit",
    cell: ({ row }) =>
      row.original.type === "credit"
        ? `৳ ${row.original.amount.toFixed(2)}`
        : "-",
  },
  {
    id: "debit",
    header: "Debit",
    cell: ({ row }) =>
      row.original.type === "debit"
        ? `৳ ${row.original.amount.toFixed(2)}`
        : "-",
  },

  // ✅ ACTIONS COLUMN
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const transaction = row.original;
      const { user } = useUser();

      return (
        user?.role === "admin" && (
          <div className="flex items-center justify-center gap-2">
            <ConfirmationBox
              trigger={
                <Button size="sm" variant="ghost">
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              }
              onConfirm={() => handleDelete(transaction._id)}
              title="Delete this transaction?"
            />
          </div>
        )
      );
    },
  },
];
