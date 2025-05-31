"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ToggleButton = ({
  checked,
  onCheckedChange,
  disabled = false,
  size = "md",
  className,
}: AnimatedToggleProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (disabled || isAnimating) return;

    setIsAnimating(true);
    onCheckedChange(!checked);

    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 200);
  };

  const sizeClasses = {
    sm: {
      container: "w-8 h-4",
      thumb: "w-3 h-3",
      translate: "translate-x-4",
    },
    md: {
      container: "w-11 h-6",
      thumb: "w-5 h-5",
      translate: "translate-x-5",
    },
    lg: {
      container: "w-14 h-7",
      thumb: "w-6 h-6",
      translate: "translate-x-7",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleToggle}
      disabled={disabled}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50",
        currentSize.container,
        checked
          ? "bg-green-500 hover:bg-green-600"
          : "bg-red-500 hover:bg-red-600",
        disabled && "hover:bg-current",
        className
      )}
    >
      <span className="sr-only">Toggle status</span>
      <span
        className={cn(
          "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-all duration-200 ease-in-out",
          currentSize.thumb,
          checked ? currentSize.translate : "translate-x-0",
          isAnimating && "scale-110"
        )}
      >
        {/* Optional icons inside the thumb */}
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
            checked ? "opacity-0" : "opacity-100"
          )}
        >
          <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 12 12">
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
            checked ? "opacity-100" : "opacity-0"
          )}
        >
          <svg
            className="w-3 h-3 text-green-500"
            fill="none"
            viewBox="0 0 12 12"
          >
            <path
              d="M9 3l-5 5-2-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </button>
  );
};

export default ToggleButton;
