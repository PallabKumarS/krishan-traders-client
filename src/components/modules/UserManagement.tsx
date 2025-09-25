/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LucideArrowDownSquare, Trash2 } from "lucide-react";
import { TMeta, TUser } from "@/types";
import { ManagementTable } from "@/components/shared/ManagementTable";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { toast } from "sonner";
import {
  deleteUser,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
} from "@/services/UserService";
import { useEffect, useState } from "react";
import LoadingData from "@/components/shared/LoadingData";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import UserRowActions from "./UserRowActions";
import EditableCell from "./EditableCell";

const UserManagement = ({ query }: { query: Record<string, unknown> }) => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers(query);

      setUsers(res?.data);
      setMeta(res?.meta);
    };

    fetchUsers();
    setIsFetching(false);
  }, [query]);

  if (isFetching) return <LoadingData />;

  // user manage actions
  const handleUserStatusChange = async (
    id: string,
    status: TUser["status"]
  ) => {
    const toastId = toast.loading("Changing user status...");

    try {
      const res = await updateUserStatus(id, status);

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
      toast.error(error.message, {
        id: toastId,
      });
    }
  };

  const handleUserRoleChange = async (id: string, role: TUser["role"]) => {
    const toastId = toast.loading("Changing user role...");
    try {
      const res = await updateUserRole(id, role);

      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(error.message, {
        id: toastId,
      });
    }
  };

  const handleUserDelete = async (id: string) => {
    const toastId = toast.loading("Deleting user...");

    try {
      const res = await deleteUser(id);
      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(error.message, {
        id: toastId,
      });
    }
  };

  // column definition
  const columns: ColumnDef<TUser>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <EditableCell
          id={row.original._id}
          field="name"
          initialValue={row.original.name}
        />
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <EditableCell
          id={row.original._id}
          field="email"
          initialValue={row.original.email}
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as TUser["status"];

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="capitalize">
                {status} <LucideArrowDownSquare className="ml-2 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/80">
              {["active", "blocked"].map((s) => (
                <DropdownMenuItem
                  className="capitalize"
                  key={s}
                  onSelect={() =>
                    handleUserStatusChange(
                      row.original._id,
                      s as TUser["status"]
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
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as TUser["role"];

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="">
              <Button variant="outline" size="sm" className="capitalize">
                {role} <LucideArrowDownSquare className="ml-2 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/80">
              {["admin", "staff", "guest", "subAdmin"].map((r) => (
                <DropdownMenuItem
                  className="capitalize"
                  key={r}
                  onSelect={() =>
                    handleUserRoleChange(row.original._id, r as TUser["role"])
                  }
                >
                  {r}
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
        const user = row.original;

        return (
          <ConfirmationBox
            trigger={
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            onConfirm={() => handleUserDelete(user._id)}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-7">
      <ManagementTable data={users} columns={columns} />

      <PaginationComponent meta={meta} />
    </div>
  );
};

export default UserManagement;
