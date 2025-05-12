"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useAppContext } from "@/providers/ContextProvider";
import { addStock } from "@/services/StockService";
import ButtonLoader from "../shared/ButtonLoader";
import { TStock } from "@/types";

const formSchema = z.object({
  productName: z.string().min(1).min(0),
  brandName: z.string().min(1),
  size: z.string().min(1),
  quantity: z.string().min(1),
  expiryDate: z.coerce.date(),
});

export default function StockAddForm({
  edit = false,
  stockData,
}: {
  edit?: boolean;
  stockData?: TStock;
}) {
  const [loading, setLoading] = useState(false);
  const { user } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: stockData?.productName || "",
      brandName: stockData?.brandName || "",
      size: stockData?.size ? stockData?.size : "",
      quantity: String(stockData?.quantity) || "",
      expiryDate: stockData?.expiryDate
        ? new Date(stockData?.expiryDate)
        : new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const toastId = toast.loading("Submitting...");

    const stocKData = {
      ...values,
      quantity: Number(values.quantity),
      stockDate: new Date(),
      stockedBy: user?._id,
    };

    // return console.log(stocKData);

    try {
      const res = await addStock(stocKData);

      if (res.success) {
        toast.success(res.message, { id: toastId });
        form.reset();
        setLoading(false);
      } else {
        toast.error(res.message, { id: toastId });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-10">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter product name..."
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter brand name..."
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Size</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter stock size..."
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter quantity..."
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
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {loading ? <ButtonLoader /> : "Submit Stock"}
        </Button>
      </form>
    </Form>
  );
}
