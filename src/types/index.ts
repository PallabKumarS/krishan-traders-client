export * from "./user.types";
export * from "./record.types";
export * from "./stock.types";
export * from "./company.types";
export * from "./size.types";
export * from "./product.types";

export type TMeta = {
  page: number;
  limit: number;
  totalPage: number;
  totalData: number;
};

export type Response<T> = {
  data: T;
  meta?: TMeta;
};

export type ErrorResponse = {
  message: string;
  statusCode: number;
  errorSources: { path: string; message: string }[];
};
