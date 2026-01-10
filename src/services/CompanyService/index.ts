/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// Get all company
export const getAllCompany = async (query?: Record<string, unknown>) => {
	const queryString = new URLSearchParams(
		query as Record<string, string>,
	).toString();

	try {
		const res = await fetch(`${process.env.BASE_API}/company?${queryString}`, {
			next: {
				tags: ["companies"],
			},
			headers: {
				"Content-type": "application/json",
				Authorization: await getValidToken(),
			},
		});
		return await res.json();
	} catch (error: any) {
		return error;
	}
};

// Get single company
export const getSingleCompany = async (companyId: string) => {
	const token = await getValidToken();
	try {
		const res = await fetch(`${process.env.BASE_API}/company/${companyId}`, {
			next: {
				tags: ["company"],
			},
			headers: {
				Authorization: token,
			},
		});
		return await res.json();
	} catch (error: any) {
		return error;
	}
};

// Create company
export const createCompany = async (companyData: FieldValues): Promise<any> => {
	const token = await getValidToken();

	try {
		const res = await fetch(`${process.env.BASE_API}/company`, {
			method: "POST",
			body: JSON.stringify(companyData),
			headers: {
				"Content-type": "application/json",
				Authorization: token,
			},
		});

		revalidateTag("companies");

		return await res.json();
	} catch (error: any) {
		return error;
	}
};

// update company
export const updateCompany = async (
	companyId: string,
	companyData: FieldValues,
): Promise<any> => {
	const token = await getValidToken();

	try {
		const res = await fetch(`${process.env.BASE_API}/company/${companyId}`, {
			method: "PATCH",
			body: JSON.stringify(companyData),
			headers: {
				"Content-type": "application/json",
				Authorization: token,
			},
		});

		revalidateTag("companies");
		return await res.json();
	} catch (error: any) {
		return error;
	}
};

// Delete company
export const deleteCompany = async (companyId: string): Promise<any> => {
	const token = await getValidToken();

	try {
		const res = await fetch(`${process.env.BASE_API}/company/${companyId}`, {
			method: "DELETE",
			headers: {
				Authorization: token,
			},
		});

		revalidateTag("companies");
		return await res.json();
	} catch (error: any) {
		return error;
	}
};

export const getProductNamesByCompanyName = async (companyName: string) => {
	try {
		const res = await fetch(
			`${process.env.BASE_API}/company/${companyName}/products`,
			{
				next: {
					tags: ["company-products"],
				},
				headers: {
					"Content-type": "application/json",
					Authorization: await getValidToken(),
				},
			},
		);
		return await res.json();
	} catch (error: any) {
		return error;
	}
};
