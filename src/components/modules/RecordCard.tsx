/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRecord } from "@/types";
import { format } from "date-fns";
import {
	ArrowDown,
	ArrowUp,
	Box,
	Calendar,
	Package,
	Tag,
	Trash2,
	User,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import {
	acceptAddStock,
	acceptSellStock,
	deleteRecord,
} from "@/services/RecordService";
import { toast } from "sonner";
import { useState } from "react";
import ButtonLoader from "../shared/ButtonLoader";
import ConfirmationBox from "../shared/ConfirmationBox";

// Text size configuration - easily changeable
const TEXT_SIZES = {
	title: "text-lg", // Product name
	subtitle: "text-base", // Company name
	badge: "text-sm", // ID badge and status badge
	info: "text-sm", // All info items (user, quantity, etc.)
	button: "text-sm", // Button text
} as const;

// Icon size configuration
const ICON_SIZES = {
	small: "h-4 w-4", // Info icons
	medium: "h-5 w-5", // Button icons
} as const;

interface RecordCardProps {
	record: TRecord;
	onStatusUpdate?: () => void;
}

const RecordCard = ({ record, onStatusUpdate }: RecordCardProps) => {
	const [isUpdating, setIsUpdating] = useState(false);

	// Determine if it's a stock addition or sale
	const isStockAddition = record?.stockedBy && !record.soldBy;

	// Get the relevant user
	const user = isStockAddition ? record?.stockedBy : record.soldBy;

	// Get status color
	const getStatusColor = () => {
		switch (record.status) {
			case "accepted":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "rejected":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			case "sold":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
			case "expired":
				return "bg-purple-100 text-purple-800 dark:bg-red-900 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
		}
	};

	const handleStatusUpdate = async (status: TRecord["status"]) => {
		if (isUpdating) return;

		setIsUpdating(true);
		try {
			const response = isStockAddition
				? await acceptAddStock(record._id, { status })
				: await acceptSellStock(record._id, { status });

			if (response.success) {
				toast.success(`Status updated to ${status}`);
				if (onStatusUpdate) onStatusUpdate();
			} else {
				toast.error(response.message || "Failed to update status");
			}
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleStockDelete = async (id: string) => {
		const toastId = toast.loading("Deleting stock...");

		try {
			const res = await deleteRecord(id);
			if (res.success) {
				toast.success(res.message, {
					id: toastId,
				});
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

	// Only show status dropdown for pending records
	const showStatusDropdown = record?.status === "pending";

	return (
		<Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
			<CardContent className="p-4">
				<div className="flex items-start justify-between mb-3">
					<div className="flex flex-col">
						<span className={`font-medium ${TEXT_SIZES.title}`}>
							{record?.stockId?.productName}
						</span>
						<div className="">
							<p className={`${TEXT_SIZES.subtitle} text-muted-foreground`}>
								{record?.stockId?.companyName}
							</p>
						</div>
					</div>
					<Badge
						className={`capitalize ${TEXT_SIZES.badge} ${getStatusColor()}`}
					>
						{record?.status}
					</Badge>
				</div>

				<div className="grid grid-cols-2 gap-3">
					{/* User info */}
					<div className="flex items-center gap-2">
						<User className={`${ICON_SIZES.small} text-muted-foreground`} />
						<span className={TEXT_SIZES.info}>{user?.name || "Unknown"}</span>
					</div>

					{/* Quantity */}
					<div className="flex items-center gap-2">
						<Package className={`${ICON_SIZES.small} text-muted-foreground`} />
						<span className={TEXT_SIZES.info}>
							Qty:
							<strong>{record?.quantity}</strong> Box
						</span>
					</div>

					{/* Transaction type */}
					<div className="flex items-center gap-2">
						{isStockAddition ? (
							<ArrowUp className={`${ICON_SIZES.small} text-green-500`} />
						) : (
							<ArrowDown className={`${ICON_SIZES.small} text-blue-500`} />
						)}
						<span className={`capitalize ${TEXT_SIZES.info}`}>
							{isStockAddition ? "Added" : "Sold"}
						</span>
					</div>

					{/* Size */}
					<div className="flex items-center gap-2">
						<Box className={`${ICON_SIZES.small} text-muted-foreground`} />
						<span className={TEXT_SIZES.info}>{record?.stockId?.size}</span>
					</div>

					{/* Stocked date if available */}
					{record.stockedDate && (
						<div className="flex items-center gap-2 col-span-2">
							<Calendar className={`${ICON_SIZES.small} text-green-500`} />
							<span className={TEXT_SIZES.info}>
								Stocked: {format(new Date(record?.stockedDate), "PP")}
							</span>
						</div>
					)}

					{/* Sold date if available */}
					{record.soldDate && (
						<div className="flex items-center gap-2 col-span-2">
							<Calendar className={`${ICON_SIZES.small} text-blue-500`} />
							<span className={TEXT_SIZES.info}>
								Sold: {format(new Date(record?.soldDate), "PP")}
							</span>
						</div>
					)}

					{/* Expiry date if available */}
					{record?.stockId?.expiryDate && (
						<div className="flex items-center gap-2 col-span-2">
							<Tag className={`${ICON_SIZES.small} text-red-500`} />
							<span className={TEXT_SIZES.info}>
								Expires: {format(new Date(record?.stockId?.expiryDate), "PP")}
							</span>
						</div>
					)}
				</div>
			</CardContent>

			<CardFooter className="p-3 pt-0 space-x-4 justify-end">
				{showStatusDropdown && (
					<div className="flex justify-start gap-2 flex-1">
						<Button
							onClick={() => handleStatusUpdate("accepted")}
							disabled={isUpdating}
							size="sm"
							className={`${TEXT_SIZES.button} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors`}
						>
							{isUpdating ? <ButtonLoader /> : "Accept"}
						</Button>

						<ConfirmationBox
							trigger={
								<Button
									disabled={isUpdating}
									size="sm"
									className={`${TEXT_SIZES.button} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors`}
								>
									{isUpdating ? <ButtonLoader /> : "Reject"}
								</Button>
							}
							title="Are you sure you want to reject this record?"
							description="This action cannot be undone."
							onConfirm={() => handleStatusUpdate("rejected")}
						/>
					</div>
				)}

				<div className="">
					<ConfirmationBox
						trigger={
							<Button variant="destructive" size="sm">
								<Trash2 className={ICON_SIZES.medium} />
							</Button>
						}
						onConfirm={() => handleStockDelete(record._id)}
					/>
				</div>
			</CardFooter>
		</Card>
	);
};

export default RecordCard;
