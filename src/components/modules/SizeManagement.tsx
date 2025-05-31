"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TSize } from "@/types";
import { getAllSizes } from "@/services/SizeService";
import { Button } from "@/components/ui/button";
import { Modal } from "../shared/Modal";
import { Ruler, Plus } from "lucide-react";
import SizeCard from "./SizeCard";
import LoadingData from "../shared/LoadingData";
import SizeForm from "../forms/SizeForm";

const SizeManagement = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [sizeData, setSizeData] = useState<TSize[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchSizes = async () => {
    setIsFetching(true);
    try {
      const res = await getAllSizes();
      if (res?.success) {
        setSizeData(res.data);
      } else {
        toast.error("Failed to fetch product sizes");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch product sizes");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleAddSuccess = () => {
    setAddModalOpen(false);
    fetchSizes(); // Refresh the list
  };

  const handleUpdate = () => {
    fetchSizes(); // Refresh the list after edit/delete
  };

  if (isFetching) {
    return <LoadingData />;
  }

  return (
    <div className="mx-auto">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Size Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage product sizes and variations
          </p>
        </div>
        <Modal
          title="Add New Product Sizes"
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product Sizes
            </Button>
          }
          content={<SizeForm edit={false} onSuccess={handleAddSuccess} />}
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
        />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Ruler className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{sizeData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ruler className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Sizes</p>
              <p className="text-2xl font-bold">
                {sizeData.reduce(
                  (total, product) => total + product.size.length,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sizes Grid */}
      {sizeData.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Ruler className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Product Sizes Found</h3>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t added any product sizes yet. Start by adding your
            first product with its available sizes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6">
          {sizeData.map((size) => (
            <SizeCard key={size._id} sizeData={size} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SizeManagement;
