/** biome-ignore-all lint/correctness/useHookAtTopLevel: <> */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoader from "../shared/ButtonLoader";
import ToggleButton from "../shared/ToggleButton";

import { TProduct, TSize } from "@/types";
import { createSize, updateSize } from "@/services/SizeService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useWheelSelectRHF } from "@/hooks/use-scroll-select";

const formSchema = z.object({
  product: z.string().min(1, "Product is required"),
  label: z.string().optional(),
  unit: z.enum(["ml", "gm", "kg", "ltr"]),
  unitQuantity: z.coerce.number().min(1, "Quantity must be greater than 0"),
  stackCount: z.coerce.number().min(1, "Stack must be greater than 0"),
  buyingPrice: z.coerce.number().min(1),
  sellingPrice: z.coerce.number().min(1),
  isActive: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const units = ["ml", "gm", "kg", "ltr"];

interface SizeFormProps {
  edit?: boolean;
  sizeData?: TSize;
  products: TProduct[];
  onSuccess?: () => void;
  selectedProduct?: TProduct;
}

export default function SizeForm({
  edit = false,
  sizeData,
  products,
  onSuccess,
  selectedProduct,
}: SizeFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: sizeData?.product?._id || selectedProduct?._id || "",
      label: sizeData?.label || "",
      unit: sizeData?.unit || "gm",
      unitQuantity: sizeData?.unitQuantity || 1,
      stackCount: sizeData?.stackCount || 0,
      buyingPrice: sizeData?.buyingPrice || 0,
      sellingPrice: sizeData?.sellingPrice || 0,
      isActive: sizeData?.isActive ?? true,
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);

    const toastId = toast.loading(edit ? "Updating size..." : "Adding size...");

    try {
      const payload = values;

      const res = edit
        ? await updateSize(sizeData!._id, payload)
        : await createSize(payload);

      if (res.success) {
        toast.success(res.message, { id: toastId });
        form.reset();
        onSuccess?.();
      } else {
        toast.error(res.message, { id: toastId });
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        {/* Product */}
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => {
            const productIds = products.map((p) => p._id);

            const wheelProps = useWheelSelectRHF({
              options: productIds,
              value: field.value,
              onChange: field.onChange,
              loop: true,
            });
            return (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full" {...wheelProps}>
                      <SelectValue placeholder="Select a product..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Label */}
        {edit ? (
          <FormField
            disabled={!edit}
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size Label</FormLabel>
                <FormControl>
                  <Input placeholder="Enter size label..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {/* Unit + Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unitQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pack Size</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => {
              const wheelProps = useWheelSelectRHF({
                options: units,
                value: field.value,
                onChange: field.onChange,
              });

              return (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full" {...wheelProps}>
                        <SelectValue placeholder="Select unit..." />
                      </SelectTrigger>

                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Stack Count */}
        <FormField
          control={form.control}
          name="stackCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stack Count</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buying Price */}
        <FormField
          control={form.control}
          name="buyingPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buying Price</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Selling Price */}
        <FormField
          control={form.control}
          name="sellingPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selling Price</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active toggle (edit only) */}
        {edit && (
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <ToggleButton
                    size="md"
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <ButtonLoader /> : edit ? "Update Size" : "Add Size"}
        </Button>
      </form>
    </Form>
  );
}
