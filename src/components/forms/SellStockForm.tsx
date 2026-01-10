"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import ButtonLoader from "../shared/ButtonLoader";
import { useState } from "react";
import { useAppContext } from "@/providers/ContextProvider";
import { sellStock } from "@/services/RecordService";

const formSchema = z.object({
	quantity: z.string().refine(
		(value) => {
			const num = parseInt(value);
			return !isNaN(num) && num > 0;
		},
		{
			message: "Quantity must be a positive number",
		},
	),
});

interface SellStockFormProps {
	stockId: string;
	maxQuantity: number;
}

const SellStockForm = ({ stockId, maxQuantity }: SellStockFormProps) => {
	const { user } = useAppContext();
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			quantity: "1",
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const quantity = parseInt(values.quantity);
		const toastId = toast.loading("Selling stock...");

		if (quantity > maxQuantity) {
			toast.error(`Cannot sell more than available quantity (${maxQuantity})`, {
				id: toastId,
			});
			return;
		}

		const stockData = {
			stockId,
			quantity,
			soldBy: user?._id,
			soldDate: new Date(),
		};

		setLoading(true);
		try {
			const res = await sellStock(stockData);
			if (res.success) {
				toast.success(res.message, { id: toastId });
			} else {
				toast.error(res.message, { id: toastId });
			}

			form.reset();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(error.message, { id: toastId });
		} finally {
			setLoading(false);
		}
	};

	const incrementQuantity = () => {
		const currentValue = parseInt(form.getValues("quantity")) || 0;
		if (currentValue < maxQuantity) {
			form.setValue("quantity", (currentValue + 1).toString());
		}
	};

	const decrementQuantity = () => {
		const currentValue = parseInt(form.getValues("quantity")) || 0;
		if (currentValue > 1) {
			form.setValue("quantity", (currentValue - 1).toString());
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="quantity"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Quantity to Sell</FormLabel>
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={decrementQuantity}
								>
									<Minus className="h-4 w-4" />
								</Button>
								<FormControl>
									<Input
										{...field}
										type="number"
										min="1"
										max={maxQuantity}
										className="text-center"
									/>
								</FormControl>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={incrementQuantity}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							<p className="text-sm text-muted-foreground">
								Available: {maxQuantity}
							</p>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? <ButtonLoader /> : "Confirm Sale"}
				</Button>
			</form>
		</Form>
	);
};

export default SellStockForm;
