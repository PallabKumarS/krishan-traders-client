import { TRecord } from "@/types";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
  Package,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  acceptAddStock,
  acceptSellStock,
  deleteRecord,
} from "@/services/RecordService";
import { toast } from "sonner";
import { useState } from "react";
import ButtonLoader from "../shared/ButtonLoader";
import ConfirmationBox from "../shared/ConfirmationBox";

interface RecordCardProps {
  record: TRecord;
  onStatusUpdate?: () => void;
}

const RecordCard = ({ record, onStatusUpdate }: RecordCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Determine if it's a stock addition or sale
  const isStockAddition = record?.stockedBy && !record.soldBy;

  // Get the relevant user
  const user = isStockAddition ? record?.stockedBy : record.soldBy;

  // Get status color
  const getStatusColor = () => {
    switch (record.status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "sold":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "expired":
        return "bg-purple-100 text-purple-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleStatusUpdate = async (status: TRecord["status"]) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      let response = isStockAddition
        ? await acceptAddStock(record._id, { status })
        : await acceptSellStock(record._id, { status });

      if (response.success) {
        toast.success(`Status updated to ${status}`);
        if (onStatusUpdate) onStatusUpdate();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStockDelete = async (id: string) => {
    const toastId = toast.loading("Deleting stock...");

    try {
      const res = await deleteRecord(id);
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
      toast.error("Error deleting stock", {
        id: toastId,
      });
      console.log(error);
    }
  };

  // Only show status dropdown for pending records
  const showStatusDropdown = record?.status === "pending";

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {record?.stockId?.productName}
            </span>
            <div className="">
              <p className="text-xs text-muted-foreground">
                {record?.stockId?.brandName}
              </p>
              <Badge variant="secondary" className="text-xs">
                ID: {record?._id.slice(-6)}
              </Badge>
            </div>
          </div>
          <Badge className={`capitalize text-xs ${getStatusColor()}`}>
            {record?.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* User info */}
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <span>{user?.name || "Unknown"}</span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-1">
            <Package className="h-3 w-3 text-muted-foreground" />
            <span>
              Qty: <strong>{record?.quantity}</strong>
            </span>
          </div>

          {/* Transaction type */}
          <div className="flex items-center gap-1">
            {isStockAddition ? (
              <ArrowUp className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDown className="h-3 w-3 text-blue-500" />
            )}
            <span className="capitalize">
              {isStockAddition ? "Added" : "Sold"}
            </span>
          </div>

          {/* Created date */}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{format(new Date(record?.createdAt), "PP")}</span>
          </div>

          {/* Stocked date if available */}
          {record.stockedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-green-500" />
              <span>
                Stocked: {format(new Date(record?.stockedDate), "PP")}
              </span>
            </div>
          )}

          {/* Sold date if available */}
          {record.soldDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-blue-500" />
              <span>Sold: {format(new Date(record?.soldDate), "PP")}</span>
            </div>
          )}

          {/* Expiry date if available */}
          {record?.stockId?.expiryDate && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3 text-red-500" />
              <span>
                Expires: {format(new Date(record?.stockId?.expiryDate), "PP")}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-2 pt-0 space-x-4 justify-end">
        {showStatusDropdown && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={isUpdating}
              >
                {isUpdating ? <ButtonLoader /> : "Accept/Reject"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem onClick={() => handleStatusUpdate("accepted")}>
                Accept
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusUpdate("rejected")}>
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="">
          <ConfirmationBox
            trigger={
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            onConfirm={() => handleStockDelete(record._id)}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecordCard;
