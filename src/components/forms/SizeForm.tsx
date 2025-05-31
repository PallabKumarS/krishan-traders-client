"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
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
import { TSize } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { createSize, updateSize } from "@/services/SizeService";

const formSchema = z.object({
  productName: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters"),
  sizes: z
    .array(
      z.object({
        size: z
          .string()
          .min(1, "Size is required")
          .min(1, "Size must be at least 1 character"),
      })
    )
    .min(1, "At least one size is required"),
});

export default function SizeForm({
  edit = false,
  sizeData,
  onSuccess,
}: {
  edit?: boolean;
  sizeData?: TSize;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: sizeData?.productName || "",
      sizes: sizeData?.size?.map((size) => ({ size })) || [{ size: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sizes",
  });

  const addSize = () => {
    append({ size: "" });
  };

  const removeSize = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const toastId = toast.loading(
      edit ? "Updating product sizes..." : "Adding product sizes..."
    );

    try {
      // Transform sizes array to match backend expectation
      const payload = {
        productName: values.productName,
        size: values.sizes.map((sizeItem) => sizeItem.size),
      };

      const res = !edit
        ? await createSize(payload)
        : await updateSize(sizeData?._id as string, payload);

      if (res.success) {
        toast.success(res.message, { id: toastId });
        form.reset();
        onSuccess?.();
      } else {
        toast.error(res.message, { id: toastId });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message, {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter product name..."
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Sizes</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSize}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Size
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`sizes.${index}.size`}
                render={({ field: sizeField }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl className="flex-1">
                        <Input
                          placeholder={`Enter size ${
                            index + 1
                          } (e.g., 50kg, 1L, 500ml)...`}
                          type="text"
                          {...sizeField}
                        />
                      </FormControl>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSize(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <ButtonLoader />
          ) : edit ? (
            "Update Product Sizes"
          ) : (
            "Add Product Sizes"
          )}
        </Button>
      </form>
    </Form>
  );
}
