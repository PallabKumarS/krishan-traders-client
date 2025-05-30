/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useRouter, useSearchParams } from "next/navigation";
import ButtonLoader from "../shared/ButtonLoader";
import { useState } from "react";
import { loginUser } from "@/services/AuthService";
import { useAppContext } from "@/providers/ContextProvider";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirectPath");
  const router = useRouter();
  const { setToken } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("logging in...");
    setIsLoading(true);

    try {
      const res = await loginUser(values);

      if (res?.success) {
        setToken(res?.data.accessToken);
        setIsLoading(false);

        toast.success(res?.message, { id: toastId });
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push("/dashboard/main-store");
        }
      } else {
        toast.error(res?.message, { id: toastId });
        setIsLoading(false);
      }
    } catch (error: any) {
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

        <Button variant={"outline"}>
          {isLoading ? <ButtonLoader /> : "Login"}
        </Button>
      </form>
    </Form>
  );
}
