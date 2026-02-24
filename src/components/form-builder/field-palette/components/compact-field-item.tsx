import type { CompactFieldItemProps } from "../types";

export function CompactFieldItem({
	fieldType,
	onAddField,
}: CompactFieldItemProps) {
	const Icon = fieldType.icon;

	return (
		<button
			className="flex items-center gap-2 rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:bg-muted"
			onClick={() => onAddField(fieldType.type)}
		>
			<Icon className="size-4 shrink-0 text-muted-foreground" />
			<span className="truncate font-medium text-xs">{fieldType.label}</span>
		</button>
	);
}
