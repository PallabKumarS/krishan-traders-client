"use client";

import {
  LogOut,
  Users,
  LogIn,
  HomeIcon,
  FileSearch,
  ChevronRight,
  ChevronDown,
  UserCheck,
  UserLockIcon,
  Settings2Icon,
  ColumnsSettings,
  Leaf,
  Store,
  Building2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/providers/ContextProvider";
import { config } from "@/middleware";
import Link from "next/link";

// common routes for all users
const items = [
  {
    title: "Home",
    icon: HomeIcon,
    href: "/",
  },
  {
    title: "Main Store",
    icon: Store,
    href: `/dashboard/main-store`,
  },
];

// admin routes
const adminRoutes = [
  {
    title: "Users",
    icon: Users,
    href: "/dashboard/admin/manage-members",
  },
  {
    title: "Transactions",
    icon: FileSearch,
    href: "/dashboard/admin/manage-transactions",
  },
  {
    title: "Company",
    icon: Building2,
    href: "/dashboard/admin/manage-company",
  },
];

// member routes
const staffRoutes = [
  {
    title: "Stocks",
    icon: ColumnsSettings,
    href: "/dashboard/staff/manage-stocks",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAppContext();

  const handleLogout = () => {
    logout();

    if (config.matcher.some((route) => pathname.match(route))) {
      router.push("/login");
    }
  };

  const renderMenuItems = (routes: typeof items) => (
    <SidebarMenu>
      {routes.map((item) => (
        <SidebarMenuItem
          key={item.title}
          className={`
            group 
            hover:bg-accent/10 
            transition-colors 
            duration-200 
            ${pathname === item.href ? "bg-primary/10 text-primary" : ""}
          `}
        >
          <SidebarMenuButton asChild>
            <a href={item.href} className="flex items-center gap-3 w-full">
              <item.icon
                className={`
                  w-5 h-5 
                  group-hover:rotate-6 
                  transition-transform
                  ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                `}
              />
              <span className="flex-grow">{item.title}</span>
              <ChevronRight
                className="
                  w-4 h-4 
                  opacity-0 
                  group-hover:opacity-100 
                  transition-opacity
                  text-muted-foreground
                "
              />
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar className="h-full" collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="logo">
                <SidebarMenuButton asChild className="h-20">
                  <Link
                    href="/"
                    className="flex items-center gap-3 hover:scale-105 transition-transform"
                  >
                    <Leaf
                      className="text-primary h-10 w-10"
                      fontSize={20}
                      size={20}
                    />
                    <span
                      className="text-gradient"
                      style={{ fontSize: "26px" }}
                    >
                      Krishan <br /> Traders
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Panel */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Settings2Icon className="w-4 h-4 text-muted-foreground" />
            Quick Access
          </SidebarGroupLabel>
          <SidebarGroupContent>{renderMenuItems(items)}</SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Panel */}
        {user?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <UserLockIcon className="w-4 h-4 text-muted-foreground" />
              Admin Panel
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {renderMenuItems(adminRoutes)}
              {renderMenuItems(staffRoutes)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Member Panel */}
        {user?.role === "staff" && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-muted-foreground" />
              Staff
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {renderMenuItems(staffRoutes)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Logout */}
        <div className="mt-auto border-t p-4 pl-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="
                  flex w-full items-center gap-3 
                  rounded-lg p-2 
                  hover:bg-accent/10 
                  transition-colors 
                  group
                "
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                  {user?.profileImg ? (
                    <AvatarImage src={user?.profileImg} alt={user?.name} />
                  ) : (
                    <AvatarImage src="https://github.com/shadcn.png" />
                  )}
                  <AvatarFallback>LK</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.email}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:rotate-180 transition-transform" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" side="top">
              {user?.email ? (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive-foreground cursor-pointer flex items-center gap-3"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-primary focus:text-primary-foreground cursor-pointer flex items-center gap-3"
                  onClick={() => router.push("/login")}
                >
                  <LogIn className="w-4 h-4" /> Login
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
