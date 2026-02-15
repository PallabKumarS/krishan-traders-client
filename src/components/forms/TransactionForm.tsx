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
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ButtonLoader from "@/components/shared/ButtonLoader";
import { createTransactionAction } from "@/services/AccountTransactions";

const schema = z.object({
  accountId: z.string().min(1),
  type: z.enum(["credit", "debit"]),
  amount: z.coerce.number().min(1),
  reason: z.enum(["sale", "purchase", "expense", "adjustment", "transfer"]),
  note: z.string().optional(),
});

export default function TransactionForm({
  accountId,
  onSuccess,
}: {
  accountId: string;
  onSuccess?: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      accountId,
      type: "credit",
      amount: 0,
      reason: "adjustment",
      note: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const toastId = toast.loading("Processing transaction...");

    const res = await createTransactionAction(values);

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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <FormControl>
                <select className="w-full border rounded-md p-2" {...field}>
                  <option value="credit">Credit (+)</option>
                  <option value="debit">Debit (-)</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={loading}>
          {loading ? <ButtonLoader /> : "Add Transaction"}
        </Button>
      </form>
    </Form>
  );
}
