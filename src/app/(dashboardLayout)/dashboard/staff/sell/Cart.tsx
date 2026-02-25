/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash, Plus, Minus } from "lucide-react";
import { CartItem } from "./cart-utils";
import { useState } from "react";
import { SaleConfirmModal } from "./SaleConfirmDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  accountPromise: Promise<{ data: any[] }>;
}

function Cart({ open, onOpenChange, cart, setCart, accountPromise }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const updateQuantity = (id: string, quantity: number, max: number) => {
    if (quantity < 0) return;

    setCart((prev) =>
      prev
        .map((item) =>
          item.stock._id === id
            ? { ...item, quantity: Math.min(quantity, max) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.stock._id !== id));
  };

  const total = cart.reduce(
    (acc, item) => acc + item.quantity * item.stock.sellingPrice,
    0,
  );

  const CartContent = (
    <div className="flex flex-col flex-1 h-full">
      {/* Cart Header */}
      <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-base">Cart</h2>
          {cart.length > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {cart.length}
            </span>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {cart.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-10">
              No items in cart
            </p>
          )}

          {cart.map((item) => {
            const lineTotal = item.stock.sellingPrice * item.quantity;

            return (
              <div
                key={item.stock._id}
                className="group rounded-lg border border-border/50 bg-card hover:border-primary/30 hover:bg-muted/20 transition-all duration-150 p-3 space-y-2.5"
              >
                {/* Name + Remove */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-snug text-foreground flex-1">
                    {item.stock.size.product.name}
                  </p>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-destructive/10 hover:text-destructive shrink-0"
                    onClick={() => removeItem(item.stock._id)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Controls + Price */}
                <div className="flex items-center justify-between">
                  {/* Qty controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 rounded border-border/60 hover:border-primary hover:text-primary transition-colors"
                      onClick={() =>
                        updateQuantity(
                          item.stock._id,
                          item.quantity - 1,
                          item.stock.quantity,
                        )
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <Input
                      type="number"
                      value={
                        editingId === item.stock._id
                          ? editingValue
                          : item.quantity
                      }
                      onFocus={() => {
                        setEditingId(item.stock._id);
                        setEditingValue(String(item.quantity));
                      }}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => {
                        const num = Number(editingValue);
                        if (!editingValue || num <= 0) {
                          updateQuantity(
                            item.stock._id,
                            0,
                            item.stock.quantity,
                          );
                        } else {
                          updateQuantity(
                            item.stock._id,
                            num,
                            item.stock.quantity,
                          );
                        }
                        setEditingId(null);
                      }}
                      min={0}
                      max={item.stock.quantity}
                      className="w-16 h-8 text-center text-sm font-semibold border-border/50 focus-visible:ring-primary/30 rounded"
                    />

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 rounded border-border/60 hover:border-primary hover:text-primary transition-colors"
                      onClick={() =>
                        updateQuantity(
                          item.stock._id,
                          item.quantity + 1,
                          item.stock.quantity,
                        )
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Per-unit + line total */}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground leading-none mb-0.5">
                      ৳{item.stock.sellingPrice} × {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-primary leading-none">
                      ৳{lineTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Cart Footer */}
      <div className="p-4 border-t bg-muted/20 space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground font-medium">
            Total
          </span>
          <span className="text-xl font-bold text-primary">
            ৳{total.toFixed(2)}
          </span>
        </div>

        <Button
          className="w-full h-9 font-semibold text-sm"
          onClick={() => {
            setConfirmOpen(true);
          }}
        >
          Sale
        </Button>
      </div>

      <SaleConfirmModal
        accountPromise={accountPromise}
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        cart={cart}
        onConfirm={() => {
          setCart([]);
          localStorage.removeItem("sell-cart");
          setConfirmOpen(false);
        }}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden xl:flex xl:w-1/4 border-l bg-muted/20 h-full">
        {CartContent}
      </div>

      {/* Mobile Sheet */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTitle className="sr-only">Cart</SheetTitle>
        <SheetDescription className="sr-only">
          View and manage your cart.
        </SheetDescription>
        <SheetContent side="right" className="w-[85%] sm:w-100%">
          {CartContent}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Cart;
