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

import { TCompany, TMongoose } from "@/types";
import { createCompany, updateCompany } from "@/services/CompanyService";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CompanyForm({
  edit = false,
  companyData,
  onSuccess,
}: {
  edit?: boolean;
  companyData?: TCompany & TMongoose;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: companyData?.name || "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);

    const toastId = toast.loading(
      edit ? "Updating company..." : "Adding company..."
    );

    try {
      const res = edit
        ? await updateCompany(companyData?._id as string, values)
        : await createCompany(values);

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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <ButtonLoader /> : edit ? "Update Company" : "Add Company"}
        </Button>
      </form>
    </Form>
  );
}
