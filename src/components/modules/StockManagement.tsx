"use client";

import { useEffect, useState } from "react";
import StockAddForm from "../forms/StockAddForm";
import { useAppContext } from "@/providers/ContextProvider";
import { getAllStocks } from "@/services/StockService";
import { TMeta, TStock } from "@/types";
import LoadingData from "../shared/LoadingData";
import { Modal } from "../shared/Modal";
import { Button } from "../ui/button";
import {
  Package,
  ChevronDown,
  ChevronRight,
  Building2,
  Box,
} from "lucide-react";
import { PaginationComponent } from "../shared/PaginationComponent";
import StockCard from "./StockCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

type StatusType = "" | "rejected" | "expired" | "accepted" | "sold";

interface GroupedStock {
  [company: string]: {
    [productName: string]: TStock[];
  };
}

const StockManagement = ({ query }: { query: Record<string, unknown> }) => {
  const [isFetching, setIsFetching] = useState(true);
  const [stockData, setStockData] = useState<TStock[]>([]);
  const [meta, setMeta] = useState<TMeta>();
  const [activeStatus, setActiveStatus] = useState<StatusType>("accepted");
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(
    new Set()
  );
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(
    new Set()
  );
  const { user } = useAppContext();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await getAllStocks({
          ...query,
          status: activeStatus,
          sort: "expiryDate",
        });

        if (res.success) {
          setStockData(res.data);
          setMeta(res.meta);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchStocks();
  }, [query, activeStatus]);

  const handleTabChange = (value: string) => {
    setActiveStatus(value as StatusType);
  };

  const toggleCompany = (company: string) => {
    const newExpanded = new Set(expandedCompanies);
    if (newExpanded.has(company)) {
      newExpanded.delete(company);
    } else {
      newExpanded.add(company);
    }
    setExpandedCompanies(newExpanded);
  };

  const toggleProduct = (productKey: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productKey)) {
      newExpanded.delete(productKey);
    } else {
      newExpanded.add(productKey);
    }
    setExpandedProducts(newExpanded);
  };

  const groupStocksByCompanyAndProduct = (stocks: TStock[]): GroupedStock => {
    return stocks.reduce((acc, stock) => {
      const company = stock.companyName || "Unknown Company";
      const productName = stock.productName || "Unknown Product";

      if (!acc[company]) {
        acc[company] = {};
      }

      if (!acc[company][productName]) {
        acc[company][productName] = [];
      }

      acc[company][productName].push(stock);
      return acc;
    }, {} as GroupedStock);
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Stock</h1>
        <Modal
          title="Add Stock"
          trigger={<Button variant="secondary">Add Stock</Button>}
          content={<StockAddForm />}
        />
      </div>

      <p className="text-muted-foreground mb-8">
        View, manage, and sell your inventory of fertilizers and agricultural
        products.
      </p>

      {user?.role === "admin" && (
        <Tabs
          defaultValue="accepted"
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="overflow-x-auto pb-2 mx-auto">
            <TabsList className="w-full">
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
              <TabsTrigger value="sold">Sold</TabsTrigger>
              <TabsTrigger value="">All</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="accepted" className="mt-4">
            {renderRecordsList()}
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            {renderRecordsList()}
          </TabsContent>
          <TabsContent value="expired" className="mt-4">
            {renderRecordsList()}
          </TabsContent>
          <TabsContent value="sold" className="mt-4">
            {renderRecordsList()}
          </TabsContent>
          <TabsContent value="" className="mt-4">
            {renderRecordsList()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );

  function renderRecordsList() {
    if (isFetching) return <LoadingData />;

    if (stockData.length === 0) {
      return (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Stock Available</h3>
          <p className="text-muted-foreground mb-4">
            You don&apos;t have any stock items in your inventory yet.
          </p>
          <Modal
            title="Add Stock"
            trigger={<Button>Add Your First Stock</Button>}
            content={<StockAddForm />}
          />
        </div>
      );
    }

    const groupedStocks = groupStocksByCompanyAndProduct(stockData);

    return (
      <div className="space-y-4 mb-10">
        {/* company render logic and sorting logic  */}
        {Object.entries(groupedStocks)
          .sort((a, b) => {
            const aCompany = a[0];
            const bCompany = b[0];
            return aCompany.localeCompare(bCompany);
          })
          .map(([company, products]) => (
            <div key={company} className="border rounded-lg bg-card">
              {/* Company Header */}
              <Collapsible
                open={expandedCompanies.has(company)}
                onOpenChange={() => toggleCompany(company)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-left">
                        {company}
                      </h3>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                        {Object.values(products).reduce(
                          (total, stocks) => total + stocks.length,
                          0
                        )}
                        items
                      </span>
                    </div>
                    {expandedCompanies.has(company) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>
                </CollapsibleTrigger>

                {/* all stock products rendering logic  */}
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3">
                    {Object.entries(products).map(([productName, stocks]) => {
                      const productKey = `${company}-${productName}`;
                      return (
                        <div
                          key={productKey}
                          className="border rounded-md bg-muted/20"
                        >
                          {/* Product Header */}
                          <Collapsible
                            open={expandedProducts.has(productKey)}
                            onOpenChange={() => toggleProduct(productKey)}
                          >
                            <CollapsibleTrigger className="w-full">
                              <div className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-3">
                                  <Box className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-medium text-left">
                                    {productName}
                                  </h4>
                                  <p className="flex gap-3 flex-wrap">
                                    {stocks.map((stock) => {
                                      return (
                                        <span
                                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                                          key={stock._id}
                                        >
                                          {stock.size} : {stock.quantity}
                                        </span>
                                      );
                                    })}
                                  </p>
                                </div>
                                {expandedProducts.has(productKey) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </div>
                            </CollapsibleTrigger>

                            {/* stock details rendering logic */}
                            <CollapsibleContent>
                              <div className="px-3 pb-3">
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-3">
                                  {stocks.map((stock) => (
                                    <StockCard key={stock._id} stock={stock} />
                                  ))}
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}

        {meta && meta.totalPage > 0 && <PaginationComponent meta={meta} />}
      </div>
    );
  }
};

export default StockManagement;
