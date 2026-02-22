"use client";

import { Button } from "@/components/ui/button";
import { CartItem } from "./cart-utils";
import { CustomerFormValues } from "@/components/forms/CustomerForm";
import { Modal } from "@/components/shared/Modal";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  customer: CustomerFormValues;
  onConfirm: () => void;
}

export function SaleConfirmModal({
  open,
  onOpenChange,
  cart,
  customer,
  onConfirm,
}: Props) {
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

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>৳{total.toFixed(2)}</span>
          </div>

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

          <Button className="w-full" onClick={onConfirm}>
            Confirm & Complete Sale
          </Button>
        </div>
      }
    />
  );
}
