"use client";

import { Button } from "../ui/button";
import { LogOut, Menu, X, Leaf, Store } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppContext } from "@/providers/ContextProvider";
import { config } from "@/middleware";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAppContext();

  const handleLogout = () => {
    logout();

    if (config.matcher.some((route) => pathname.match(route))) {
      router.push("/login");
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 py-2 shadow-sm">
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

        {user?.email && (
          <Link href="/dashboard/main-store">
            <Button className="flex" variant={"ghost"}>
              <Store className="w-4 h-4" /> Main Store
            </Button>
          </Link>
        )}

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

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden rounded-full transition-all duration-300 ease-in-out"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative">
              <X
                className={`absolute -translate-y-2 -translate-x-2 transition-all duration-300 ease-in-out ${
                  isMenuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-90 scale-0"
                }`}
              />
              <Menu
                className={`absolute -translate-y-2 -translate-x-2 transition-all duration-300 ease-in-out ${
                  isMenuOpen
                    ? "opacity-0 rotate-90 scale-0"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              />
            </div>
          </Button>
        </div>
      </nav>
    </header>
  );
}
