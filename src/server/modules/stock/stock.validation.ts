import { z } from "zod";

const createStockValidation = z.object({
	body: z.object({
		companyName: z.string({
			required_error: "Name is required",
		}),
		productName: z.string({
			required_error: "Name is required",
		}),
		size: z.string({
			required_error: "Size is required",
		}),
		quantity: z.number({
			required_error: "Quantity is required",
		}),
		stockingDate: z.string({
			required_error: "Stocking date is required",
		}),
		expiryDate: z.string({
			required_error: "Expiry date is required",
		}),
	}),
});

const updateStockValidation = createStockValidation.partial();

export const StockValidation = {
	createStockValidation,
	updateStockValidation,
};
