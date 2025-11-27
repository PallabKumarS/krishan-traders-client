"use client";

import { Button } from "../ui/button";
import { LogOut, Leaf } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/providers/ContextProvider";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAppContext();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-30 py-2 shadow-sm">
      <nav className="max-w-[90%] min-h-[10vh] md:min-h-[7vh] mx-auto px-4 md:flex items-center justify-between gap-4">
        {/* Logo with hover effect */}
        <div
          onClick={() => {
            router.push("/");
          }}
          className="transition-transform hover:scale-105 flex items-center justify-center gap-1"
        >
          <Leaf className="text-primary size-9" />
          <h1 className="">
            <span className="text-gradient text-2xl font-bold">
              Krishan Traders
            </span>
          </h1>
        </div>

        {/* Actions */}
        <div className="flex justify-center items-center gap-3">
          {user?.email ? (
            <Button
              variant={"destructive"}
              size={"sm"}
              className="hover:text-destructive-foreground cursor-pointer flex items-center gap-3"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="rounded-full">
                Login
              </Button>
            </Link>
          )}

          <ThemeToggle />
          <Link href={"/cart"}></Link>
        </div>
      </nav>
    </header>
  );
}
