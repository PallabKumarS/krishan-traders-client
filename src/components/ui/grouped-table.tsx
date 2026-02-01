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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get nested value
  const getValue = (obj: any, path: string) => {
    return path.split(".").reduce((o, i) => o && o[i], obj);
  };

  // Process data
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  // biome-ignore lint/correctness/noUnusedVariables: <>
  // Process data
  const { groups, allRows, paginatedRows, totalPages } = useMemo(() => {
    // Filter data
    let filteredData = [...data];

    // Search across multiple fields
    if (searchKeys.length > 0 && searchTerm) {
      filteredData = data.filter((item) => {
        // Check if any of the search keys contain the search term
        return searchKeys.some((key) => {
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
    const groupsList: any[] = [];
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
          _isLastInGroup: index === rows.length - 1,
          _rowSpan: index === 0 ? rows.length : 0,
          _groupValue: groupValue,
        });
      });
    });

    // Apply pagination to groups (not individual rows)
    const totalPages = Math.ceil(groupsList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedGroups = groupsList.slice(startIndex, endIndex);

    // Create paginated rows
    const paginatedRows: any[] = [];
    paginatedGroups.forEach((group) => {
      group.rows.forEach((row: any, index: number) => {
        paginatedRows.push({
          ...row,
          _isFirstInGroup: index === 0,
          _isLastInGroup: index === group.rows.length - 1,
          _rowSpan: index === 0 ? group.rows.length : 0,
          _groupValue: group.groupValue,
        });
      });
    });

    return {
      groups: groupsList,
      allRows: allRowsList,
      paginatedGroups,
      paginatedRows,
      totalPages,
    };
  }, [
    data,
    sortConfig,
    searchTerm,
    searchKeys,
    groupBy,
    currentPage,
    itemsPerPage,
  ]);

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
        <table className="w-full grouped-table">
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
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`hover:bg-accent/20 transition-colors ${
                    row._isFirstInGroup
                      ? "border-t-2 border-t-primary/30 border-b-0"
                      : "border-0"
                  } ${
                    row._isLastInGroup
                      ? "border-b-2 border-b-primary/30 border-t-0"
                      : ""
                  }`}
                  data-first={row._isFirstInGroup ? "true" : "false"}
                  data-last={row._isLastInGroup ? "true" : "false"}
                >
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
                          className={`px-4 py-1 text-center border-r last:border-r-0 ${
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

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, groups.length)} of{" "}
              {groups.length} products
            </div>

            {/* items per page dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Items per page:
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 w-16 p-0">
                    {itemsPerPage}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {[10, 15, 25, 50].map((count) => (
                    <DropdownMenuCheckboxItem
                      key={count}
                      checked={itemsPerPage === count}
                      onCheckedChange={() => {
                        setItemsPerPage(count);
                        setCurrentPage(1);
                      }}
                    >
                      {count}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
