"use client";

"use client";

import { useState, use } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Trash } from "lucide-react";

import { TStock } from "@/types";

interface CartItem {
  stock: TStock;
  quantity: number; // always items
}

export default function SellManagement({
  stocksPromise,
}: {
  stocksPromise: Promise<{ data: TStock[] }>;
}) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🔹 Filter available stocks
  const stocks = use(stocksPromise);

  // 🔹 Add to cart
  const addToCart = (stock: TStock) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.stock._id === stock._id);

      if (existing) {
        return prev.map((item) =>
          item.stock._id === stock._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { stock, quantity: 1 }];
    });
  };

  // 🔹 Remove from cart
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.stock._id !== id));
  };

  // 🔹 Calculate total
  const total = cart.reduce(
    (acc, item) => acc + item.quantity * item.stock.sellingPrice,
    0,
  );

  return (
    <div className="flex flex-col h-screen">
      {/* ================= Search Bar ================= */}
      <div className="p-4 border-b bg-background">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* ================= Layout ================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* ================= Product Grid ================= */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stocks?.data.map((stock) => (
              <Card key={stock._id} className="hover:shadow-md transition">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">
                      {stock.size.product.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {stock.size.label} • {stock.size.unitQuantity}
                      {stock.size.unit}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {stock.size.product.company.name}
                    </p>

                    <p className="text-lg font-bold text-primary">
                      ৳ {stock.sellingPrice}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Available: {stock.quantity}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="mt-3"
                    disabled={stock.quantity <= 0}
                    onClick={() => addToCart(stock)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ================= Cart Sidebar ================= */}
        <div className="w-full md:w-87.5 border-l bg-muted/20 flex flex-col">
          {/* Header */}
          <div className="p-4 flex items-center gap-2 border-b">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="font-semibold">Cart</h2>
          </div>

          {/* Cart Items */}
          <ScrollArea className="flex-1 p-4">
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.stock._id}
                  className="flex justify-between items-center mb-4"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.stock.size.product.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × ৳ {item.stock.sellingPrice}
                    </p>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFromCart(item.stock._id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </ScrollArea>

          <Separator />

          {/* Footer */}
          <div className="p-4 space-y-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>৳ {total.toFixed(2)}</span>
            </div>

            <Button className="w-full">Complete Sale</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
