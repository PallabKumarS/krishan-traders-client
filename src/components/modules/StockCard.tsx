"use client";

import { TStock } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, Package, ShoppingCart, Tag } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAppContext } from "@/providers/ContextProvider";

interface StockCardProps {
  stock: TStock;
}

const StockCard = ({ stock }: StockCardProps) => {
  const { user } = useAppContext();

  // Calculate days until expiry
  const today = new Date();
  const expiryDate = new Date(stock.expiryDate);
  const daysUntilExpiry = differenceInDays(expiryDate, today);

  // Determine expiry status color
  const getExpiryStatusColor = () => {
    if (daysUntilExpiry <= 3) return "text-red-500 font-semibold";
    if (daysUntilExpiry <= 7) return "text-yellow-500 font-semibold";
    return "text-green-500 font-semibold";
  };

  const handleSellStock = (stockId: string) => {
    toast.info(`Selling stock with ID: ${stockId}`);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{stock.productName}</CardTitle>
            <CardDescription>{stock.brandName}</CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            {stock.size}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Package className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              Quantity: <strong>{stock.quantity}</strong>
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className={cn("mr-2 h-4 w-4", getExpiryStatusColor())} />
            <span>
              Expiry:{" "}
              <strong className={getExpiryStatusColor()}>
                {format(expiryDate, "PPP")}
                {daysUntilExpiry <= 7 && (
                  <span className="ml-1">
                    ({daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""}{" "}
                    left)
                  </span>
                )}
              </strong>
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              Added: <strong>{format(new Date(stock.stockDate), "PPP")}</strong>
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="default"
          size="sm"
          className="flex items-center mt-auto"
          onClick={() => handleSellStock(stock._id)}
        >
          <ShoppingCart className="mr-1 h-4 w-4" />
          Sell
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StockCard;
