import { Edit3 } from "lucide-react";
import type React from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { useEditableField } from "../hooks/useEditableField";

interface EditableFieldProps {
	value: string;
	placeholder?: string;
	onSave: (value: string) => void;
	className?: string;
	inputClassName?: string;
	component?: "input" | "textarea";
	rows?: number;
	disabled?: boolean;
	children?: React.ReactNode;
}

export function EditableField({
	value,
	placeholder,
	onSave,
	className = "",
	inputClassName = "",
	component = "input",
	rows = 1,
	disabled = false,
	children,
}: EditableFieldProps) {
	const {
		isEditing,
		tempValue,
		inputRef,
		textareaRef,
		setIsEditing,
		setTempValue,
		handleSave,
		handleKeyDown,
	} = useEditableField(value, onSave);

	if (disabled) {
		return (
			<div className={className}>
				{children || (
					<div className="text-muted-foreground">{value || placeholder}</div>
				)}
			</div>
		);
	}

	return (
		<div className={`group relative flex flex-col gap-2 ${className}`}>
			{isEditing ? (
				component === "textarea" ? (
					<Textarea
						className={inputClassName}
						onBlur={handleSave}
						onChange={(e) => setTempValue(e.target.value)}
						onKeyDown={(e) => handleKeyDown(e, true)}
						placeholder={placeholder}
						ref={textareaRef}
						rows={rows}
						value={tempValue}
					/>
				) : (
					<Input
						className={inputClassName}
						onBlur={handleSave}
						onChange={(e) => setTempValue(e.target.value)}
						onKeyDown={(e) => handleKeyDown(e, false)}
						placeholder={placeholder}
						ref={inputRef}
						value={tempValue}
					/>
				)
			) : (
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							aria-label="Edit field"
							className="flex w-full cursor-pointer items-center gap-2 rounded-xl p-2 transition-colors hover:bg-accent/10"
							onClick={() => setIsEditing(true)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									setIsEditing(true);
								}
							}}
							role="button"
							tabIndex={0}
						>
							{children || (
								<div className="text-foreground">
									{value || (
										<span className="text-muted-foreground italic">
											{placeholder}
										</span>
									)}
								</div>
							)}
							<Edit3 className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
						</div>
					</TooltipTrigger>
					<TooltipContent align="start" side="top">
						Click to edit
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
}
