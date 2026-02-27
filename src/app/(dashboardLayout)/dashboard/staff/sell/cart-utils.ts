//cart-utils.ts

import { TStock } from "@/types";

export interface CartItem {
  stock: TStock;
  quantity: number;
  newSellingPrice: number;
}

const CART_KEY = "sell-cart";

export const loadCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};
