"use client";

import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	Search,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface User {
	uid: string;
	name: string;
	email: string;
	has_premium: boolean;
	has_free_trial: boolean;
	customer_name: string | null;
	polar_customer_id: string | null;
	created_at: string;
	updated_at: string;
}

interface UsersTableProps {
	users: User[];
}

type SortField =
	| "uid"
	| "name"
	| "email"
	| "has_premium"
	| "has_free_trial"
	| "created_at"
	| "updated_at";
type SortDirection = "asc" | "desc";

export const UsersTable = memo(function UsersTable({ users }: UsersTableProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [searchTerm, setSearchTerm] = useState("");
	const [sortField, setSortField] = useState<SortField>("created_at");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [premiumFilter, setPremiumFilter] = useState<string>("all");
	const [trialFilter, setTrialFilter] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(25);

	useEffect(() => {
		const sortParam = searchParams.get("sort");
		if (sortParam) {
			const [field, direction] = sortParam.split("_");
			if (field && direction && ["asc", "desc"].includes(direction)) {
				setSortField(field as SortField);
				setSortDirection(direction as SortDirection);
			}
		}
	}, [searchParams]);

	const filteredAndSortedUsers = useMemo(() => {
		const filtered = users.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.polar_customer_id
					?.toLowerCase()
					.includes(searchTerm.toLowerCase());

			const matchesPremium =
				premiumFilter === "all" ||
				(premiumFilter === "premium" && user.has_premium) ||
				(premiumFilter === "free" && !user.has_premium);

			const matchesTrial =
				trialFilter === "all" ||
				(trialFilter === "trial" && user.has_free_trial) ||
				(trialFilter === "no-trial" && !user.has_free_trial);

			return matchesSearch && matchesPremium && matchesTrial;
		});

		return filtered.sort((a, b) => {
			let aValue: any = a[sortField];
			let bValue: any = b[sortField];

			if (sortField === "created_at" || sortField === "updated_at") {
				aValue = new Date(aValue).getTime();
				bValue = new Date(bValue).getTime();
			}

			if (typeof aValue === "string") {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}

			if (sortDirection === "asc") {
				return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
			}
			return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
		});
	}, [users, searchTerm, sortField, sortDirection, premiumFilter, trialFilter]);

	const paginatedUsers = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return filteredAndSortedUsers.slice(startIndex, endIndex);
	}, [filteredAndSortedUsers, currentPage, itemsPerPage]);

	const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

	const updateURL = useCallback(
		(newSortField: SortField, newSortDirection: SortDirection) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("sort", `${newSortField}_${newSortDirection}`);
			router.push(`?${params.toString()}`, { scroll: false });
		},
		[router, searchParams]
	);

	const handleSort = useCallback(
		(field: SortField) => {
			let newDirection: SortDirection;

			if (sortField === field) {
				newDirection = sortDirection === "asc" ? "desc" : "asc";
			} else {
				newDirection = "desc";
			}

			setSortField(field);
			setSortDirection(newDirection);
			updateURL(field, newDirection);
		},
		[sortField, sortDirection, updateURL]
	);

	const getSortIcon = useCallback(
		(field: SortField) => {
			if (sortField !== field) {
				return <ArrowUpDown aria-hidden="true" className="size-3" />;
			}
			return sortDirection === "asc" ? (
				<ArrowUp aria-hidden="true" className="size-3" />
			) : (
				<ArrowDown aria-hidden="true" className="size-3" />
			);
		},
		[sortField, sortDirection]
	);

	const clearFilters = useCallback(() => {
		setSearchTerm("");
		setPremiumFilter("all");
		setTrialFilter("all");
		setCurrentPage(1);
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	const handleItemsPerPageChange = useCallback((value: string) => {
		setItemsPerPage(Number(value));
		setCurrentPage(1);
	}, []);

	const hasActiveFilters = useMemo(
		() => searchTerm || premiumFilter !== "all" || trialFilter !== "all",
		[searchTerm, premiumFilter, trialFilter]
	);

	return (
		<div className="flex flex-col gap-4">
			{}
			<div className="flex flex-col gap-4 md:flex-row md:items-center">
				<div className="relative flex-1">
					<Search
						aria-hidden="true"
						className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-muted-foreground"
					/>
					<Input
						aria-label="Search users"
						className="pl-10"
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search users by name, email, customer name, or Polar ID..."
						type="search"
						value={searchTerm}
					/>
				</div>

				<div className="flex gap-2">
					<Select onValueChange={setPremiumFilter} value={premiumFilter}>
						<SelectTrigger
							aria-label="Filter by premium status"
							className="w-[140px]"
						>
							<SelectValue placeholder="Premium" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Premium</SelectItem>
							<SelectItem value="premium">Premium Only</SelectItem>
							<SelectItem value="free">Free Only</SelectItem>
						</SelectContent>
					</Select>

					<Select onValueChange={setTrialFilter} value={trialFilter}>
						<SelectTrigger
							aria-label="Filter by trial status"
							className="w-[140px]"
						>
							<SelectValue placeholder="Trial" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Trial</SelectItem>
							<SelectItem value="trial">Trial Only</SelectItem>
							<SelectItem value="no-trial">No Trial</SelectItem>
						</SelectContent>
					</Select>

					{hasActiveFilters && (
						<Button
							aria-label="Clear all filters"
							onClick={clearFilters}
							size="sm"
							variant="outline"
						>
							<X aria-hidden="true" className="size-4" />
							Clear
						</Button>
					)}
				</div>
			</div>

			{}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="flex items-center gap-4 text-muted-foreground text-sm">
					<span>
						Showing {(currentPage - 1) * itemsPerPage + 1}-
						{Math.min(
							currentPage * itemsPerPage,
							filteredAndSortedUsers.length
						)}{" "}
						of {filteredAndSortedUsers.length} users
					</span>
					{hasActiveFilters && (
						<span className="text-xs">
							Filtered by: {searchTerm && `"${searchTerm}"`}
							{premiumFilter !== "all" &&
								` • ${premiumFilter === "premium" ? "Premium" : "Free"}`}
							{trialFilter !== "all" &&
								` • ${trialFilter === "trial" ? "Trial" : "No Trial"}`}
						</span>
					)}
				</div>

				<div className="flex items-center gap-2">
					<span className="text-muted-foreground text-sm">Show:</span>
					<Select
						onValueChange={handleItemsPerPageChange}
						value={itemsPerPage.toString()}
					>
						<SelectTrigger aria-label="Items per page" className="w-[80px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="25">25</SelectItem>
							<SelectItem value="50">50</SelectItem>
							<SelectItem value="100">100</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{}
			<div className="rounded-md border">
				<Table aria-label="Users table" role="table">
					<TableHeader>
						<TableRow>
							<TableHead>
								<Button
									aria-label="Sort by UID"
									className="h-auto p-0 font-medium hover:bg-transparent"
									onClick={() => handleSort("uid")}
									size="sm"
									variant="ghost"
								>
									UID {getSortIcon("uid")}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									aria-label="Sort by Name"
									className="h-auto p-0 font-medium hover:bg-transparent"
									onClick={() => handleSort("name")}
									size="sm"
									variant="ghost"
								>
									Name {getSortIcon("name")}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									aria-label="Sort by Email"
									className="h-auto p-0 font-medium hover:bg-transparent"
									onClick={() => handleSort("email")}
									size="sm"
									variant="ghost"
								>
									Email {getSortIcon("email")}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									aria-label="Sort by Premium status"
									className="h-auto p-0 font-medium hover:bg-transparent"
									onClick={() => handleSort("has_premium")}
									size="sm"
									variant="ghost"
								>
									Premium {getSortIcon("has_premium")}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									aria-label="Sort by Trial status"
									className="h-auto p-0 font-medium hover:bg-transparent"
									onClick={() => handleSort("has_free_trial")}
									size="sm"
									variant="ghost"
								>
									Trial {getSortIcon("has_free_trial")}
								</Button>
							</TableHead>
							<TableHead>Customer Name</TableHead>
							<TableHead>Polar ID</TableHead>
							<TableHead>
								<Button
									aria-label="Sort by Created date"
									className="h-auto p-0 font-medium hover:bg-transparent"
									onClick={() => handleSort("created_at")}
									size="sm"
									variant="ghost"
								>
									Created {getSortIcon("created_at")}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									aria-label="Sort by Updated date"
									className="h-auto p-0 font-medium hover:bg-transparent"
									onClick={() => handleSort("updated_at")}
									size="sm"
									variant="ghost"
								>
									Updated {getSortIcon("updated_at")}
								</Button>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedUsers.map((user) => (
							<TableRow
								className="cursor-pointer hover:bg-muted/50"
								key={user.uid}
							>
								<TableCell className="font-mono text-xs">
									{user.uid.slice(0, 8)}...
								</TableCell>
								<TableCell className="font-medium">
									<Link
										aria-label={`View details for ${user.name}`}
										className="flex items-center gap-2 hover:text-primary"
										href={`/admin/users/${user.uid}`}
									>
										{user.name}
										<ExternalLink
											aria-hidden="true"
											className="size-3 opacity-50"
										/>
									</Link>
								</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									<Badge
										aria-label={`Premium status: ${user.has_premium ? "Premium" : "Free"}`}
										className="w-full"
										variant={user.has_premium ? "default" : "secondary"}
									>
										{user.has_premium ? "Premium" : "Free"}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										aria-label={`Trial status: ${user.has_free_trial ? "Free Trial" : "No Free Trial"}`}
										className="w-full"
										variant={user.has_free_trial ? "default" : "secondary"}
									>
										{user.has_free_trial ? "Free Trial" : "No Free Trial"}
									</Badge>
								</TableCell>
								<TableCell>
									{user.customer_name ? (
										<code className="rounded bg-muted px-1 py-0.5 text-xs">
											{user.customer_name}
										</code>
									) : (
										<span className="text-muted-foreground">-</span>
									)}
								</TableCell>
								<TableCell>
									{user.polar_customer_id ? (
										<code className="rounded bg-muted px-1 py-0.5 text-xs">
											{user.polar_customer_id.slice(0, 8)}...
										</code>
									) : (
										<span className="text-muted-foreground">-</span>
									)}
								</TableCell>
								<TableCell className="text-xs">
									{new Date(user.created_at).toLocaleDateString("en-US", {
										year: "numeric",
										month: "2-digit",
										day: "2-digit",
									})}
								</TableCell>
								<TableCell className="text-xs">
									{new Date(user.updated_at).toLocaleDateString("en-US", {
										year: "numeric",
										month: "2-digit",
										day: "2-digit",
									})}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{paginatedUsers.length === 0 && (
				<div className="py-8 text-center text-muted-foreground">
					{hasActiveFilters ? "No users match your filters" : "No users found"}
				</div>
			)}

			{}
			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<div className="text-muted-foreground text-sm">
						Page {currentPage} of {totalPages}
					</div>

					<div className="flex items-center gap-2">
						<Button
							aria-label="Go to previous page"
							disabled={currentPage === 1}
							onClick={() => handlePageChange(currentPage - 1)}
							size="sm"
							variant="outline"
						>
							<ChevronLeft aria-hidden="true" className="size-4" />
							Previous
						</Button>

						<div className="flex items-center gap-1">
							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								let pageNum;
								if (totalPages <= 5) {
									pageNum = i + 1;
								} else if (currentPage <= 3) {
									pageNum = i + 1;
								} else if (currentPage >= totalPages - 2) {
									pageNum = totalPages - 4 + i;
								} else {
									pageNum = currentPage - 2 + i;
								}

								return (
									<Button
										aria-current={currentPage === pageNum ? "page" : undefined}
										aria-label={`Go to page ${pageNum}`}
										className="size-8 p-0"
										key={pageNum}
										onClick={() => handlePageChange(pageNum)}
										size="sm"
										variant={currentPage === pageNum ? "default" : "outline"}
									>
										{pageNum}
									</Button>
								);
							})}
						</div>

						<Button
							aria-label="Go to next page"
							disabled={currentPage === totalPages}
							onClick={() => handlePageChange(currentPage + 1)}
							size="sm"
							variant="outline"
						>
							Next
							<ChevronRight aria-hidden="true" className="size-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
});
