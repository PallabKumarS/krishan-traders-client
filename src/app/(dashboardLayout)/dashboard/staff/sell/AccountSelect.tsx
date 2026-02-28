"use client";

import { RefObject, use } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TAccount } from "@/types/account.type";
import { Controller, useForm } from "react-hook-form";
import { useWheelSelectRHF } from "@/hooks/use-scroll-select";

interface Props {
  accountsPromise: Promise<{ data: TAccount[] }>;
  // biome-ignore lint/suspicious/noExplicitAny: <>
  formRef: RefObject<any>;
  onChange?: (value: string) => void;
}

export default function AccountSelect({ accountsPromise, formRef }: Props) {
  const accounts = use(accountsPromise);
  const form = useForm<{ accountId: string }>({
    defaultValues: {
      accountId:
        accounts?.data?.find((acc) => acc.type === "cash")?._id ||
        accounts?.data?.[0]?._id ||
        "",
    },
  });

  const { register, control } = form;

  formRef.current = form;

  return (
    <div className="space-y-2">
      <Label>Selected Account</Label>

      <Controller
        control={control}
        name="accountId"
        render={({ field }) => {
          // biome-ignore lint/correctness/useHookAtTopLevel: <>
          const wheelProps = useWheelSelectRHF({
            options: accounts?.data?.map((acc) => acc._id) || [],
            value: field.value,
            onChange: field.onChange,
          });

          return (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              {...register("accountId")}
            >
              <SelectTrigger className="mt-1 w-2/3" {...wheelProps}>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>

              <SelectContent>
                {accounts?.data?.map((acc) => (
                  <SelectItem
                    defaultChecked={acc.type === "cash"}
                    key={acc._id}
                    value={acc._id}
                  >
                    <div className="flex justify-between w-full gap-4">
                      <span>
                        {acc.name} ({acc.type})
                      </span>
                      <span className="text-muted-foreground">
                        ৳{acc.currentBalance}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
    </div>
  );
}
