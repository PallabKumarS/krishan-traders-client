import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TStock } from "@/types";
import { format } from "date-fns";
import { Edit, Trash2, ShoppingCart } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import StockAddForm from "@/components/forms/StockAddForm";
import SellStockForm from "@/components/forms/SellStockForm";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { deleteStock } from "@/services/StockService";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function StockDataTableForDesktop({ data }: { data: TStock[] }) {
  return (
    <Table className="relative">
      {/* Sticky Header */}
      <TableHeader className="sticky top-0 z-20 bg-muted/70 backdrop-blur border-b">
        <TableRow>
          <TableHead className="border-r">Product</TableHead>
          <TableHead className="border-r">Size</TableHead>
          <TableHead className="border-r text-right">Qty</TableHead>
          <TableHead className="border-r">Expiry</TableHead>
          <TableHead className="border-r">Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((stock) => (
          <TableRow
            key={stock._id}
            className="hover:bg-accent/20 transition-colors"
          >
            <TableCell className="border-r font-medium">
              {stock.productName}
            </TableCell>

            <TableCell className="border-r">{stock.size}</TableCell>

            <TableCell className="border-r text-right">
              {stock.quantity}
            </TableCell>

            <TableCell className="border-r">
              {format(new Date(stock.expiryDate), "PPP")}
            </TableCell>

            <TableCell className="border-r">
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  stock.status === "accepted" && "text-green-600",
                  stock.status === "expired" && "text-red-600",
                  stock.status === "sold" && "text-blue-600",
                  stock.status === "rejected" && "text-orange-600"
                )}
              >
                {stock.status}
              </Badge>
            </TableCell>

            <TableCell className="text-right space-x-2">
              <Modal
                title="Sell Stock"
                trigger={
                  <Button
                    size="sm"
                    disabled={
                      stock.status !== "accepted" || stock.quantity === 0
                    }
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                }
                content={
                  <SellStockForm
                    stockId={stock._id}
                    maxQuantity={stock.quantity}
                  />
                }
              />

              <Modal
                title="Edit Stock"
                trigger={
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={stock.status !== "accepted"}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                }
                content={<StockAddForm edit stockData={stock} />}
              />

              <ConfirmationBox
                trigger={
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
                onConfirm={() => deleteStock(stock._id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
