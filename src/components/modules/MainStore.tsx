/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";
import {
  BookOpenTextIcon,
  ColumnsSettings,
  FileBarChart,
  FileClock,
  FileSearch,
  HandCoinsIcon,
  Store,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useAppContext } from "@/providers/ContextProvider";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getStoreStatistics } from "@/services/StatisticsService";
import LoadingData from "@/components/shared/LoadingData";

export const commonRoutes = [
  {
    title: "Main Store",
    icon: Store,
    href: "/",
  },
];

// admin routes
export const adminRoutes = [
  {
    title: "Records",
    icon: FileSearch,
    href: "/dashboard/admin/manage-records",
  },
  {
    title: "Users",
    icon: Users,
    href: "/dashboard/admin/manage-members",
  },
  {
    title: "Manage Info",
    icon: BookOpenTextIcon,
    href: "/dashboard/admin/manage-info",
  },
  {
    title: "Account & Transactions",
    icon: FileBarChart,
    href: "/dashboard/admin/account",
  },
  {
    title: "All Sales",
    icon: ShoppingBag,
    href: "/dashboard/admin/all-sales",
  },
];

// member routes
export const staffRoutes = [
  {
    title: "Stocks",
    icon: ColumnsSettings,
    href: "/dashboard/staff/manage-stocks",
  },
  {
    title: "Sell",
    icon: HandCoinsIcon,
    href: "/dashboard/staff/sell",
  },
];

// sub admin routes
export const subAdminRoutes = [
  ...staffRoutes,
  {
    title: "Transactions",
    icon: FileSearch,
    href: "/dashboard/admin/manage-transactions",
  },
  {
    title: "Pending Stocks",
    icon: FileClock,
    href: "/dashboard/admin/pending-stocks",
  },
];

const RouteCard = ({
  title,
  icon: Icon,
  href,
  index,
}: {
  title: string;
  icon: any;
  href: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={href}>
        <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
          <div className="flex flex-col items-center space-y-3">
            <div className="rounded-full bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20">
              <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
          </div>
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>
    </motion.div>
  );
};

const MainStore = () => {
  const { user } = useAppContext();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getStoreStatistics();
      if (res.success) {
        setStats(res.data);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Filter routes based on user role
  const getRoutesForUser = () => {
    if (user?.role === "admin") return [...staffRoutes, ...adminRoutes];
    if (user?.role === "staff") return [...staffRoutes];
    if (user?.role === "subAdmin") return [...subAdminRoutes];
    return [];
  };

  const userRoutes = getRoutesForUser();

  if (loading) return <LoadingData />;

  const maxProfit = stats?.dailyProfitsChart?.length > 0 
    ? Math.max(...stats.dailyProfitsChart.map((d: any) => d.profit), 100)
    : 100;

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Store Dashboard
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            Welcome back, <span className="text-primary font-medium">{user?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Inventory Value</span>
              <span className="text-lg font-bold font-mono">৳{stats?.totalStockValue?.toLocaleString()}</span>
           </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Today's Profit", 
            value: stats?.todayProfit, 
            subValue: `${stats?.todaySalesCount || 0} Sales`,
            icon: DollarSign, 
            color: "text-green-500", 
            bg: "bg-green-500/10" 
          },
          { 
            label: "This Month", 
            value: stats?.thisMonthProfit, 
            icon: TrendingUp, 
            color: "text-primary", 
            bg: "bg-primary/10" 
          },
          // { 
          //   label: "Inventory Value", 
          //   value: stats?.totalStockValue, 
          //   icon: Package, 
          //   color: "text-blue-500", 
          //   bg: "bg-blue-500/10" 
          // },
          { 
            label: "All Time Profit", 
            value: stats?.allTimeProfit, 
            icon: HandCoinsIcon, 
            color: "text-orange-500", 
            bg: "bg-orange-500/10" 
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl border bg-card p-6 shadow-xs hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color} group-hover:scale-110 transition-transform`} />
              </div>
              {item.subValue && (
                 <span className="text-[10px] font-bold px-2 py-1 rounded bg-muted text-muted-foreground uppercase">{item.subValue}</span>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-muted-foreground text-sm font-medium">{item.label}</h3>
              <div className="text-3xl font-bold font-mono tracking-tighter">
                ৳{(item.value || 0).toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global Alerts Section (Only if needed) */}
      {(stats?.lowStockCount > 0 || stats?.expiringSoonCount > 0) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {stats.lowStockCount > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-destructive/20 p-2 rounded-lg">
                   <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
                <div>
                   <p className="font-bold text-destructive">Low Stock Alert</p>
                   <p className="text-xs text-muted-foreground">{stats.lowStockCount} items are running low on stock</p>
                </div>
              </div>
              <Link href="/dashboard/staff/manage-stocks" className="text-xs font-bold underline text-destructive hover:opacity-80">View Items</Link>
            </div>
          )}
          {stats.expiringSoonCount > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/20 p-2 rounded-lg">
                   <FileClock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                   <p className="font-bold text-orange-600">Expiration Warning</p>
                   <p className="text-xs text-muted-foreground">{stats.expiringSoonCount} items are expiring within 30 days</p>
                </div>
              </div>
              <Link href="/dashboard/staff/manage-stocks" className="text-xs font-bold underline text-orange-600 hover:opacity-80">Check Expiry</Link>
            </div>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Performance Chart */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-xs h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Daily Performance
            </h3>
            <div className="flex items-center gap-4 text-xs">
               <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-primary" /> Profit</span>
               <span className="text-muted-foreground italic">Last 7 Days</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-end gap-3 px-2 pb-8">
            {stats?.dailyProfitsChart?.length > 0 ? (
              stats.dailyProfitsChart.map((data: any, i: number) => {
                const height = maxProfit > 0 ? (data.profit / maxProfit) * 100 : 0;
                return (
                  <div key={data.date} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                    <div className="w-full relative flex flex-col items-center justify-end h-full">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background border rounded px-2 py-1 text-[10px] font-bold z-10 whitespace-nowrap shadow-md">
                        ৳{data.profit.toLocaleString()}
                      </div>
                      {/* Bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(height, 2)}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                        className={`w-full rounded-t-lg transition-all duration-300 ${data.profit > 0 ? "bg-primary group-hover:bg-primary/80" : "bg-muted"}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{data.day}</span>
                  </div>
                )
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm italic">
                 No sales data available for the last 7 days
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Routes */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <HandCoinsIcon className="h-5 w-5 text-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {userRoutes.map((route, index) => (
              <RouteCard
                key={route.href}
                title={route.title as string}
                icon={route.icon}
                href={route.href}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {userRoutes.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed bg-muted/20">
          <p className="text-muted-foreground">
            {!user ? "Please log in to access your dashboard" : "Contact admin for access permissions"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MainStore;
