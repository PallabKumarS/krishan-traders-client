/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ButtonLoader from "../shared/ButtonLoader";
import { useAppContext } from "@/providers/ContextProvider";

import { TCompany, TMongoose, TProduct, TSize, TStock } from "@/types";
import { addStock } from "@/services/RecordService";
import { directlyAddStock, updateStock } from "@/services/StockService";
import { getAllProductsByCompany } from "@/services/ProductService";
import { getSizesByProduct } from "@/services/SizeService";
import { DatePickerInput } from "../ui/date-picker-input";
import { DragDropUploader } from "../shared/DragDropUploader";

const formSchema = z.object({
  imgUrl: z.string(),
  productId: z.string().min(1, "Product is required"),
  sizeId: z.string().min(1, "Size is required"),

  quantity: z.coerce.number().min(1),
  buyingPrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),

  expiryDate: z.coerce.date(),
});

export default function StockAddForm({
  edit = false,
  stockData,
  selectedCompany,
  onSuccess,
}: {
  edit?: boolean;
  stockData?: TStock & TMongoose;
  selectedCompany: (TCompany & TMongoose) | null;
  onSuccess?: () => void;
}) {
  const { user } = useAppContext();

  // loading states
  const [isSizeLoading, setIsSizeLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // main data states
  const [products, setProducts] = useState<(TProduct & TMongoose)[]>([]);
  const [sizes, setSizes] = useState<(TSize & TMongoose)[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imgUrl: stockData?.imgUrl ?? "",
      productId: stockData?.size?.product?._id ?? "",
      sizeId: stockData?.size?._id ?? "",
      quantity: stockData?.quantity ?? 1,
      buyingPrice: stockData?.buyingPrice ?? 0,
      sellingPrice: stockData?.sellingPrice ?? 0,
      expiryDate: stockData?.expiryDate
        ? new Date(stockData.expiryDate)
        : new Date(),
    },
  });

  const productId = form.watch("productId");
  const sizeId = form.watch("sizeId");

  // fetch products by company
  const fetchProducts = async () => {
    try {
      const data = await getAllProductsByCompany(selectedCompany?._id || "");
      if (data?.success) {
        setProducts(data.data);
      }
    } catch (err: any) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [selectedCompany]);

  // fetch sizes by product
  const fetchSizes = async () => {
    try {
      const res = await getSizesByProduct(productId);
      if (res?.success) {
        setSizes(res.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSizeLoading(false);
    }
  };
  useEffect(() => {
    if (!productId) return;
    fetchSizes();
  }, [productId]);

  useEffect(() => {
    const size = sizes.find((s) => s._id === sizeId);
    if (!size) return;

    form.setValue("buyingPrice", size.buyingPrice);
    form.setValue("sellingPrice", size.sellingPrice);
  }, [sizeId, sizes]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const toastId = toast.loading("Saving stock...");

    const size = sizes.find((s) => s._id === sizeId);
    if (!size) return;

    const payload = {
      size: values.sizeId,
      quantity: values.quantity * size.stackCount,
      buyingPrice: values.buyingPrice,
      sellingPrice: values.sellingPrice,
      stockedBy: user?._id,
      stockedDate: new Date(),
      expiryDate: new Date(values.expiryDate),
    };

    try {
      const res = edit
        ? await updateStock(stockData?._id as string, payload)
        : user?.role === "admin"
          ? await directlyAddStock(payload)
          : await addStock(payload);

      if (res.success) {
        toast.success(res.message, { id: toastId });
        onSuccess?.();
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------- UI -------------------------------- */

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
        {/* Image Url */}
        <div className="flex flex-col gap-5">
          <DragDropUploader
            name="imgUrl"
            label="Upload your image"
            multiple={false}
          />
          <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Url</FormLabel>
                <FormControl>
                  <Input type="string" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Product */}
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size */}
          <FormField
            control={form.control}
            name="sizeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl className="w-full">
                    <SelectTrigger disabled={!productId || isSizeLoading}>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sizes.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Quantity */}
        <FormField
          disabled={!sizeId}
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity (Cartoon)</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="buyingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buying Price</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Expiry */}
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <div className="relative">
                  <DatePickerInput field={field} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <ButtonLoader /> : edit ? "Update Stock" : "Add Stock"}
        </Button>
      </form>
    </Form>
  );
}
