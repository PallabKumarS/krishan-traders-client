import { getAllCompany } from "@/services/CompanyService";
import { getAllStocks, getAllStocksByCompany } from "@/services/StockService";
import { getCompanyStatistics } from "@/services/StatisticsService";

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

export function getStocksPromise(companyId: string, refreshKey: number = 0) {
  return getCachedPromise(`stocks-${companyId}-${refreshKey}`, () => {
    if (companyId === "all") {
      return getAllStocks().then((res) => (res?.success ? res.data : []));
    }
    return getAllStocksByCompany(companyId).then((res) =>
      res?.success ? res.data : [],
    );
  });
}

export function getStatsPromise(companyId: string, refreshKey: number = 0) {
  return getCachedPromise(`stats-${companyId}-${refreshKey}`, () =>
    getCompanyStatistics(companyId).then((res) =>
      res?.success ? res.data : { totalProducts: 0, itemsSold: 0 },
    ),
  );
}

