"use client";

import {
  Building2,
  ColumnsSettings,
  FileClock,
  FilePlus,
  FileSearch,
  LucideBoxes,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useAppContext } from "@/providers/ContextProvider";
import { Modal } from "../shared/Modal";
import StockAddForm from "../forms/StockAddForm";

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
    title: "Transactions",
    icon: FileSearch,
    href: "/dashboard/admin/manage-transactions",
  },
  {
    title: "Pending Stocks",
    icon: FileClock,
    href: "/dashboard/admin/pending-stocks",
  },
  {
    title: "Company",
    icon: Building2,
    href: "/dashboard/admin/manage-company",
  },
  {
    title: "Users",
    icon: Users,
    href: "/dashboard/admin/manage-members",
  },
  {
    title: "Sizes",
    icon: LucideBoxes,
    href: "/dashboard/admin/manage-sizes",
  },
];

// member routes
export const staffRoutes = [
  {
    title: "Stocks",
    icon: ColumnsSettings,
    href: "/dashboard/staff/manage-stocks",
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
}: {
  title: string;
  // biome-ignore lint/suspicious/noExplicitAny: <>
  icon: any;
  href: string;
}) => {
  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/50">
        <div className="flex flex-col items-center space-y-3">
          <div className="rounded-full bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20">
            <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
          <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </Link>
  );
};

const MainStore = () => {
  const { user } = useAppContext();

  // Filter routes based on user role
  const getRoutesForUser = () => {
    let routes: typeof commonRoutes = [];

    if (user?.role === "admin") {
      // Admin can see all routes
      routes = [...staffRoutes, ...adminRoutes];
    } else if (user?.role === "staff") {
      // Staff can only see staff routes
      routes = [...staffRoutes];
    } else if (user?.role === "subAdmin") {
      // routes for sub admin
      routes = [...subAdminRoutes];
    }
    return routes;
  };

  const userRoutes = getRoutesForUser();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Main Store</h1>
        <p className="text-muted-foreground">
          Navigate to different sections
          {user && (
            <span className="block text-sm text-primary mt-1">
              Welcome, {user.name} ({user.role})
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {userRoutes.map((route, index) => (
          <div
            key={route.href}
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "both",
            }}
          >
            <RouteCard
              title={route.title}
              icon={route.icon}
              href={route.href}
            />
          </div>
        ))}

        {/* extra add stock for staff */}
        <div
          className="animate-in fade-in-0 slide-in-from-bottom-4"
          style={{
            animationDelay: `${200}ms`,
            animationFillMode: "both",
          }}
        >
          {user?.role === "staff" && (
            <Modal
              title="Add Stock"
              trigger={
                <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/50">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="rounded-full bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20">
                      <FilePlus className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                      Add Stock
                    </h3>
                  </div>
                  <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              }
              content={<StockAddForm />}
            />
          )}
        </div>
      </div>

      {userRoutes.length === 1 && (
        <div className="text-center text-muted-foreground text-sm mt-8">
          {!user ? (
            <p>Please log in to access more features</p>
          ) : (
            <p>Contact admin for additional access permissions</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MainStore;
