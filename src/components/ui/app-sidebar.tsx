"use client";

import {
  LogOut,
  LogIn,
  ChevronRight,
  ChevronDown,
  UserCheck,
  UserLockIcon,
  Settings2Icon,
  Leaf,
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
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/providers/ContextProvider";
import { config } from "@/middleware";
import Link from "next/link";
import { adminRoutes, commonRoutes, staffRoutes } from "../modules/MainStore";

// common routes for all users

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAppContext();

  const handleLogout = () => {
    logout();

    if (config.matcher.some((route) => pathname.match(route))) {
      router.push("/login");
    }
  };

  const renderMenuItems = (routes: typeof commonRoutes) => (
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

  const renderSkeletonMenuItems = (count: number) => (
    <SidebarMenu>
      {Array.from({ length: count }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton>
            <div className="flex items-center gap-3 w-full">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-4 flex-grow" />
            </div>
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
          <SidebarGroupContent>
            {isLoading
              ? renderSkeletonMenuItems(2)
              : renderMenuItems(commonRoutes)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Panel */}
        {isLoading ? (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-20" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {renderSkeletonMenuItems(4)}
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          user?.role === "admin" && (
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <UserLockIcon className="w-4 h-4 text-muted-foreground" />
                Admin Panel
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {renderMenuItems(staffRoutes)}
                {renderMenuItems(adminRoutes)}
              </SidebarGroupContent>
            </SidebarGroup>
          )
        )}

        {/* Member Panel */}
        {isLoading
          ? null
          : user?.role === "staff" && (
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
          {isLoading ? (
            <div className="flex w-full items-center gap-3 rounded-lg p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          ) : (
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
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
