"use client";

import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Menu,
  X,
  Home,
  List,
  Info,
  PlusCircle,
  User,
  TextIcon,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const navItems = [
    { href: "/ideas", label: "All Ideas", icon: List },
    { href: "/about", label: "About", icon: Info },
    { href: "/blog", label: "Blog", icon: TextIcon },
  ];

  const handleLogout = () => {
    logout();

    if (config.matcher.some((route) => pathname.match(route))) {
      router.push("/login");
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 py-2 shadow-sm">
      <nav className="max-w-[90%] mx-auto px-4 flex items-center justify-center lg:justify-between gap-4 flex-wrap lg:flex-nowrap">
        {/* Logo with hover effect */}
        <div
          onClick={() => router.push("/")}
          className="flex-shrink-0 cursor-pointer group"
        >
          <h1 className="text-2xl font-black transition-all duration-300 group-hover:scale-105">
            <span className="text-gradient">Eco Sphere</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                flex items-center gap-2 
                text-muted-foreground 
                hover:text-primary 
                transition-colors 
                group
                px-3 py-2 
                rounded-full 
                hover:bg-accent/20
              "
            >
              <item.icon className="w-5 h-5 group-hover:rotate-6 transition-transform" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user?.email ? (
            <>
              {user?.role === "seller" && (
                <Link
                  href="/dashboard/member/manage-idea"
                  className="hidden sm:flex items-center gap-2 
                    bg-primary/10 text-primary 
                    hover:bg-primary/20 
                    px-3 py-2 
                    rounded-full 
                    transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  Post Idea
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="ring-2 ring-primary/30 hover:ring-primary/50 transition-all">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 backdrop-blur-sm bg-background/60"
                >
                  <DropdownMenuLabel className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    {user?.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/profile`}
                      className="cursor-pointer flex items-center gap-3"
                    >
                      <Home className="w-4 h-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive-foreground cursor-pointer flex items-center gap-3"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 text-destructive" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
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

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <AnimatePresence>
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="md:hidden border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    flex items-center gap-3 
                    text-muted-foreground 
                    hover:text-primary 
                    transition-colors 
                    py-2 
                    px-3 
                    rounded-full 
                    hover:bg-accent/20
                  "
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              {user?.role === "seller" && (
                <Link
                  href="/dashboard/member/manage-idea"
                  className="hidden sm:flex items-center gap-2 
                    bg-primary/10 text-primary 
                    hover:bg-primary/20 
                    px-3 py-2 
                    rounded-full 
                    transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  Post Idea
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </header>
  );
}
