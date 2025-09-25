/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Dispatch, SetStateAction } from "react";
import { forgotPassword } from "@/services/AuthService";
import { saveToLocalStorage } from "@/lib/localStorage";

const formSchema = z.object({
  email: z.string(),
});

export default function ForgotPassword({
  setActiveTab,
}: {
  setActiveTab: Dispatch<SetStateAction<"forgot" | "reset">>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Sending email...");
    try {
      const res = await forgotPassword(values.email);

      if (res?.success) {
        toast.success(res?.message, { id: toastId });
        saveToLocalStorage("email", values.email);
        setActiveTab("reset");
      } else {
        toast.error(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(
        error.message || "Failed to submit the form. Please try again.",
        {
          id: toastId,
        }
      );
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
