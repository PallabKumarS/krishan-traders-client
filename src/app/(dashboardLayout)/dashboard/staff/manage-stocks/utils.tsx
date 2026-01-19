"use client";

export type StockTableRow = {
  companyId: string;
  companyName: string;

  productId: string;
  productName: string;

  sizeId: string;
  sizeLabel: string;
  unit: string;
  unitQuantity: number;

  totalQuantity: number;

  buyingPrice: number;
  sellingPrice: number;
};
