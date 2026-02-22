"use client";

import { useForm, Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type CustomerFormValues = {
  customerType: "walk-in" | "customer";
  phoneNumber?: string;
  name?: string;
  email?: string;
  address?: string;
};

interface Props {
  // biome-ignore lint/suspicious/noExplicitAny: <>
  formRef: React.MutableRefObject<any>;
}

export function CustomerForm({ formRef }: Props) {
  const form = useForm<CustomerFormValues>({
    defaultValues: {
      customerType: "walk-in",
    },
  });

  const { register, control, watch } = form;

  // expose form methods to parent
  formRef.current = form;

  const customerType = watch("customerType");

  return (
    <div className="p-4 border-b space-y-4">
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          Customer Type
        </Label>

        <Controller
          control={control}
          name="customerType"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="walk-in" id="walk-in" />
                <Label htmlFor="walk-in">Walk-in</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer">Customer</Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      {customerType === "customer" && (
        <div className="space-y-3">
          <Input
            required
            placeholder="Phone Number *"
            {...register("phoneNumber")}
          />
          <Input placeholder="Name" {...register("name")} />
          <Input placeholder="Email" {...register("email")} />
          <Input placeholder="Address" {...register("address")} />
        </div>
      )}
    </div>
  );
}
