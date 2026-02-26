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

const formSchema = z.object({
  product: z.string().min(1, "Product is required"),
  label: z.string().optional(),
  unit: z.enum(["ml", "gm", "kg", "ltr"]),
  unitQuantity: z.coerce.number().min(1, "Quantity must be greater than 0"),
  stackCount: z.coerce.number().min(0, "Stack count cannot be negative"),
  buyingPrice: z.coerce.number().min(0).optional(),
  sellingPrice: z.coerce.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
    console.log("hit");
    setLoading(true);

    const toastId = toast.loading(edit ? "Updating size..." : "Adding size...");

    try {
      const payload = edit
        ? values
        : {
            product: values.product,
            unit: values.unit,
            unitQuantity: values.unitQuantity,
            stackCount: values.stackCount,
          };

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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
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
          )}
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
                <FormLabel>Unit Quantity</FormLabel>
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select unit..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="gm">gm</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="ltr">ltr</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? <ButtonLoader /> : edit ? "Update Size" : "Add Size"}
        </Button>
      </form>
    </Form>
  );
}
