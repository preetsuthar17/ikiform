import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FORM_SETTINGS_SECTIONS } from "../index";
import type { FormSettingsSection } from "../types";
import { FormSettingsContent } from "./form-settings-content";
import { SettingsSearch } from "./settings-search";

interface FormSettingsMobileLayoutProps {
	activeSection: FormSettingsSection;
	onSectionChange: (section: FormSettingsSection) => void;
	onClose: () => void;
	sectionProps: any;
}

export function FormSettingsMobileLayout({
	activeSection,
	onSectionChange,
	onClose,
	sectionProps,
}: FormSettingsMobileLayoutProps) {
	const [showSectionList, setShowSectionList] = useState(true);

	const handleSectionClick = (sectionId: FormSettingsSection) => {
		if (sectionId === "design" && sectionProps?.formId) {
			const url = `/form-builder/${sectionProps.formId}/customize`;
			window.open(url, "_blank", "noopener,noreferrer");
			return;
		}
		onSectionChange(sectionId);
		setShowSectionList(false);
	};

	const handleBackClick = () => {
		setShowSectionList(true);
	};

	if (showSectionList) {
		return (
			<div className="flex h-full flex-col gap-4 md:hidden">
				<div className="p-2">
					<SettingsSearch
						activeSection={activeSection}
						onSectionChange={onSectionChange}
					/>
				</div>
				<ScrollArea className="h-fit">
					<nav
						aria-label="Settings sections"
						className="flex flex-col gap-1 overflow-auto p-2"
						role="navigation"
					>
						{FORM_SETTINGS_SECTIONS.map((section, index) => (
							<button
								aria-label={`Go to ${section.label} settings`}
								className="flex w-full items-center justify-between rounded-md px-4 py-4 text-left font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
								key={section.id}
								onClick={() => handleSectionClick(section.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleSectionClick(section.id);
									}
									if (
										e.key === "ArrowDown" &&
										index < FORM_SETTINGS_SECTIONS.length - 1
									) {
										e.preventDefault();
										const nextButton = e.currentTarget.parentElement?.children[
											index + 1
										] as HTMLElement;
										nextButton?.focus();
									}
									if (e.key === "ArrowUp" && index > 0) {
										e.preventDefault();
										const prevButton = e.currentTarget.parentElement?.children[
											index - 1
										] as HTMLElement;
										prevButton?.focus();
									}
								}}
								role="menuitem"
								tabIndex={0}
							>
								<span>{section.label}</span>
								<ArrowLeft aria-hidden="true" className="size-4 rotate-180" />
							</button>
						))}
					</nav>
				</ScrollArea>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col gap-4 md:hidden">
			<header className="flex flex-shrink-0 items-center gap-3">
				<Button
					aria-label="Go back to settings list"
					onClick={handleBackClick}
					size="icon"
					variant="outline"
				>
					<ArrowLeft aria-hidden="true" className="size-4" />
				</Button>
				<h2 className="font-semibold text-lg">Settings</h2>
			</header>
			<main
				aria-labelledby="settings-section-title"
				className="h-full"
				role="main"
				style={{
					overscrollBehavior: "contain",
				}}
			>
				<ScrollArea className="h-full w-full pb-4">
					<FormSettingsContent
						section={activeSection}
						{...sectionProps}
						updateNotifications={sectionProps.updateNotifications}
					/>
				</ScrollArea>
			</main>
		</div>
	);
}
