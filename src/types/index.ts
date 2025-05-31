export * from "./user.types";
export * from "./record.types";
export * from "./stock.types";
export * from "./company.types";
export * from "./size.types";

export type TMeta = {
  page: number;
  limit: number;
  totalPage: number;
  totalData: number;
};

export type TMongoose = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
