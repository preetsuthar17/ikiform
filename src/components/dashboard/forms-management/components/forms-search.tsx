"use client";

import { Filter, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
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
	const t = useTranslations("dashboard.formsManagement.search");

	const hasActiveFilters = useMemo(
		() => searchQuery || statusFilter !== "all" || sortBy !== "updated",
		[searchQuery, statusFilter, sortBy]
	);

	const activeFilterCount = useMemo(
		() =>
			[searchQuery, statusFilter !== "all", sortBy !== "updated"].filter(
				Boolean
			).length,
		[searchQuery, statusFilter, sortBy]
	);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onSearchChange(e.target.value);
		},
		[onSearchChange]
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
			aria-label={t("aria")}
			className="flex flex-col gap-4"
			role="search"
		>
			<div className="flex items-center gap-3">
				<div className="relative flex-1">
					<Search
						aria-hidden="true"
						className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						aria-label={t("searchAria")}
						className="h-10 bg-card pl-8 shadow-none"
						onChange={handleSearchChange}
						placeholder={t("placeholder")}
						type="search"
						value={searchQuery}
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							aria-label={t("openFilterMenu")}
							className="h-10 shrink-0 bg-card"
							variant="outline"
						>
							<Filter aria-hidden="true" className="size-4" />
							{hasActiveFilters && (
								<Badge
									aria-label={t("activeFiltersAria", {
										count: activeFilterCount,
									})}
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
								<Label className="font-medium text-sm">{t("statusLabel")}</Label>
								<div className="flex gap-2">
									<Toggle
										aria-label={t("filterByAll")}
										onPressedChange={handleStatusFilterAll}
										pressed={statusFilter === "all"}
									>
										{t("all")}
									</Toggle>
									<Toggle
										aria-label={t("filterByPublished")}
										onPressedChange={handleStatusFilterPublished}
										pressed={statusFilter === "published"}
									>
										{t("published")}
									</Toggle>
									<Toggle
										aria-label={t("filterByDraft")}
										onPressedChange={handleStatusFilterDraft}
										pressed={statusFilter === "draft"}
									>
										{t("draft")}
									</Toggle>
								</div>
							</div>
							<DropdownMenuSeparator />

							<div className="flex flex-col gap-2">
								<Label className="font-medium text-sm">{t("sortByLabel")}</Label>
								<div className="flex flex-col gap-2">
									<Toggle
										aria-label={t("sortByLastUpdated")}
										className="w-full justify-start"
										onPressedChange={handleSortUpdated}
										pressed={sortBy === "updated"}
									>
										{t("lastUpdated")}
									</Toggle>
									<Toggle
										aria-label={t("sortByDateCreated")}
										className="w-full justify-start"
										onPressedChange={handleSortCreated}
										pressed={sortBy === "created"}
									>
										{t("dateCreated")}
									</Toggle>
									<Toggle
										aria-label={t("sortByTitle")}
										className="w-full justify-start"
										onPressedChange={handleSortTitle}
										pressed={sortBy === "title"}
									>
										{t("titleAz")}
									</Toggle>
								</div>
							</div>
							{hasActiveFilters && <DropdownMenuSeparator />}
							{hasActiveFilters && (
								<div>
									<Button
										aria-label={t("clearAllFilters")}
										className="w-full"
										onClick={onClearFilters}
										variant="ghost"
									>
										<X aria-hidden="true" className="size-4" />
										{t("clearAllFilters")}
									</Button>
								</div>
							)}
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{hasActiveFilters && (
				<div
					aria-label={t("activeFiltersGroup")}
					className="flex flex-wrap gap-2"
					role="group"
				>
					{searchQuery && (
						<Badge className="flex w-fit gap-1" variant="secondary">
							{t("badgeSearch", { query: searchQuery })}
							<button
								aria-label={t("clearSearch")}
								className="h-auto rounded-sm p-0 hover:bg-muted"
								onClick={handleClearSearch}
							>
								<X aria-hidden="true" className="size-3" />
							</button>
						</Badge>
					)}
					{statusFilter !== "all" && (
						<Badge className="flex w-fit gap-1" variant="secondary">
							{t("badgeStatus", {
								status:
									statusFilter === "published"
										? t("published")
										: t("draft"),
							})}
							<button
								aria-label={t("clearStatus")}
								className="h-auto rounded-sm p-0 hover:bg-muted"
								onClick={handleStatusFilterAll}
							>
								<X aria-hidden="true" className="size-3" />
							</button>
						</Badge>
					)}
					{sortBy !== "updated" && (
						<Badge className="flex w-fit gap-1" variant="secondary">
							{t("badgeSort", {
								sort: sortBy === "title" ? t("sortTitleShort") : t("sortCreatedShort"),
							})}
							<button
								aria-label={t("resetSort")}
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
