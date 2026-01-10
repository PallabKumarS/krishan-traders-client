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
import { Building2, Edit, Trash2, Calendar, Package } from "lucide-react";
import { Modal } from "../shared/Modal";
import { deleteCompany, updateCompany } from "@/services/CompanyService";
import { toast } from "sonner";
import { format } from "date-fns";
import CompanyForm from "../forms/CompanyForm";
import ConfirmationBox from "../shared/ConfirmationBox";
import ToggleButton from "../shared/ToggleButton";

interface CompanyCardProps {
	company: TCompany;
	onUpdate: () => void;
}

const CompanyCard = ({ company, onUpdate }: CompanyCardProps) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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

	const handleStatusToggle = async (newStatus: boolean) => {
		setIsUpdatingStatus(true);
		const toastId = toast.loading("Updating company status...");

		try {
			const res = await updateCompany(company._id, {
				isDisabled: !newStatus,
			});

			if (res.success) {
				toast.success(
					`Company ${newStatus ? "activated" : "deactivated"} successfully`,
					{ id: toastId },
				);
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
			setIsUpdatingStatus(false);
		}
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
					</div>
				</div>
			</CardHeader>

			<CardContent className="pb-3">
				{/* Company Details */}
				<div className="space-y-3">
					{/* Products Section */}
					{company.products && company.products.length > 0 ? (
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Package className="h-4 w-4 text-blue-500" />
								<span className="font-medium text-sm">
									Products ({company.products.length})
								</span>
							</div>
							<div className="ml-6 flex flex-wrap gap-4">
								{company.products.map((product: string, index: number) => (
									<span key={index} className="text-md text-muted-foreground">
										• {product}
									</span>
								))}
							</div>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Package className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground italic">
								No products added yet
							</span>
						</div>
					)}

					{/* Status Toggle and Date */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<span className="text-sm font-medium">Status:</span>
							<div className="flex items-center gap-2">
								<ToggleButton
									checked={!company.isDisabled}
									onCheckedChange={handleStatusToggle}
									disabled={isUpdatingStatus}
									size="md"
								/>
								<span className="text-sm text-muted-foreground">
									{company.isDisabled ? "Disabled" : "Active"}
								</span>
							</div>
						</div>
						<div className="flex items-center gap-1 text-sm text-muted-foreground">
							<Calendar className="h-3 w-3" />
							<span>{format(new Date(company.createdAt), "MMM dd, yyyy")}</span>
						</div>
					</div>
				</div>
			</CardContent>

			{/* Actions */}
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
