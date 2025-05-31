"use client";
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
import { PasswordInput } from "../ui/password-input";
import { useState } from "react";
import ButtonLoader from "../shared/ButtonLoader";
import { passwordChange } from "@/services/AuthService";

const formSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
  newPasswordConfirmed: z.string().min(1),
});

export default function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const newPassword = form.watch("newPassword");
  const newPasswordConfirmed = form.watch("newPasswordConfirmed");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Updating password...");
    setIsLoading(true);
    try {
      const res = await passwordChange({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      if (res?.success) {
        toast.success(res?.message, { id: toastId });
        setIsLoading(false);
      } else {
        toast.error(res?.message, { id: toastId });
        setIsLoading(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 md:px-5 py-10"
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your old password"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your new password"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* confirm password field  */}
        <FormField
          control={form.control}
          name="newPasswordConfirmed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your password again"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>

              {newPasswordConfirmed && newPassword !== newPasswordConfirmed ? (
                <FormMessage>Passwords do not match</FormMessage>
              ) : (
                <FormMessage />
              )}
            </FormItem>
          )}
        />

        <Button
          disabled={!!(newPassword !== newPasswordConfirmed)}
          type="submit"
        >
          {isLoading ? <ButtonLoader /> : "Change Password"}
        </Button>
      </form>
    </Form>
  );
}
