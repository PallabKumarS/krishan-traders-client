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
import { PasswordInput } from "../ui/password-input";
import { Input } from "../ui/input";
import { resetPassword } from "@/services/AuthService";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from "@/lib/localStorage";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
  code: z.string().min(1),
});

export default function ResetPassword() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Resetting password...");
    try {
      const res = await resetPassword({
        code: Number(values.code),
        password: values.password,
        email: getFromLocalStorage("email") as string,
      });

      if (res?.success) {
        toast.success(res?.message, { id: toastId });
        removeFromLocalStorage("email");
        router.push("/login");
      } else {
        toast.error(res?.message, { id: toastId });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.message || "Failed to submit the form. Please try again."
      );
    }
  }

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the code sent to your email"
                  type="number"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter the new password"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Confirm the new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={password !== confirmPassword} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
