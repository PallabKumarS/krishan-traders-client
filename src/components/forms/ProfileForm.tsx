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
// import { LoaderCircleIcon } from "lucide-react";
import { TUser } from "@/types";
import ButtonLoader from "../shared/ButtonLoader";
import { updateUser } from "@/services/UserService";
import { useAppContext } from "@/providers/ContextProvider";
import { useState } from "react";

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
});

export default function ProfileForm({
  userData,
}: {
  userData: Partial<TUser> | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      phoneNumber: userData?.phoneNumber || "",
      address: userData?.address || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Updating user...");
    setIsLoading(true);

    try {
      const res = await updateUser(userData?._id as string, values);

      if (res?.success) {
        toast.success(res?.message, { id: toastId });
        setUser(res?.data);
        setIsLoading(false);
      } else {
        toast.error(res?.message, { id: toastId });
        setIsLoading(false);
      }
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
        className="space-y-8 md:px-5 py-10"
      >
        {/* name field  */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" type="text" {...field} />
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
                  readOnly
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* phone field  */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone No.</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your phone number"
                  type="number"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* address field  */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your address"
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isLoading ? <ButtonLoader /> : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
