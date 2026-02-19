import { model, models, Schema } from "mongoose";
import { ICustomer, TCustomer } from "./customer.interface";

const customerSchema = new Schema<TCustomer, ICustomer>(
  {
    name: { type: String },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    address: { type: String },
  },
  {
    timestamps: true,
  },
);
customerSchema.statics.isCustomerExists = async function (phone: string) {
  return await this.findOne({ phoneNumber: phone });
};

const CustomerModel = (models.Customer ||
  model<TCustomer, ICustomer>("Customer", customerSchema)) as ICustomer;

export default CustomerModel;
