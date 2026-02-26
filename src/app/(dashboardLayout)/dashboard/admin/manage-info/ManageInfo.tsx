/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
"use client";

import CompanyForm from "@/components/forms/CompanyForm";
import ProductForm from "@/components/forms/ProductForm";
import LoadingData from "@/components/shared/LoadingData";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAllCompany } from "@/services/CompanyService";
import {
  deleteProduct,
  getAllProductsByCompany,
} from "@/services/ProductService";
import { deleteSize, getAllSizes } from "@/services/SizeService";
import { TCompany, TProduct, TSize } from "@/types";
import { Pen, Plus, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createEmptySize } from "./utils";
import SizeForm from "@/components/forms/SizeForm";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { GroupedTable } from "@/components/ui/grouped-table";
// biome-ignore lint/correctness/noUnusedFunctionParameters: <>
const ManageInfo = ({ query }: { query: Record<string, unknown> }) => {
  // loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSizeLoading, setIsSizeLoading] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(true);

  // modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);

  // edit data states
  const [editCompany, setEditCompany] = useState<TCompany | null>(null);
  const [editProduct, setEditProduct] = useState<TProduct | null>(null);
  const [editSize, setEditSize] = useState<TSize | null>(null);

  // selected states
  const [selectedCompany, setSelectedCompany] = useState<TCompany | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);

  // fetched data states
  const [companies, setCompanies] = useState<TCompany[]>([]);
  const [sizes, setSizes] = useState<TSize[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);

  // load companies
  const fetchCompanies = async () => {
    try {
      const data = await getAllCompany();
      if (data?.success && data.data.length > 0) {
        setCompanies(data.data);
        setSelectedCompany(data.data[0]);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);

  // fetch products
  const fetchProducts = async () => {
    try {
      const data = await getAllProductsByCompany(selectedCompany?._id || "");
      if (data?.success) {
        setProducts(data.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProductLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [selectedCompany]);

  // size loading
  const fetchSizes = async () => {
    try {
      const data = await getAllSizes();
      if (data?.success) {
        setSizes(data.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSizeLoading(false);
    }
  };
  useEffect(() => {
    fetchSizes();
  }, []);

  // create sizes map
  const sizesByProduct = useMemo(() => {
    const map = new Map<string, TSize[]>();

    for (const size of sizes) {
      const productId = size.product._id;
      if (!map.has(productId)) {
        map.set(productId, []);
      }
      map.get(productId)!.push(size);
    }

    return map;
  }, [sizes]);

  // process data
  const processData = useMemo(() => {
    if (!products.length) return [];

    return products.flatMap((product) => {
      const productSizes = sizesByProduct.get(product._id) ?? [];

      // 🟡 No sizes → return ONE empty row
      if (productSizes.length === 0) {
        return [createEmptySize(product)];
      }

      // 🟢 Has sizes → return all real rows
      return productSizes.map((size) => ({
        ...size,
        product: {
          ...product,
          _id: product._id,
        },
      }));
    });
  }, [products, sizesByProduct]);

  const handleDeleteSize = async (id: string) => {
    const toastId = toast.loading("Deleting size...");

    try {
      const res = await deleteSize(id);
      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
        fetchSizes();
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(error.message, {
        id: toastId,
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const toastId = toast.loading("Deleting product...");
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
        fetchProducts();
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(error.message, {
        id: toastId,
      });
    }
  };

  // columns
  const tableColumns = [
    {
      key: "product.name",
      title: "Product Name",
      sortable: true,
      render: (value: any, row: any) => (
        <div className="flex items-center justify-center gap-1">
          <span className={`${row.product.isDisabled && "line-through"}`}>
            {value}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditProduct(row.product)}
          >
            <Pen className="h-4 w-4" />
          </Button>
          <ConfirmationBox
            trigger={
              <Button size="sm" variant="ghost">
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            }
            onConfirm={() => handleDeleteProduct(row.product._id)}
            title="Delete this product?"
            description={
              row._id === "empty"
                ? ""
                : "This will also delete all sizes associated with this product."
            }
          />
        </div>
      ),
    },
    {
      key: "label",
      title: "Size Label",
      sortable: true,
      render: (value: any) =>
        value ? <Badge variant="secondary">{value}</Badge> : "—",
    },
    {
      key: "unitQuantity",
      title: "Pack Size",
      sortable: true,
      render: (_value: any, row: any) =>
        row._id === "empty" ? "—" : `${row.unitQuantity} ${row.unit}`,
    },
    {
      key: "stackCount",
      title: "Stack Count",
      sortable: true,
      render: (value: any, row: any) => (row._id === "empty" ? "—" : value),
    },
    {
      key: "buyingPrice",
      title: "Buying Price",
      sortable: true,
      render: (value: any, row: any) =>
        row._id === "empty" ? "—" : `${Number(value).toFixed(2)} BDT`,
    },
    {
      key: "sellingPrice",
      title: "Selling Price",
      sortable: true,
      render: (value: any, row: any) =>
        row._id === "empty" ? "—" : `${Number(value).toFixed(2)} BDT`,
    },
    {
      key: "actions",
      title: "Actions",
      sortable: false,
      render: (_value: any, row: any) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="hover:"
            onClick={() => setSelectedProduct(row.product)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          {row._id !== "empty" && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditSize(row)}
              >
                <Pen className="h-4 w-4" />
              </Button>
              <ConfirmationBox
                trigger={
                  <Button size="sm" variant="ghost">
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                }
                onConfirm={() => handleDeleteSize(row._id)}
                title="Delete this size?"
              />
            </>
          )}
        </div>
      ),
    },
  ];

  if (isLoading && isSizeLoading && isProductLoading) {
    return <LoadingData />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Information</h1>

      <Tabs
        defaultValue={companies?.[0]?._id}
        className="w-full h-full mx-auto"
      >
        {/* TAB LIST of companies */}
        <TabsList className="flex flex-wrap gap-5 h-full border mb-5">
          {companies.map((company) => (
            <div
              key={company._id}
              className={`flex items-center gap-2 min-w-60 border border-accent rounded-xl ${
                selectedCompany?._id === company._id && "bg-accent/50"
              } ${company.isDisabled && "opacity-50"}`}
            >
              {/* TAB */}
              <TabsTrigger
                value={company._id}
                onClick={() => setSelectedCompany(company)}
                className="px-4 grow data-[state=active]:bg-base data-[state=active]:shadow-none"
              >
                <span className="truncate">{company.name}</span>
              </TabsTrigger>

              {/* Edit button */}
              <Button
                title="Edit this company."
                size="icon"
                variant="ghost"
                className="h-8 w-8 border-l border-accent text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditCompany(company);
                }}
              >
                <Pen className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Add company */}
          <Modal
            key={"add-company"}
            title="Add New Company"
            trigger={
              <Button className="gap-2 min-w-60">
                <Plus className="h-4 w-4" />
                Add Company
              </Button>
            }
            content={
              <CompanyForm
                edit={false}
                onSuccess={() => {
                  fetchCompanies();
                  setAddModalOpen(false);
                }}
              />
            }
            open={addModalOpen}
            onOpenChange={setAddModalOpen}
          />
        </TabsList>

        <TabsContent value={selectedCompany?._id as string}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Products and Sizes</h2>
              <Modal
                title="Add New Product"
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                }
                content={
                  <ProductForm
                    edit={false}
                    companies={companies}
                    selectedCompany={selectedCompany!}
                    onSuccess={() => {
                      fetchSizes();
                      fetchProducts();
                    }}
                  />
                }
                open={addProductModalOpen}
                onOpenChange={setAddProductModalOpen}
              />
            </div>

            <GroupedTable
              data={processData}
              columns={tableColumns}
              groupBy="product.name"
              searchKeys={["product.name", "label", "unit"]}
              enableColumnToggle
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* edit company modal */}
      <Modal
        trigger={null}
        title="Edit Company"
        open={!!editCompany}
        onOpenChange={(open) => {
          if (!open) setEditCompany(null);
        }}
        content={
          editCompany && (
            <CompanyForm
              edit
              companyData={editCompany}
              onSuccess={() => {
                fetchCompanies();
                setEditCompany(null);
              }}
            />
          )
        }
      />

      {/* edit product modal */}
      <Modal
        trigger={null}
        title="Edit Product"
        open={!!editProduct}
        onOpenChange={(open) => {
          if (!open) setEditProduct(null);
        }}
        content={
          editProduct && (
            <ProductForm
              edit
              productData={editProduct}
              companies={companies}
              onSuccess={() => {
                fetchSizes();
                fetchProducts();
                setEditProduct(null);
              }}
            />
          )
        }
      />

      {/* edit size modal */}
      <Modal
        trigger={null}
        title="Edit Size"
        open={!!editSize}
        onOpenChange={(open) => {
          if (!open) setEditSize(null);
        }}
        content={
          editSize && (
            <SizeForm
              edit
              sizeData={editSize}
              products={products}
              onSuccess={() => {
                fetchSizes();
                setEditSize(null);
              }}
            />
          )
        }
      />

      {/* add size modal */}
      <Modal
        key={selectedProduct?._id || "add-size-modal"}
        title="Add New Size"
        trigger={null}
        content={
          selectedProduct && (
            <SizeForm
              edit={false}
              products={products}
              selectedProduct={selectedProduct}
              onSuccess={() => {
                fetchSizes();
                setSelectedProduct(null);
              }}
            />
          )
        }
        open={!!selectedProduct}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default ManageInfo;
