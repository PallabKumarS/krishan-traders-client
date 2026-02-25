/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import { Button } from "@/components/ui/button";
import { CartItem } from "./cart-utils";
import {
  CustomerForm,
  CustomerFormValues,
} from "@/components/forms/CustomerForm";
import { Modal } from "@/components/shared/Modal";
import { toast } from "sonner";
import { TSellBody } from "@/types/sell.type";
import { directlySellStock } from "@/services/SellService";
import { createSellStockRequest } from "@/services/RequestService";
import { useUser } from "@/providers/ContextProvider";
import { useRef } from "react";
import AccountSelect from "./AccountSelect";
import { TAccount } from "@/types/account.type";
import { Separator } from "@/components/ui/separator";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onConfirm: () => void;
  accountPromise: Promise<{ data: TAccount[] }>;
}

export function SaleConfirmModal({
  open,
  onOpenChange,
  cart,
  onConfirm,
  accountPromise,
}: Props) {
  const { user } = useUser();
  const formRef = useRef<any>(null);
  const accountFormRef = useRef<any>(null);

  const handleConfirmSale = async () => {
    const toastId = toast.loading("Processing sale...");

    const values: CustomerFormValues = formRef?.current?.getValues();

    if (values.customerType === "customer" && !values.phoneNumber) {
      toast.error("Please enter customer's phone number");
      return;
    }

    const payload: TSellBody = {
      accountId: accountFormRef?.current?.getValues().accountId || "",
      stocks: cart.map((item) => ({
        stock: item.stock._id,
        quantity: item.quantity,
      })),
      soldTo:
        values.customerType === "walk-in"
          ? "walk-in"
          : {
              phoneNumber: values.phoneNumber!,
              name: values.name || "",
              email: values.email || "",
              address: values.address || "",
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
        window.open(
          `/dashboard/staff/invoice/${user?.role === "admin" ? "sell" : "request"}/${res.data._id}`,
          "_blank",
        );
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

          <Separator />

          {/* Customer Info */}
          <div className="text-sm space-y-1">
            <p className="font-semibold">Customer Info</p>

            <CustomerForm formRef={formRef} />
          </div>

          {/* Account select */}
          <div>
            <AccountSelect
              accountsPromise={accountPromise}
              formRef={accountFormRef}
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
