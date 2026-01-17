import { TMongoose, TProduct, TSize } from "@/types";

export type SizeTableData = TSize &
  TMongoose & {
    product: {
      name: string;
      company: {
        name: string;
      };
    };
  };

export const createEmptySize = (
  product: TProduct & TMongoose
): TSize & TMongoose => ({
  _id: `empty`,
  product: {
    ...product,
    _id: product._id,
  },
  label: "",
  unit: "kg",
  unitQuantity: 0,
  stackCount: 0,
  isActive: false,

  createdAt: "",
  updatedAt: "",
  __v: 0,
});
