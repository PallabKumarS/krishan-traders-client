"use client";

import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";

import { TStock } from "@/types";
import { CartItem, loadCart, saveCart } from "./cart-utils";
import Cart from "./Cart";
import { TAccount } from "@/types/account.type";

export default function SellManagement({
  stocksPromise,
  accountPromise,
}: {
  stocksPromise: Promise<{ data: TStock[] }>;
  accountPromise: Promise<{ data: TAccount[] }>;
}) {
  const stocks = use(stocksPromise);

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // 🔹 Handle screen size changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1440px)");

    const handleResize = () => setIsLargeScreen(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // 🔹 Load cart from localStorage
  useEffect(() => {
    setCart(loadCart());
  }, []);

  // 🔹 Persist cart
  useEffect(() => {
    if (cart.length > 0) {
      saveCart(cart);
    }
  }, [cart]);

  const getCartQuantity = (id: string) =>
    cart.find((item) => item.stock._id === id)?.quantity || 0;

  const updateQuantity = (stock: TStock, quantity: number) => {
    if (quantity < 0) return;

    setCart((prev) => {
      const exists = prev.find((i) => i.stock._id === stock._id);

      if (!exists && quantity > 0) {
        return [...prev, { stock, quantity }];
      }

      if (exists) {
        if (quantity === 0)
          return prev.filter((i) => i.stock._id !== stock._id);

        return prev.map((i) =>
          i.stock._id === stock._id
            ? { ...i, quantity: Math.min(quantity, stock.quantity) }
            : i,
        );
      }

      return prev;
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center gap-3">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        <Button onClick={() => setOpen(true)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Cart ({cart.length})
        </Button>
      </div>

      <div className="flex justify-between h-screen">
        {/* Products */}
        <div className="flex-1 p-4 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 overflow-y-auto h-fit">
          {stocks?.data?.map((stock) => {
            const quantity = getCartQuantity(stock._id);

            return (
              <Card
                className="h-fit overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-border/60"
                key={stock._id}
              >
                {/* Top accent bar */}
                <div className="h-1 w-full bg-linear-to-r from-primary via-accent to-primary/60" />

                <CardContent className="p-4 space-y-3.5">
                  {/* Product name */}
                  <p className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors duration-200">
                    {stock.size.product.name}
                  </p>

                  {/* Price — most prominent */}
                  <p className="text-xl font-bold text-primary tracking-tight">
                    ৳ {stock.sellingPrice}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                          stock.quantity > 0 ? "bg-primary" : "bg-destructive"
                        }`}
                      />
                      {stock.quantity > 0
                        ? `${stock.quantity} in stock`
                        : "Out of stock"}
                    </span>
                    <span className="bg-muted px-2 py-0.5 rounded-full text-[10px] font-medium">
                      Exp: {new Date(stock.expiryDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border/50" />

                  {/* Cart controls */}
                  {quantity === 0 ? (
                    <Button
                      className="w-2/5 h-8 text-xs font-semibold transition-all duration-200"
                      size="sm"
                      onClick={() => updateQuantity(stock, 1)}
                      disabled={stock.quantity <= 0}
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-md border-border/60 hover:border-primary hover:text-primary transition-colors duration-150"
                        onClick={() => updateQuantity(stock, quantity - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>

                      <Input
                        type="number"
                        value={
                          editingId === stock._id ? editingValue : quantity
                        }
                        onFocus={() => {
                          setEditingId(stock._id);
                          setEditingValue(String(quantity));
                        }}
                        onChange={(e) => {
                          setEditingValue(e.target.value);
                        }}
                        onBlur={() => {
                          const num = Number(editingValue);

                          if (!editingValue || num <= 0) {
                            updateQuantity(stock, 0);
                          } else {
                            updateQuantity(stock, num);
                          }

                          setEditingId(null);
                        }}
                        min={0}
                        max={stock.quantity}
                        className="w-16 text-center"
                      />

                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-md border-border/60 hover:border-primary hover:text-primary transition-colors duration-150"
                        onClick={() => updateQuantity(stock, quantity + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cart */}
        <Cart
          accountPromise={accountPromise}
          open={!isLargeScreen && open}
          onOpenChange={(open) => !isLargeScreen && setOpen(open)}
          cart={cart}
          setCart={setCart}
        />
      </div>
    </div>
  );
}
