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

import { TCompany } from "@/types";
import { createProduct, updateProduct } from "@/services/ProductService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useWheelSelectRHF } from "@/hooks/use-scroll-select";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters"),
  company: z.string().min(1, "Company is required"),
  isDisabled: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  edit?: boolean;
  productData?: {
    _id: string;
    name: string;
    company: TCompany;
    isDisabled: boolean;
  };
  companies: TCompany[];
  onSuccess?: () => void;
  selectedCompany?: TCompany;
}

export default function ProductForm({
  edit = false,
  productData,
  companies,
  onSuccess,
  selectedCompany,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: productData?.name || "",
      company: productData?.company?._id || selectedCompany?._id || "",
      isDisabled: productData?.isDisabled ?? false,
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);

    const toastId = toast.loading(
      edit ? "Updating product..." : "Adding product...",
    );

    try {
      const payload = edit
        ? values
        : {
            name: values.name,
            company: values.company,
          };

      const res = edit
        ? await updateProduct(productData!._id, payload)
        : await createProduct(payload);

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
        {/* Product name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company select */}
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => {
            // biome-ignore lint/correctness/useHookAtTopLevel: <>
            const wheelProps = useWheelSelectRHF({
              options: companies.map((c) => c._id),
              value: field.value,
              onChange: field.onChange,
            });

            return (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full" {...wheelProps}>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Status toggle (edit only) */}
        {edit && (
          <FormField
            control={form.control}
            name="isDisabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <ToggleButton
                    size="md"
                    checked={!field.value}
                    onCheckedChange={(enabled) => field.onChange(!enabled)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <ButtonLoader /> : edit ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
