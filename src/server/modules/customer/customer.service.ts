import CustomerModel from "./customer.model";
import { TCustomer } from "./customer.interface";

const createCustomer = async (payload: TCustomer) => {
  const exists = await CustomerModel.isCustomerExists(payload.phoneNumber);

  if (exists) {
    throw new Error("Customer already exists with this phone number");
  }

  return await CustomerModel.create(payload);
};

const getAllCustomers = async () => {
  return await CustomerModel.find().sort({ createdAt: -1 });
};

const getCustomer = async (id: string) => {
  return await CustomerModel.findById(id);
};

const updateCustomer = async (id: string, payload: Partial<TCustomer>) => {
  return await CustomerModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const deleteCustomer = async (id: string) => {
  return await CustomerModel.findByIdAndDelete(id);
};

export const CustomerService = {
  createCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
