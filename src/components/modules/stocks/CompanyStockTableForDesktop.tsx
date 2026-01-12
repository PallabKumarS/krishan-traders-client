"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TStock } from "@/types";
import StockDataTableForDesktop from "./StockDataTableForDesktop";
import { cn } from "@/lib/utils";

export default function CompanyStockTableForDesktop({
  company,
  stocks,
}: {
  company: string;
  stocks: TStock[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Company Header */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3",
          "hover:bg-muted/40 transition-colors",
          "border-l-4 border-primary"
        )}
      >
        <div>
          <h2 className="text-lg font-semibold">{company}</h2>
          <p className="text-sm text-muted-foreground">
            {stocks.length} stock items
          </p>
        </div>

        {open ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {/* Collapsible Content */}
      {open && (
        <div className="max-h-[70vh] overflow-auto">
          <StockDataTableForDesktop data={stocks} />
        </div>
      )}
    </div>
  );
}
