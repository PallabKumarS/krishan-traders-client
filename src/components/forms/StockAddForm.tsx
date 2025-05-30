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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  Plus,
} from "lucide-react";
import { useAppContext } from "@/providers/ContextProvider";
import ButtonLoader from "../shared/ButtonLoader";
import { TCompany, TStock } from "@/types";
import { addStock } from "@/services/RecordService";
import { updateStock } from "@/services/StockService";
import {
  getAllCompany,
  getProductNamesByCompanyName,
} from "@/services/CompanyService";
import DatePicker from "react-datepicker";

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
  const [companyData, setCompanyData] = useState<TCompany[]>([]);
  const [productNames, setProductNames] = useState<string[]>([]);
  const [productComboOpen, setProductComboOpen] = useState(false);
  const [productInputValue, setProductInputValue] = useState("");
  const [useCustomProduct, setUseCustomProduct] = useState(false);
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

  useEffect(() => {
    if (companyName) {
      const fetchProductNames = async () => {
        try {
          const res = await getProductNamesByCompanyName(companyName);
          if (res.success) {
            setProductNames(res.data);
          } else {
            toast.error(res.message || "Failed to fetch products");
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      };

      fetchProductNames();
    } else {
      setProductNames([]);
      form.setValue("productName", "");
      setProductInputValue("");
      setUseCustomProduct(false);
    }
  }, [companyName, form]);

  // Filter products based on input
  const filteredProducts = productNames.filter((product) =>
    product.toLowerCase().includes(productInputValue.toLowerCase())
  );

  const handleProductSelect = (selectedProduct: string) => {
    form.setValue("productName", selectedProduct);
    setProductInputValue(selectedProduct);
    setProductComboOpen(false);
    setUseCustomProduct(false);
  };

  const handleCustomProductInput = (value: string) => {
    setProductInputValue(value);
    form.setValue("productName", value);
    setUseCustomProduct(true);
  };

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
        setProductInputValue("");
        setUseCustomProduct(false);
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
                        isCLoading ? "Loading companies..." : "Select a company"
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
                      <SelectItem key={company._id} value={company.name}>
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

        {/* Product Name Input + Dropdown Combo */}
        <FormField
          control={form.control}
          name="productName"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Product Name</FormLabel>

              {/* Custom Input Field */}
              <FormControl>
                <Input
                  placeholder={
                    !companyName
                      ? "Select a company first"
                      : "Type product name or select from existing..."
                  }
                  value={productInputValue}
                  onChange={(e) => handleCustomProductInput(e.target.value)}
                  disabled={!companyName}
                  className="w-full"
                />
              </FormControl>

              {/* Existing Products Dropdown */}
              {companyName && productNames.length > 0 && (
                <div className="space-y-2">
                  <Popover
                    open={productComboOpen}
                    onOpenChange={setProductComboOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={productComboOpen}
                        className="w-full justify-between text-muted-foreground"
                        type="button"
                      >
                        {productInputValue &&
                        !useCustomProduct &&
                        productNames.includes(productInputValue)
                          ? productInputValue
                          : "Select from existing products..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search products..."
                          value={productInputValue}
                          onValueChange={setProductInputValue}
                        />
                        <CommandList>
                          <CommandEmpty>
                            <div className="flex flex-col items-center gap-2 py-4">
                              <p className="text-sm text-muted-foreground">
                                No products found.
                              </p>
                              {productInputValue && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    handleCustomProductInput(productInputValue);
                                    setProductComboOpen(false);
                                  }}
                                  type="button"
                                  className="gap-2"
                                >
                                  <Plus className="h-4 w-4" />
                                  Add &quot;{productInputValue}&quot; as new
                                  product
                                </Button>
                              )}
                            </div>
                          </CommandEmpty>
                          <CommandGroup>
                            {filteredProducts.map((product) => (
                              <CommandItem
                                key={product}
                                value={product}
                                onSelect={() => handleProductSelect(product)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    productName === product
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {product}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Helper text */}
                  <p className="text-xs text-muted-foreground">
                    {useCustomProduct && productInputValue ? (
                      <span className="flex items-center gap-1">
                        <Plus className="h-3 w-3" />
                        Adding &quot;{productInputValue}&quot; as a new product
                      </span>
                    ) : (
                      "Type to search existing products or enter a new product name"
                    )}
                  </p>
                </div>
              )}

              {!companyName && (
                <p className="text-sm text-muted-foreground">
                  Please select a company to view available products
                </p>
              )}

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
              <FormControl>
                <Input
                  placeholder="Enter stock size (e.g., 50kg, 1L, 500ml)..."
                  type="text"
                  {...field}
                />
              </FormControl>
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
    </Form>
  );
}
