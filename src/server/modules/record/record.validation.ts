import { z } from "zod";

const createRecordValidation = z.object({
	body: z.object({
		name: z.string({
			required_error: "Name is required",
		}),
	}),
});

const updateRecordValidation = createRecordValidation.partial();

export const RecordValidation = {
	createRecordValidation,
	updateRecordValidation,
};
