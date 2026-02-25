"use client";

import { use } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TAccount } from "@/types/account.type";

interface Props {
  accountsPromise: Promise<{ data: TAccount[] }>;
  value?: string;
  onChange?: (value: string) => void;
}

export default function AccountSelect({
  accountsPromise,
  value,
  onChange,
}: Props) {
  const accounts = use(accountsPromise);

  return (
    <div className="space-y-2">
      <Label>Selected Account</Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          defaultValue={
            accounts?.data?.find((acc) => acc.type === "cash")?._id ||
            accounts?.data?.[0]?._id
          }
          className="mt-1 w-2/3"
        >
          <SelectValue placeholder="Select account" />
        </SelectTrigger>

        <SelectContent>
          {accounts?.data?.map((acc) => (
            <SelectItem key={acc._id} value={acc._id}>
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
    </div>
  );
}
