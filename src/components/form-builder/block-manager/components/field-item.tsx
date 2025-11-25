import { Badge } from "@/components/ui/badge";

import type { FieldItemProps } from "../types";

export function FieldItem({
	field,
	isSelected,
	onFieldSelect,
}: FieldItemProps) {
	return (
		<div
			className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg transition-colors ${
				isSelected ? "border border-primary/20 bg-primary/10" : "bg-accent"
			}`}
			onClick={() => onFieldSelect(field.id)}
		>
			<div className="flex flex-col gap-2 p-3">
				<div className="flex items-center gap-2">
					<Badge className="text-xs" variant="outline">
						{field.type}
					</Badge>
				</div>
				<span className="flex items-start gap-1 font-medium text-sm">
					{field.label}
					{field.required && <span className="text-destructive">*</span>}
				</span>
			</div>
		</div>
	);
}
