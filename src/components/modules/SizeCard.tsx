"use client";

import { useState } from "react";
import { TSize } from "@/types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Ruler, Edit, Trash2, Calendar, Package } from "lucide-react";
import { Modal } from "../shared/Modal";
import { deleteSize } from "@/services/SizeService";
import { toast } from "sonner";
import { format } from "date-fns";
import SizeForm from "../forms/SizeForm";
import ConfirmationBox from "../shared/ConfirmationBox";

interface SizeCardProps {
	sizeData: TSize;
	onUpdate: () => void;
}

const SizeCard = ({ sizeData, onUpdate }: SizeCardProps) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		const toastId = toast.loading("Deleting product sizes...");

		try {
			const res = await deleteSize(sizeData.productName);

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
						<Ruler className="h-5 w-5 text-primary" />
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-lg leading-tight">
							{sizeData.productName}
						</h3>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pb-3">
				{/* Size Details */}
				<div className="space-y-3">
					{/* Sizes Section */}
					{sizeData.size && sizeData.size.length > 0 ? (
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Package className="h-4 w-4 text-blue-500" />
								<span className="font-medium text-sm">
									Available Sizes ({sizeData.size.length})
								</span>
							</div>
							<div className="ml-6 grid grid-cols-2 gap-1">
								{sizeData.size
									.slice(0, 6)
									.map((size: string, index: number) => (
										<span
											key={index}
											className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded"
										>
											{size}
										</span>
									))}
								{sizeData.size.length > 6 && (
									<span className="text-sm text-muted-foreground font-medium col-span-2">
										+{sizeData.size.length - 6} more sizes
									</span>
								)}
							</div>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Package className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground italic">
								No sizes added yet
							</span>
						</div>
					)}

					{/* Creation Date */}
					{sizeData.createdAt && (
						<div className="flex items-center gap-1 text-xs text-muted-foreground">
							<Calendar className="h-3 w-3" />
							<span>
								{format(new Date(sizeData.createdAt), "MMM dd, yyyy")}
							</span>
						</div>
					)}
				</div>
			</CardContent>

			<CardFooter className="pt-3 border-t">
				<div className="flex gap-2 w-full">
					<Modal
						title="Edit Product Sizes"
						trigger={
							<Button variant="outline" size="sm" className="flex-1">
								<Edit className="h-4 w-4 mr-2" />
								Edit
							</Button>
						}
						content={
							<SizeForm
								edit={true}
								sizeData={sizeData}
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

export default SizeCard;
