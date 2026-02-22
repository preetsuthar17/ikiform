"use client";

import { ChevronRight, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UiRegressionHarness() {
	return (
		<div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-8">
			<h1 className="font-semibold text-2xl">UI Regression Harness</h1>

			<div className="flex flex-wrap items-center gap-3">
				<Button data-testid="icon-button" variant="outline">
					<User className="size-4" />
					Icon Button
				</Button>

				<Button
					asChild
					data-testid="aschild-icon-button"
					leftIcon={<ChevronRight className="size-4" />}
					variant="outline"
				>
					<Link href="/e2e-ui">
						AsChild Icon Button
					</Link>
				</Button>
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button aria-label="Open test menu" variant="outline">
						Open test menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" sideOffset={8}>
					<DropdownMenuLabel data-testid="menu-label">
						Account details
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem data-testid="menu-item">
						<span>Log out</span>
						<LogOut className="ml-auto size-4" />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
