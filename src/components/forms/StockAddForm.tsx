/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { useAppContext } from "@/providers/ContextProvider";
import ButtonLoader from "../shared/ButtonLoader";
import { TCompany, TStock } from "@/types";
import { addStock } from "@/services/RecordService";
import { updateStock } from "@/services/StockService";
import DatePicker from "react-datepicker";
import { getAllCompany } from "@/services/CompanyService";
import { FormSkeleton } from "../ui/skeleton";
import { getSingleSize } from "@/services/SizeService";

const formSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  companyName: z.string().min(1, "Company name is required"),
  size: z.string().min(1, "Size is required"),
  quantity: z.string().min(1, "Quantity is required"),
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
  const [isCLoading, setIsCLoading] = useState(false);
  const [isSLoading, setIsSLoading] = useState(false);
  const [companyData, setCompanyData] = useState<TCompany[]>([]);
  const [productNames, setProductNames] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const { user } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: stockData?.productName || "",
      companyName: stockData?.companyName || "",
      size: stockData?.size ? stockData?.size : "",
      quantity: String(stockData?.quantity) || "",
      expiryDate: stockData?.expiryDate
        ? new Date(stockData?.expiryDate)
        : new Date(),
    },
  });

  const companyName = form.watch("companyName");
  const productName = form.watch("productName");

  // Fetch company data
  useEffect(() => {
    setIsCLoading(true);

    const fetchData = async () => {
      try {
        const res = await getAllCompany();

        if (res.success) {
          setCompanyData(res.data);
        } else {
          toast.error(res.message || "Failed to fetch companies");
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsCLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch product names based on selected company
  useEffect(() => {
    if (companyName) {
      // Find the selected company and get its products
      const selectedCompany = companyData.find(
        (company) => company.name === companyName
      );
      if (selectedCompany) {
        setProductNames(selectedCompany.products || []);
      } else {
        setProductNames([]);
      }
      // Reset product selection when company changes
      form.setValue("productName", "");
    } else {
      setProductNames([]);
      form.setValue("productName", "");
    }
  }, [companyName, form, companyData]);

  // Fetch sizes based on selected product
  useEffect(() => {
    setIsSLoading(true);
    if (productName) {
      const fetchSizes = async () => {
        const res = await getSingleSize(productName);
        if (res.success) {
          setSizes(res.data.size);
        } else {
          toast.error(res.message || "Failed to fetch sizes");
        }
      };

      fetchSizes();
      setIsSLoading(false);
    }
  }, [productName]);

  // Function to format date to YYYY-MM-DD
  const formatDateToYMD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const toastId = toast.loading("Submitting...");

    const stock = {
      ...values,
      quantity: Number(values.quantity),
      stockedDate: formatDateToYMD(new Date()),
      stockedBy: user?._id,
      expiryDate: formatDateToYMD(values.expiryDate),
    };

    try {
      const res = !edit
        ? await addStock(stock)
        : await updateStock(stockData?._id as string, stock);

      if (res.success) {
        toast.success(res.message, { id: toastId });
        form.reset();
        setLoading(false);
      } else {
        toast.error(res.message, { id: toastId });
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message, {
        id: toastId,
      });
    }
  }

  return (
    <Form {...form}>
      {isCLoading ? (
        <FormSkeleton />
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
          {/* Company Name Dropdown */}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isCLoading}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <SelectValue
                        placeholder={
                          isCLoading
                            ? "Loading companies..."
                            : "Select a company"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companyData.length === 0 && !isCLoading ? (
                      <SelectItem value="no-companies" disabled>
                        No companies available
                      </SelectItem>
                    ) : (
                      companyData.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name}
                          disabled={company.isDisabled}
                        >
                          {company.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Name select */}
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!companyName || productNames.length === 0}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <SelectValue
                        placeholder={
                          !companyName
                            ? "Select a company first"
                            : productNames.length === 0
                            ? "No products available"
                            : "Select a product"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {productNames.length === 0 ? (
                      <SelectItem value="no-products" disabled>
                        No products available
                      </SelectItem>
                    ) : (
                      productNames.map((product, index) => (
                        <SelectItem key={index} value={product}>
                          {product}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock Size */}
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSLoading}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <SelectValue
                        placeholder={
                          isSLoading
                            ? "Select a product first"
                            : sizes.length === 0
                            ? "No sizes available"
                            : "Select a size"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sizes.length === 0 ? (
                      <SelectItem value="no-sizes" disabled>
                        No Sizes available
                      </SelectItem>
                    ) : (
                      sizes.map((size, index) => (
                        <SelectItem key={index} value={size}>
                          {size}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quantity */}
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
                    min="1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expiry Date - Using HTML date input for better year navigation */}
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => {
                        if (date) {
                          field.onChange(date);
                        }
                      }}
                      dateFormat="PPP"
                      minDate={new Date()}
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      yearDropdownItemNumber={15}
                      scrollableYearDropdown
                      placeholderText="Pick an expiry date"
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        !field.value && "text-muted-foreground"
                      )}
                      wrapperClassName="w-full"
                      popperClassName="z-50"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <ButtonLoader /> : edit ? "Update Stock" : "Add Stock"}
          </Button>
        </form>
      )}
    </Form>
  );
}
