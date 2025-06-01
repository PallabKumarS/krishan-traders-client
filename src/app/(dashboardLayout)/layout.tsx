import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import Footer from "@/components/shared/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider className="flex min-h-screen overflow-x-hidden">
      {/* Add overflow-x-hidden */}
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        {/* Add overflow-x-hidden */}
        <div className="flex items-center justify-between border-b px-4 py-2">
          <SidebarTrigger />
          <Link href="/">
            <Button variant={"link"} size={"sm"}>
              Main Store
            </Button>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex-1 p-4 min-h-screen overflow-x-hidden">
          {/* Add overflow-x-hidden */}
          {children}
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
