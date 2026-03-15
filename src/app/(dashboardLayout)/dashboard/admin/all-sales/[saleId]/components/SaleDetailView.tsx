"use client";

import { use } from "react";
import { TSell } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Printer, User, Calendar, Hash, CreditCard } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface SaleDetailViewProps {
  salePromise: Promise<{ data: TSell; success: boolean }>;
}

export default function SaleDetailView({ salePromise }: SaleDetailViewProps) {
  const res = use(salePromise);
  const sale = res?.data;

  if (!sale) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-xl font-bold">Sale not found</h2>
        <p className="text-muted-foreground mt-2">The requested sale transaction could not be located.</p>
        <Link href="/dashboard/admin/all-sales" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Sales
          </Button>
        </Link>
      </div>
    );
  }

  const soldTo = typeof sale.soldTo === "string" ? { name: sale.soldTo, phoneNumber: "N/A" } : sale.soldTo;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/admin/all-sales">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Sales
          </Button>
        </Link>
        <Link href={`/dashboard/staff/invoice/sell/${sale._id}`}>
          <Button className="gap-2">
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sale Info */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
               <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  Sale Transaction
               </CardTitle>
               <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  {sale._id}
               </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
             {/* Info Grid */}
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> Date & Time
                   </p>
                   <p className="text-sm font-medium">
                      {format(new Date(sale.createdAt), "PPP p")}
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Sold By
                   </p>
                   <p className="text-sm font-medium">{sale.soldBy?.name || "N/A"}</p>
                </div>
             </div>

             <Separator />

             {/* Items Table */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2">Items Sold</h4>
                <div className="rounded-lg border overflow-hidden">
                   <table className="w-full text-sm">
                      <thead className="bg-muted text-muted-foreground text-[10px] uppercase font-bold">
                         <tr>
                            <th className="px-4 py-2 text-left">Item</th>
                            <th className="px-4 py-2 text-right">Qty</th>
                            <th className="px-4 py-2 text-right">Price</th>
                            <th className="px-4 py-2 text-right">Total</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y">
                         {/** biome-ignore lint/suspicious/noExplicitAny: <> */}
                         {sale.stocks.map((item: any, idx: number) => (
                            <tr key={idx} className="hover:bg-muted/30 transition-colors">
                               <td className="px-4 py-3">
                                  <div className="flex flex-col">
                                     <span className="font-medium text-xs">{item.stock?.size?.product?.name || "Product"}</span>
                                     <Badge variant="outline" className="w-fit text-[9px] h-4 mt-1">
                                        {item.stock?.size?.label || "-"}
                                     </Badge>
                                  </div>
                               </td>
                               <td className="px-4 py-3 text-right tabular-nums">{item.quantity}</td>
                               <td className="px-4 py-3 text-right tabular-nums">৳{item.sellingPrice.toLocaleString()}</td>
                               <td className="px-4 py-3 text-right font-bold tabular-nums">৳{(item.quantity * item.sellingPrice).toLocaleString()}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Customer & Summary */}
        <div className="space-y-6">
           <Card>
              <CardHeader className="pb-3 border-b">
                 <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                    Customer Details
                 </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Name</p>
                    <p className="text-sm font-medium">{soldTo.name || "Walk-in Customer"}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Phone</p>
                    <p className="text-sm font-medium">{soldTo.phoneNumber}</p>
                 </div>
                 {typeof sale.soldTo === "object" && (
                    <>
                       {sale.soldTo.email && (
                          <div className="space-y-1">
                             <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Email</p>
                             <p className="text-sm font-medium break-all">{sale.soldTo.email}</p>
                          </div>
                       )}
                       {sale.soldTo.address && (
                          <div className="space-y-1">
                             <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Address</p>
                             <p className="text-xs">{sale.soldTo.address}</p>
                          </div>
                       )}
                    </>
                 )}
              </CardContent>
           </Card>

           <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3 border-b border-primary/10">
                 <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest text-primary">
                    Summary
                 </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">৳{sale.totalAmount.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-bold text-primary text-xl">৳{sale.totalAmount.toLocaleString()}</span>
                 </div>
                 <Separator className="bg-primary/10" />
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1 text-[10px] uppercase font-bold">
                       <CreditCard className="h-3 w-3" /> Transaction Profit
                    </span>
                    <span className="text-green-600 font-bold">৳{sale.totalProfit.toLocaleString()}</span>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
