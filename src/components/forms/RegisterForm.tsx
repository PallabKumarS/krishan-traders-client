"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import ButtonLoader from "../shared/ButtonLoader";
import { registerUser } from "@/services/AuthService";
import { Dispatch, SetStateAction, useState } from "react";

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  profileImg: z.string().optional(),
  password: z.string(),
  passwordConfirm: z.string(),
});

export default function RegisterForm({
  setActiveTab,
}: {
  setActiveTab: Dispatch<SetStateAction<"login" | "register">>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const password = form.watch("password");
  const passwordConfirm = form.watch("passwordConfirm");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Creating user...");
    setIsLoading(true);

    try {
      const res = await registerUser({ ...values, role: "guest" });

      if (res?.success) {
        toast.success(res?.message, { id: toastId });
        setActiveTab("login");
        setIsLoading(false);
      } else {
        toast.error(res?.message, { id: toastId });
        setIsLoading(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Form submission error", error);
      toast.error(error.message, { id: toastId });
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        {/* name field  */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your name"
                  type="text"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* email field  */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* profile photo field  */}
        <FormField
          control={form.control}
          name="profileImg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Photo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your Profile Photo Link"
                  type="text"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* password field  */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your password"
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
          name="passwordConfirm"
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

              {passwordConfirm && password !== passwordConfirm ? (
                <FormMessage>Passwords do not match</FormMessage>
              ) : (
                <FormMessage />
              )}
            </FormItem>
          )}
        />
        <Button
          variant={"outline"}
          disabled={!!(passwordConfirm && password !== passwordConfirm)}
          type="submit"
        >
          {isLoading ? <ButtonLoader /> : "Register"}
        </Button>
      </form>
    </Form>
  );
}
