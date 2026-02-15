"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import ButtonLoader from "@/components/shared/ButtonLoader";
import { TAccount } from "@/types/account.type";
import { createAccountAction, updateAccountAction } from "@/services/Account";

const formSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["mobile-bank", "bank", "cash"]),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  openingBalance: z.coerce.number().min(0),
  note: z.string().optional(),
});

export default function AccountForm({
  edit = false,
  accountData,
  onSuccess,
}: {
  edit?: boolean;
  accountData?: TAccount;
  onSuccess?: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: accountData?.name ?? "",
      type: accountData?.type ?? "cash",
      accountNumber: accountData?.accountNumber ?? "",
      bankName: accountData?.bankName ?? "",
      openingBalance: accountData?.openingBalance ?? 0,
      note: accountData?.note ?? "",
    },
  });

  const loading = form.formState.isSubmitting;
  const type = form.watch("type");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = toast.loading("Saving account...");

    const res = edit
      ? await updateAccountAction(accountData?._id as string, values)
      : await createAccountAction(values);

    if (res.success) {
      toast.success(res.message, { id: toastId });
      onSuccess?.();
    } else {
      toast.error(res.message, { id: toastId });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="mobile-bank">Mobile Bank</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {(type === "mobile-bank" || type === "bank") && (
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account / Mobile Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {type === "bank" && (
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="openingBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opening Balance</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={loading}>
          {loading ? (
            <ButtonLoader />
          ) : edit ? (
            "Update Account"
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
