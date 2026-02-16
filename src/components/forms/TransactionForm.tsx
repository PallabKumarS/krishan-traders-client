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
import { createTransaction } from "@/services/AccountTransactions";
import { accountTransactionReasons } from "@/types/account-transactions.type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const schema = z.object({
  accountId: z.string().min(1),
  type: z.enum(["credit", "debit"]),
  amount: z.coerce.number().min(1),
  reason: z.enum(accountTransactionReasons),
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

    const res = await createTransaction(values);

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
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-full max-w-full capitalize">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="credit">Credit (+)</SelectItem>
                      <SelectItem value="debit">Debit (-)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Reason</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-full max-w-full capitalize">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent className="capitalize">
                    <SelectGroup>
                      {accountTransactionReasons.map((reason) => (
                        <SelectItem
                          className="capitalize"
                          key={reason}
                          value={reason}
                        >
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
