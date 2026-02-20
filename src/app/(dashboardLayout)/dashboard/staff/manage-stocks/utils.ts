/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { getAllCompany } from "@/services/CompanyService";
import { getAllStocksByCompany } from "@/services/StockService";

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

export function getStocksPromise(companyId: string, refreshKey: number = 0) {
  return getCachedPromise(`stocks-${companyId}-${refreshKey}`, () =>
    getAllStocksByCompany(companyId).then((res) =>
      res?.success ? res.data : [],
    ),
  );
}
