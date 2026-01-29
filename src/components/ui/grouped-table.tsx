/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

interface GroupedTableProps {
  data: any[];
  columns: Column[];
  groupBy: string;
  searchKeys: string[];
  enableColumnToggle?: boolean;
}

export function GroupedTable({
  data,
  columns,
  groupBy,
  searchKeys = [],
  enableColumnToggle = false,
}: GroupedTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((col) => col.key)),
  );

  // Get nested value
  const getValue = (obj: any, path: string) => {
    return path.split(".").reduce((o, i) => o && o[i], obj);
  };

  // Process data
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  // biome-ignore lint/correctness/noUnusedVariables: <>
  const { groups, allRows } = useMemo(() => {
    // Filter data
    let filteredData = [...data];
    if (searchKeys?.length > 0 && searchTerm) {
      filteredData = data.filter((item) => {
        // Check if any of the search keys contain the search term
        return searchKeys?.some((key) => {
          const value = getValue(item, key);
          return String(value || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
      });
    }

    // Sort data
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = getValue(a, sortConfig.key!);
        const bValue = getValue(b, sortConfig.key!);

        const aStr = String(aValue || "").toLowerCase();
        const bStr = String(bValue || "").toLowerCase();

        const comparison = aStr.localeCompare(bStr);
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    // Group data
    const groupsMap = new Map();
    const allRowsList: any[] = [];

    filteredData.forEach((item) => {
      const groupValue = String(getValue(item, groupBy) || "");

      if (!groupsMap.has(groupValue)) {
        groupsMap.set(groupValue, []);
      }

      groupsMap.get(groupValue).push(item);
    });

    // Create groups with rowSpan info
    const groupsList: { groupValue: any; rows: any; rowSpan: any }[] = [];
    groupsMap.forEach((rows, groupValue) => {
      groupsList.push({
        groupValue,
        rows,
        rowSpan: rows.length,
      });

      rows.forEach((row: any, index: number) => {
        allRowsList.push({
          ...row,
          _isFirstInGroup: index === 0,
          _rowSpan: index === 0 ? rows.length : 0,
          _groupValue: groupValue,
        });
      });
    });

    return { groups: groupsList, allRows: allRowsList };
  }, [data, sortConfig, searchTerm, searchKeys, groupBy]);

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        {searchKeys?.length > 0 && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {enableColumnToggle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  className="capitalize"
                  checked={visibleColumns.has(column.key)}
                  onCheckedChange={() => toggleColumn(column.key)}
                >
                  {column.title}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-background border-b">
            <tr>
              {columns
                .filter((col) => visibleColumns.has(col.key))
                .map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-center font-medium text-sm border-r last:border-r-0 bg-muted/50"
                  >
                    {column.sortable ? (
                      // biome-ignore lint/a11y/useButtonType: <>
                      <button
                        className="flex items-center justify-center gap-2 mx-auto hover:bg-accent rounded px-2 py-1"
                        onClick={() => handleSort(column.key)}
                      >
                        {column.title}
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    ) : (
                      column.title
                    )}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {allRows.length > 0 ? (
              allRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-accent/20 border-b ">
                  {columns
                    .filter((col) => visibleColumns.has(col.key))
                    .map((column) => {
                      const value = getValue(row, column.key);
                      const isGroupColumn = column.key === groupBy;
                      const isFirstRow = row._isFirstInGroup;

                      if (isGroupColumn && !isFirstRow) {
                        return null; // Skip group column for non-first rows
                      }

                      return (
                        <td
                          key={column.key}
                          rowSpan={
                            isGroupColumn && isFirstRow ? row._rowSpan : 1
                          }
                          className={`px-4 py-3 text-center border-r  last:border-r-0 ${
                            isGroupColumn && isFirstRow
                              ? "align-middle bg-muted/20"
                              : ""
                          }`}
                        >
                          {column.render
                            ? column.render(value, row, rowIndex)
                            : value}
                        </td>
                      );
                    })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.size}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
