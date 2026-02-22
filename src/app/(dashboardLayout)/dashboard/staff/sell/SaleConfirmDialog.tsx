/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import { Button } from "@/components/ui/button";
import { CartItem } from "./cart-utils";
import { CustomerFormValues } from "@/components/forms/CustomerForm";
import { Modal } from "@/components/shared/Modal";
import { toast } from "sonner";
import { TSell } from "@/types/sell.type";
import { directlySellStock } from "@/services/SellService";
import { createSellStockRequest } from "@/services/RequestService";
import { useUser } from "@/providers/ContextProvider";
import { useState } from "react";
import AccountSelect from "./AccountSelect";
import { TAccount } from "@/types/account.type";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  customer: CustomerFormValues;
  onConfirm: () => void;
  accountPromise: Promise<{ data: TAccount[] }>;
}

export function SaleConfirmModal({
  open,
  onOpenChange,
  cart,
  customer,
  onConfirm,
  accountPromise,
}: Props) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const { user } = useUser();

  const handleConfirmSale = async () => {
    const toastId = toast.loading("Processing sale...");

    const payload: TSell = {
      accountId: accountId || "",
      stocks: cart.map((item) => ({
        stock: item.stock._id,
        quantity: item.quantity,
      })),
      soldTo:
        customer.customerType === "walk-in"
          ? "walk-in"
          : {
              phoneNumber: customer.phoneNumber!,
              name: customer.name || "",
              email: customer.email || "",
              address: customer.address || "",
            },
    };

    try {
      const res =
        user?.role === "admin"
          ? await directlySellStock(payload)
          : await createSellStockRequest(payload);

      if (res.success) {
        toast.success("Sale completed successfully", { id: toastId });
        onConfirm();
      } else {
        toast.error(res.message || "Failed to complete sale", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message, {
        id: toastId,
      });
    }
  };

  const total = cart.reduce(
    (acc, item) => acc + item.quantity * item.stock.sellingPrice,
    0,
  );

  return (
    <Modal
      title="Confirm Sale"
      open={open}
      onOpenChange={onOpenChange}
      trigger={null}
      content={
        <div className="space-y-4">
          {/* Cart */}
          <div className="space-y-1">
            {cart.map((item) => (
              <div
                key={item.stock._id}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.stock.size.product.name} × {item.quantity}
                </span>
                <span>
                  ৳{(item.quantity * item.stock.sellingPrice).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>৳{total.toFixed(2)}</span>
          </div>

          {/* Customer Info */}
          <div className="text-sm space-y-1">
            <p className="font-semibold">Customer Info</p>
            {customer.customerType === "walk-in" ? (
              <p>Walk-in Customer</p>
            ) : (
              <>
                <p>Phone: {customer.phoneNumber}</p>
                <p>Name: {customer.name || "-"}</p>
                <p>Email: {customer.email || "-"}</p>
                <p>Address: {customer.address || "-"}</p>
              </>
            )}
          </div>

          {/* Account select */}
          <div>
            <AccountSelect
              accountsPromise={accountPromise}
              onChange={setAccountId}
              value={accountId || ""}
            />
          </div>

          <Button className="w-full" onClick={handleConfirmSale}>
            Confirm & Complete Sale
          </Button>
        </div>
      }
    />
  );
}
