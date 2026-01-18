/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
"use client";

import CompanyForm from "@/components/forms/CompanyForm";
import ProductForm from "@/components/forms/ProductForm";
import LoadingData from "@/components/shared/LoadingData";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAllCompany } from "@/services/CompanyService";
import {
  deleteProduct,
  getAllProductsByCompany,
} from "@/services/ProductService";
import { deleteSize, getAllSizes } from "@/services/SizeService";
import { TCompany, TMongoose, TProduct, TSize } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createEmptySize, SizeTableData } from "./utils";
import SizeForm from "@/components/forms/SizeForm";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { toast } from "sonner";
const ManageInfoPage = () => {
  // loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSizeLoading, setIsSizeLoading] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(true);

  // modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [addSizeModalOpen, setAddSizeModalOpen] = useState(false);

  // edit data states
  const [editCompany, setEditCompany] = useState<(TCompany & TMongoose) | null>(
    null,
  );
  const [editProduct, setEditProduct] = useState<(TProduct & TMongoose) | null>(
    null,
  );
  const [editSize, setEditSize] = useState<(TSize & TMongoose) | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<
    (TCompany & TMongoose) | null
  >(null);

  // fetched data states
  const [companies, setCompanies] = useState<(TCompany & TMongoose)[]>([]);
  const [sizes, setSizes] = useState<(TSize & TMongoose)[]>([]);
  const [products, setProducts] = useState<(TProduct & TMongoose)[]>([]);

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

  // fetch products
  const fetchProducts = async () => {
    try {
      const data = await getAllProductsByCompany(
        selectedCompany?._id as string,
      );
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

  // create sizes map
  const sizesByProduct = useMemo(() => {
    const map = new Map<string, (TSize & TMongoose)[]>();

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
    const toastId = toast.loading("Deleting user...");

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
  const sizeColumns: ColumnDef<SizeTableData>[] = [
    {
      accessorKey: "product.name", //product name
      enableSorting: true,
      header: ({ column }) => (
        <div className="flex justify-center items-center gap-2">
          <SortableHeader column={column} title="Product Name" />
          {/* Add product modal */}
          <Modal
            key={"add-product-modal"}
            title="Add New Product"
            trigger={
              <Button
                title="Add new product."
                size="icon"
                variant="default"
                className="h-6 w-6 p-2"
              >
                <Plus className="h-6 w-6" />
              </Button>
            }
            content={
              <ProductForm
                edit={false}
                companies={companies}
                selectedCompany={selectedCompany as TCompany & TMongoose}
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
      ),
      cell: ({ row }) => (
        <div className="font-medium flex gap-2 justify-center items-center">
          <span
            className={`${row.original.product.isDisabled && "line-through"}`}
          >
            {row.original.product.name}
          </span>
          {/* Edit button */}
          <Button
            title="Edit this product."
            size="icon"
            variant="ghost"
            className="h-4 w-4 p-3"
            onClick={(e) => {
              e.stopPropagation();
              setEditProduct({
                ...row.original.product,
                _id: row.original.product._id,
              });
            }}
          >
            <Pen className="h-6 w-6" />
          </Button>

          {/* delete button */}
          <ConfirmationBox
            trigger={
              <Button
                title="Delete this product."
                size="icon"
                variant="ghost"
                className="h-4 w-4 p-3"
              >
                <Trash className="h-6 w-6 text-destructive" />
              </Button>
            }
            onConfirm={() => handleDeleteProduct(row.original.product._id)}
            title="Delete this product?"
            description={
              row.original._id === "empty"
                ? ""
                : "This will also delete all sizes associated with this product."
            }
          />
        </div>
      ),
    },
    {
      accessorKey: "label", // size label
      enableSorting: true,
      header: ({ column }) => (
        <SortableHeader column={column} title="Size Label" />
      ),
      cell: ({ row }) => (row.original.label ? row.original.label : "—"),
    },
    {
      accessorKey: "unitQuantity", // unit quantity
      enableSorting: true,
      header: ({ column }) => (
        <SortableHeader column={column} title="Unit Quantity" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.original._id === "empty"
              ? "—"
              : ` ${row.original.unitQuantity} ${row.original.unit}`}
          </div>
        );
      },
    },
    {
      accessorKey: "stackCount", // stack count
      enableSorting: true,
      header: ({ column }) => (
        <SortableHeader column={column} title="Stack Count" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.original._id === "empty" ? "—" : row.original.stackCount}
          </div>
        );
      },
    },
    {
      accessorKey: "actions", // actions
      enableSorting: false,
      header: () => (
        <div className="flex justify-center items-center gap-2">
          <span>Actions</span>
          {/* add size modal */}
          <Modal
            key={"add-size-modal"}
            title="Add New Size"
            trigger={
              <Button
                title="Add New Size."
                size="icon"
                variant="default"
                className="h-6 w-6 p-2"
              >
                <Plus className="h-6 w-6" />
              </Button>
            }
            content={
              <SizeForm
                edit={false}
                products={products}
                onSuccess={() => {
                  fetchSizes();
                  fetchProducts();
                }}
              />
            }
            open={addSizeModalOpen}
            onOpenChange={setAddSizeModalOpen}
          />
        </div>
      ),

      cell: ({ row }) => (
        <div className="flex gap-2 justify-center items-center">
          {/* Edit button */}
          <Button
            title="Edit this size."
            size="icon"
            variant="ghost"
            className={`h-4 w-4 p-3 ${row.original._id === "empty" && "hidden"}`}
            onClick={(e) => {
              e.stopPropagation();
              setEditSize({
                ...row.original,
                _id: row.original._id,
              });
            }}
          >
            <Pen className="h-6 w-6" />
          </Button>
          {/* delete button */}
          <ConfirmationBox
            trigger={
              <Button
                title="Delete this size."
                size="icon"
                variant="ghost"
                className={`h-4 w-4 p-3 ${row.original._id === "empty" && "hidden"}`}
              >
                <Trash className="h-6 w-6 text-destructive" />
              </Button>
            }
            onConfirm={() => handleDeleteSize(row.original._id as string)}
            title="Delete this size?"
          />
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
          <DataTable
            columns={processData.length > 0 ? sizeColumns : []}
            data={processData || []}
            stickyHeader={false}
          />
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
    </div>
  );
};

export default ManageInfoPage;
