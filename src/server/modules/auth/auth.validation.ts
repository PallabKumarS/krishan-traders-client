import { z } from "zod";

const loginValidationSchema = z.object({
	body: z.object({
		email: z.string({ required_error: "Id is required." }),
		password: z.string({ required_error: "Password is required" }),
	}),
});

const changePasswordValidationSchema = z.object({
	body: z.object({
		oldPassword: z.string({
			required_error: "Old password is required",
		}),
		newPassword: z.string({ required_error: "Password is required" }),
	}),
});

const forgotPasswordValidationSchema = z.object({
	body: z.object({
		email: z.string({ required_error: "Email is required" }),
	}),
});

const resetPasswordValidationSchema = z.object({
	body: z.object({
		password: z.string({ required_error: "Password is required" }),
		email: z.string({ required_error: "Email is required" }),
		code: z.number({ required_error: "Code is required" }),
	}),
});

export const AuthValidation = {
	loginValidationSchema,
	changePasswordValidationSchema,
	forgotPasswordValidationSchema,
	resetPasswordValidationSchema,
};
