
import { getAllCompany } from "@/services/CompanyService";
import { getAllProducts, getAllProductsByCompany } from "@/services/ProductService";
import { getAllSizes } from "@/services/SizeService";
import { TProduct, TSize } from "@/types";

// biome-ignore lint/suspicious/noExplicitAny: <>
const promiseCache = new Map<string, Promise<any>>();

export function getCachedPromise<T>(
  key: string,
  promiseFactory: () => Promise<T>,
): Promise<T> {
  if (!promiseCache.has(key)) {
    promiseCache.set(key, promiseFactory());
  }
  return promiseCache.get(key) as Promise<T>;
}

export function clearCache() {
  promiseCache.clear();
}

export function getCompaniesPromise(refreshKey: number = 0) {
  return getCachedPromise(`companies-${refreshKey}`, () =>
    getAllCompany().then((res) => (res?.success ? res.data : [])),
  );
}

export function getProductsPromise(companyId: string, refreshKey: number = 0) {
  return getCachedPromise(`products-${companyId}-${refreshKey}`, () => {
    if (companyId === "all") {
      return getAllProducts().then((res) => (res?.success ? res.data : []));
    }
    return getAllProductsByCompany(companyId).then((res) =>
      res?.success ? res.data : [],
    );
  });
}

export function getSizesPromise(refreshKey: number = 0) {
  return getCachedPromise(`sizes-${refreshKey}`, () =>
    getAllSizes().then((res) => (res?.success ? res.data : [])),
  );
}

export type SizeTableData = TSize & {
  product: {
    name: string;
    company: {
      name: string;
    };
  };
};

export const createEmptySize = (product: TProduct): TSize => ({
  _id: `empty`,
  product: {
    ...product,
    _id: product._id,
  },
  label: "",
  unit: "kg",
  unitQuantity: 0,
  stackCount: 0,
  buyingPrice: 0,
  sellingPrice: 0,
  isActive: false,

  createdAt: "",
  updatedAt: "",
  __v: 0,
});
