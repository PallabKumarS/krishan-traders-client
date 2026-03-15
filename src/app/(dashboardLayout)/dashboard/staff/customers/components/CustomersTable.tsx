"use client";

import { use, useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TCustomer } from "@/server/modules/customer/customer.interface";
import { getCustomersPromise } from "../utils";
import { Phone, MapPin, Mail } from "lucide-react";

interface CustomersTableProps {
  initialCustomersPromise: Promise<TCustomer[]>;
}

const CustomersTable = ({ initialCustomersPromise }: CustomersTableProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [customersPromise, setCustomersPromise] = useState(initialCustomersPromise);

  useEffect(() => {
    if (refreshKey > 0) {
      setCustomersPromise(getCustomersPromise(refreshKey));
    }
  }, [refreshKey]);

  const customers = use(customersPromise);

  const columns: ColumnDef<TCustomer>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name") || "N/A"}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span>{row.getValue("phoneNumber")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.getValue("email") ? (
            <>
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span>{row.getValue("email")}</span>
            </>
          ) : (
            <span className="text-muted-foreground italic text-xs">No email</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.getValue("address") ? (
            <>
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="max-w-[300px] truncate">{row.getValue("address")}</span>
            </>
          ) : (
            <span className="text-muted-foreground italic text-xs">No address</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Member Since",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-xl border bg-card">
      <DataTable
        columns={columns}
        data={customers}
        searchKey="phoneNumber"
      />
    </div>
  );
};

export default CustomersTable;
