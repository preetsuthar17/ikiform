import type React from "react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { FormTypeCardProps } from "../types";

export const FormTypeCard: React.FC<FormTypeCardProps> = ({
	type,
	isSelected,
	onSelect,
}) => {
	const Icon = type.icon;

	return (
		<Card
			className={`w-full cursor-pointer shadow-none transition ${
				isSelected
					? "border-primary bg-primary/5 ring-2 ring-primary"
					: "hover:bg-muted/30"
			}`}
			onClick={() => onSelect(type.id)}
		>
			<CardHeader>
				<div className="flex flex-col items-start gap-3">
					<span
						className={`flex items-center justify-center rounded-lg p-2 ${
							isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
						}`}
					>
						<Icon aria-hidden="true" className="size-5" />
					</span>
					<div className="flex flex-col gap-2">
						<CardTitle className="text-base">{type.title}</CardTitle>
						<CardDescription className="text-xs">
							{type.description}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
		</Card>
	);
};
