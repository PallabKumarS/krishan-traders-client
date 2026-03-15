import { getAllCustomers } from "@/services/CustomerService";
import { updateTag } from "next/cache";

export const getCustomersPromise = async (refreshKey?: number) => {
  const res = await getAllCustomers();
  return res.data || [];
};

export const clearCache = async () => {
  updateTag("customers");
};
