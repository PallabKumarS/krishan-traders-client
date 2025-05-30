"use client";

import { useState } from "react";
import { TCompany } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Building2, Edit, Trash2, Calendar } from "lucide-react";
import { Modal } from "../shared/Modal";
import { deleteCompany } from "@/services/CompanyService";
import { toast } from "sonner";
import { format } from "date-fns";
import CompanyForm from "../forms/CompanyForm";
import ConfirmationBox from "../shared/ConfirmationBox";

interface CompanyCardProps {
  company: TCompany;
  onUpdate: () => void;
}

const CompanyCard = ({ company, onUpdate }: CompanyCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Deleting company...");

    try {
      const res = await deleteCompany(company._id);

      if (res.success) {
        toast.success(res.message, { id: toastId });
        onUpdate();
      } else {
        toast.error(res.message, { id: toastId });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message, {
        id: toastId,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    onUpdate();
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">
              {company.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Company ID: {company._id}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Created: {format(new Date(company.createdAt), "MMM dd, yyyy")}
            </span>
          </div>
          {company.updatedAt !== company.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Updated: {format(new Date(company.updatedAt), "MMM dd, yyyy")}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex gap-2 w-full">
          <Modal
            title="Edit Company"
            trigger={
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            }
            content={
              <CompanyForm
                edit={true}
                companyData={company}
                onSuccess={handleEditSuccess}
              />
            }
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
          />

          <ConfirmationBox
            trigger={
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            }
            onConfirm={handleDelete}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default CompanyCard;
