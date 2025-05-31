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
import { TCompany } from "@/types";
import { createCompany, updateCompany } from "@/services/CompanyService";
import { Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters"),
  products: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "Product name is required")
          .min(2, "Product name must be at least 2 characters"),
      })
    )
    .min(1, "At least one product is required"),
});

export default function CompanyForm({
  edit = false,
  companyData,
  onSuccess,
}: {
  edit?: boolean;
  companyData?: TCompany;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: companyData?.name || "",
      products: companyData?.products?.map((product) => ({
        name: product,
      })) || [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const addProduct = () => {
    append({ name: "" });
  };

  const removeProduct = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const toastId = toast.loading(
      edit ? "Updating company..." : "Adding company..."
    );

    try {
      // Transform products array to match backend expectation
      const payload = {
        name: values.name,
        products: values.products.map((product) => product.name),
      };

      const res = !edit
        ? await createCompany(payload)
        : await updateCompany(companyData?._id as string, payload);

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter company name..."
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
            <FormLabel>Products</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addProduct}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`products.${index}.name`}
                render={({ field: productField }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl className="flex-1">
                        <Input
                          placeholder={`Enter product ${index + 1} name...`}
                          type="text"
                          {...productField}
                        />
                      </FormControl>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeProduct(index)}
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
          {loading ? <ButtonLoader /> : edit ? "Update Company" : "Add Company"}
        </Button>
      </form>
    </Form>
  );
}
