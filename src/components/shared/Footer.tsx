"use client";

import {
  ShoppingCart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  X,
  LightbulbIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
  ];

  const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: X, label: "Twitter" },
  ];

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mx-auto">
      <div className="max-w-[90%] flex flex-col px-4 py-16 mx-auto md:py-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mx-auto justify-center items-start">
          {/* Brand Section */}
          <div className="space-y-4 mx-auto text-center">
            <div
              onClick={() => {
                router.push("/");
              }}
              className="transition-transform hover:scale-105 flex items-center justify-center"
            >
              <LightbulbIcon className="mr-2 text-primary size-9" />
              <h1 className="text-2xl font-black">
                <span className="text-gradient">Eco Sphere</span>
              </h1>
            </div>
            <p className="text-muted-foreground">
              EcoSphere is a platform dedicated to promoting sustainable ideas
              and eco-friendly practices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 mx-auto text-center">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href} className="">
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary hover:underline decoration-primary decoration-2 underline-offset-4 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/dashboard/member/manage-idea"
                  className="text-muted-foreground hover:text-primary hover:underline decoration-primary decoration-2 underline-offset-4 transition-all"
                >
                  Add Your Idea
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 mx-auto text-center">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-muted-foreground group cursor-pointer justify-center">
                <Mail className="w-4 h-4 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary group-hover:underline decoration-primary decoration-2 underline-offset-4 transition-all">
                  contact@eco-sphere.com
                </span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground group cursor-pointer justify-center">
                <Phone className="w-4 h-4 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary group-hover:underline decoration-primary decoration-2 underline-offset-4 transition-all">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground group cursor-pointer justify-center">
                <MapPin className="w-4 h-4 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary group-hover:underline decoration-primary decoration-2 underline-offset-4 transition-all">
                  123 Green Lane, Eco City
                </span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4 mx-auto text-center">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4 text-center justify-center">
              {socialLinks.map(({ href, icon: Icon, label }, index) => (
                <Link
                  href={href}
                  key={index}
                  className="text-muted-foreground hover:text-primary hover:scale-110 transition-all"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
            <div className="mt-4 flex justify-center items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Secure Shopping
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t">
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Eco Sphere. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
