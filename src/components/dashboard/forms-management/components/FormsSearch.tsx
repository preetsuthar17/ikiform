"use client";

import { Filter, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";

interface FormsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onClearFilters: () => void;
}

export function FormsSearch({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  onClearFilters,
}: FormsSearchProps) {
  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || sortBy !== "updated";

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            className="h-10 bg-card pl-8 shadow-none"
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search forms by title, description, or ID..."
            value={searchQuery}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-10 shrink-0" variant="outline">
              <Filter className="size-4" />
              {hasActiveFilters && (
                <Badge className="h-5 px-1.5 text-xs" variant="secondary">
                  {
                    [
                      searchQuery,
                      statusFilter !== "all",
                      sortBy !== "updated",
                    ].filter(Boolean).length
                  }
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-min p-4 shadow-xs">
            <div className="flex flex-col gap-2">
              {/* Status Filter */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Status</label>
                <div className="flex gap-2">
                  <Toggle
                    onPressedChange={() => onStatusFilterChange("all")}
                    pressed={statusFilter === "all"}
                  >
                    All
                  </Toggle>
                  <Toggle
                    onPressedChange={() => onStatusFilterChange("published")}
                    pressed={statusFilter === "published"}
                  >
                    Published
                  </Toggle>
                  <Toggle
                    onPressedChange={() => onStatusFilterChange("draft")}
                    pressed={statusFilter === "draft"}
                  >
                    Draft
                  </Toggle>
                </div>
              </div>
              <DropdownMenuSeparator />

              {/* Sort Filter */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Sort By</label>
                <div className="flex flex-col gap-2">
                  <Toggle
                    className="w-full justify-start"
                    onPressedChange={() => onSortByChange("updated")}
                    pressed={sortBy === "updated"}
                  >
                    Last Updated
                  </Toggle>
                  <Toggle
                    className="w-full justify-start"
                    onPressedChange={() => onSortByChange("created")}
                    pressed={sortBy === "created"}
                  >
                    Date Created
                  </Toggle>
                  <Toggle
                    className="w-full justify-start"
                    onPressedChange={() => onSortByChange("title")}
                    pressed={sortBy === "title"}
                  >
                    Title (A-Z)
                  </Toggle>
                </div>
              </div>
              {hasActiveFilters && <DropdownMenuSeparator />}
              {/* Clear Filters */}
              {hasActiveFilters && (
                <div>
                  <Button
                    className="w-full"
                    onClick={onClearFilters}
                    variant="ghost"
                  >
                    <X className="size-4" />
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge className="flex w-fit gap-1" variant="secondary">
              Search: "{searchQuery}"
              <span className="h-auto p-0" onClick={() => onSearchChange("")}>
                <X className="size-3" />
              </span>
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge className="flex w-fit gap-1" variant="secondary">
              Status: {statusFilter === "published" ? "Published" : "Draft"}
              <span
                className="h-auto p-0"
                onClick={() => onStatusFilterChange("all")}
              >
                <X className="size-3" />
              </span>
            </Badge>
          )}
          {sortBy !== "updated" && (
            <Badge className="flex w-fit gap-1" variant="secondary">
              Sort: {sortBy === "title" ? "Title" : "Created"}
              <span
                className="h-auto p-0"
                onClick={() => onSortByChange("updated")}
              >
                <X className="size-3" />
              </span>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
