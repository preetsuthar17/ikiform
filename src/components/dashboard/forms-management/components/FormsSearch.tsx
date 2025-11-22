"use client";

import { Filter, Search, X } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { Label } from "@/components/ui";
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

export const FormsSearch = memo(function FormsSearch({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	sortBy,
	onSortByChange,
	onClearFilters,
}: FormsSearchProps) {
	const hasActiveFilters = useMemo(
		() => searchQuery || statusFilter !== "all" || sortBy !== "updated",
		[searchQuery, statusFilter, sortBy],
	);

	const activeFilterCount = useMemo(
		() =>
			[searchQuery, statusFilter !== "all", sortBy !== "updated"].filter(
				Boolean,
			).length,
		[searchQuery, statusFilter, sortBy],
	);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onSearchChange(e.target.value);
		},
		[onSearchChange],
	);

	const handleClearSearch = useCallback(() => {
		onSearchChange("");
	}, [onSearchChange]);

	const handleStatusFilterAll = useCallback(() => {
		onStatusFilterChange("all");
	}, [onStatusFilterChange]);

	const handleStatusFilterPublished = useCallback(() => {
		onStatusFilterChange("published");
	}, [onStatusFilterChange]);

	const handleStatusFilterDraft = useCallback(() => {
		onStatusFilterChange("draft");
	}, [onStatusFilterChange]);

	const handleSortUpdated = useCallback(() => {
		onSortByChange("updated");
	}, [onSortByChange]);

	const handleSortCreated = useCallback(() => {
		onSortByChange("created");
	}, [onSortByChange]);

	const handleSortTitle = useCallback(() => {
		onSortByChange("title");
	}, [onSortByChange]);

	return (
		<div
			aria-label="Forms search and filters"
			className="flex flex-col gap-4"
			role="search"
		>
			<div className="flex items-center gap-3">
				<div className="relative flex-1">
					<Search
						aria-hidden="true"
						className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground"
					/>
					<Input
						aria-label="Search forms"
						className="h-10 bg-card pl-8 shadow-none"
						onChange={handleSearchChange}
						placeholder="Search forms by title, description, or ID..."
						type="search"
						value={searchQuery}
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							aria-label="Open filter menu"
							className="h-10 shrink-0 bg-card"
							variant="outline"
						>
							<Filter aria-hidden="true" className="size-4" />
							{hasActiveFilters && (
								<Badge
									aria-label={`${activeFilterCount} active filters`}
									className="h-5 px-1.5 text-xs"
									variant="secondary"
								>
									{activeFilterCount}
								</Badge>
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-min p-2 shadow-xs">
						<div className="flex flex-col gap-2">
							<div className="flex flex-col gap-2">
								<Label className="font-medium text-sm">Status</Label>
								<div className="flex gap-2">
									<Toggle
										aria-label="Filter by all statuses"
										onPressedChange={handleStatusFilterAll}
										pressed={statusFilter === "all"}
									>
										All
									</Toggle>
									<Toggle
										aria-label="Filter by published forms"
										onPressedChange={handleStatusFilterPublished}
										pressed={statusFilter === "published"}
									>
										Published
									</Toggle>
									<Toggle
										aria-label="Filter by draft forms"
										onPressedChange={handleStatusFilterDraft}
										pressed={statusFilter === "draft"}
									>
										Draft
									</Toggle>
								</div>
							</div>
							<DropdownMenuSeparator />

							<div className="flex flex-col gap-2">
								<Label className="font-medium text-sm">Sort By</Label>
								<div className="flex flex-col gap-2">
									<Toggle
										aria-label="Sort by last updated"
										className="w-full justify-start"
										onPressedChange={handleSortUpdated}
										pressed={sortBy === "updated"}
									>
										Last Updated
									</Toggle>
									<Toggle
										aria-label="Sort by date created"
										className="w-full justify-start"
										onPressedChange={handleSortCreated}
										pressed={sortBy === "created"}
									>
										Date Created
									</Toggle>
									<Toggle
										aria-label="Sort by title alphabetically"
										className="w-full justify-start"
										onPressedChange={handleSortTitle}
										pressed={sortBy === "title"}
									>
										Title (A-Z)
									</Toggle>
								</div>
							</div>
							{hasActiveFilters && <DropdownMenuSeparator />}
							{hasActiveFilters && (
								<div>
									<Button
										aria-label="Clear all filters"
										className="w-full"
										onClick={onClearFilters}
										variant="ghost"
									>
										<X aria-hidden="true" className="size-4" />
										Clear all filters
									</Button>
								</div>
							)}
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{hasActiveFilters && (
				<div
					aria-label="Active filters"
					className="flex flex-wrap gap-2"
					role="group"
				>
					{searchQuery && (
						<Badge className="flex w-fit gap-1" variant="secondary">
							Search: "{searchQuery}"
							<button
								aria-label="Clear search query"
								className="h-auto rounded-sm p-0 hover:bg-muted"
								onClick={handleClearSearch}
							>
								<X aria-hidden="true" className="size-3" />
							</button>
						</Badge>
					)}
					{statusFilter !== "all" && (
						<Badge className="flex w-fit gap-1" variant="secondary">
							Status: {statusFilter === "published" ? "Published" : "Draft"}
							<button
								aria-label="Clear status filter"
								className="h-auto rounded-sm p-0 hover:bg-muted"
								onClick={handleStatusFilterAll}
							>
								<X aria-hidden="true" className="size-3" />
							</button>
						</Badge>
					)}
					{sortBy !== "updated" && (
						<Badge className="flex w-fit gap-1" variant="secondary">
							Sort: {sortBy === "title" ? "Title" : "Created"}
							<button
								aria-label="Reset sort to last updated"
								className="h-auto rounded-sm p-0 hover:bg-muted"
								onClick={handleSortUpdated}
							>
								<X aria-hidden="true" className="size-3" />
							</button>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
});
