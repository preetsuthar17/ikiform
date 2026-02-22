"use client";

import { Search, X } from "lucide-react";
import * as React from "react";
import { Kbd } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Dialog as CommandMenu,
	DialogClose as CommandMenuClose,
	DialogContent,
	DialogDescription as CommandMenuDescription,
	DialogTitle as CommandMenuTitle,
	DialogTrigger as CommandMenuTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const getModifierKey = () => {
	if (typeof navigator === "undefined") return { key: "Ctrl", symbol: "Ctrl" };

	const isMac =
		navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
		navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;

	return isMac ? { key: "cmd", symbol: "⌘" } : { key: "ctrl", symbol: "Ctrl" };
};

interface CommandMenuContextType {
	value: string;
	setValue: (value: string) => void;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}

const CommandMenuContext = React.createContext<CommandMenuContextType | undefined>(
	undefined
);

const CommandMenuProvider: React.FC<{
	children: React.ReactNode;
	value: string;
	setValue: (value: string) => void;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}> = ({
	children,
	value,
	setValue,
	selectedIndex,
	setSelectedIndex,
}) => (
	<CommandMenuContext.Provider
		value={{
			value,
			setValue,
			selectedIndex,
			setSelectedIndex,
		}}
	>
		{children}
	</CommandMenuContext.Provider>
);

const useCommandMenu = () => {
	const context = React.useContext(CommandMenuContext);
	if (!context) {
		throw new Error("useCommandMenu must be used within CommandMenuProvider");
	}
	return context;
};

function CommandMenuContent({
	className,
	children,
	showShortcut = true,
	...props
}: React.ComponentProps<typeof DialogContent> & {
	showShortcut?: boolean;
}) {
	const [value, setValue] = React.useState("");
	const [selectedIndex, setSelectedIndex] = React.useState(0);

	return (
		<DialogContent
			className={cn(
				"top-[30%] w-[95%] max-w-2xl rounded-2xl border border-border p-0",
				className
			)}
			showCloseButton={false}
			{...props}
		>
			<CommandMenuProvider
				selectedIndex={selectedIndex}
				setSelectedIndex={setSelectedIndex}
				setValue={setValue}
				value={value}
			>
				<CommandMenuTitle className="sr-only">Command Menu</CommandMenuTitle>
				<CommandMenuDescription className="sr-only">
					Search and run commands
				</CommandMenuDescription>

				{children}

				<CommandMenuClose className="absolute top-3 right-3 rounded-2xl p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
					<X size={14} />
					<span className="sr-only">Close</span>
				</CommandMenuClose>

				{showShortcut && (
					<div className="absolute top-3 right-12 flex h-6.5 items-center justify-center gap-1">
						<Kbd>{getModifierKey().symbol}</Kbd>
						<Kbd>K</Kbd>
					</div>
				)}
			</CommandMenuProvider>
		</DialogContent>
	);
}

const CommandMenuInput = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement> & {
		placeholder?: string;
	}
>(
	(
		{ className, placeholder = "Type a command or search...", ...props },
		ref
	) => {
		const { value, setValue } = useCommandMenu();

		return (
			<div className="flex items-center border-b border-border px-3 py-0">
				<Search className="mr-3 size-4 shrink-0 text-muted-foreground" />
				<input
					className={cn(
						"flex h-12 w-full rounded-none border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
						className
					)}
					onChange={(e) => setValue(e.target.value)}
					placeholder={placeholder}
					ref={ref}
					value={value}
					{...props}
				/>
			</div>
		);
	}
);
CommandMenuInput.displayName = "CommandMenuInput";

const CommandMenuList = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		maxHeight?: string;
	}
>(({ className, children, maxHeight = "300px", ...props }, ref) => {
	const { selectedIndex, setSelectedIndex } = useCommandMenu();

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const items = document.querySelectorAll("[data-command-item]");
			const maxIndex = items.length - 1;

			if (e.key === "ArrowDown") {
				e.preventDefault();
				const newIndex = Math.min(selectedIndex + 1, maxIndex);
				setSelectedIndex(newIndex);
				const selectedItem = items[newIndex] as HTMLElement;
				selectedItem?.scrollIntoView({ block: "nearest", behavior: "smooth" });
			}

			if (e.key === "ArrowUp") {
				e.preventDefault();
				const newIndex = Math.max(selectedIndex - 1, 0);
				setSelectedIndex(newIndex);
				const selectedItem = items[newIndex] as HTMLElement;
				selectedItem?.scrollIntoView({ block: "nearest", behavior: "smooth" });
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [selectedIndex, setSelectedIndex]);

	return (
		<div className="p-1" ref={ref} {...props}>
			<ScrollArea className={cn("w-full", className)} style={{ height: maxHeight }}>
				<div className="flex flex-col gap-1 p-1">{children}</div>
			</ScrollArea>
		</div>
	);
});
CommandMenuList.displayName = "CommandMenuList";

const CommandMenuGroup = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		heading?: string;
	}
>(({ className, children, heading, ...props }, ref) => (
	<div className={cn("", className)} ref={ref} {...props}>
		{heading && (
			<div className="px-2 py-1.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">
				{heading}
			</div>
		)}
		{children}
	</div>
));
CommandMenuGroup.displayName = "CommandMenuGroup";

const CommandMenuItem = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		onSelect?: () => void;
		disabled?: boolean;
		shortcut?: string;
		icon?: React.ReactNode;
		index?: number;
	}
>(
	(
		{
			className,
			children,
			onSelect,
			disabled = false,
			shortcut,
			icon,
			index = 0,
			...props
		},
		ref
	) => {
		const { selectedIndex, setSelectedIndex } = useCommandMenu();
		const isSelected = selectedIndex === index;

		const handleSelect = React.useCallback(() => {
			if (!disabled && onSelect) {
				onSelect();
			}
		}, [disabled, onSelect]);

		React.useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "Enter" && isSelected) {
					e.preventDefault();
					handleSelect();
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}, [isSelected, handleSelect]);

		return (
			<button
				type="button"
				className={cn(
					"relative flex cursor-default select-none items-center gap-2 rounded-xl px-2 py-2 text-sm outline-none transition-colors",
					"hover:bg-accent hover:text-accent-foreground",
					isSelected && "bg-accent text-accent-foreground",
					disabled && "pointer-events-none opacity-50",
					className
				)}
				data-command-item
				disabled={disabled}
				onClick={handleSelect}
				onMouseEnter={() => setSelectedIndex(index)}
				ref={ref}
				{...props}
			>
				{icon && (
					<div className="flex size-4 items-center justify-center">{icon}</div>
				)}

				<div className="flex-1">{children}</div>

				{shortcut && (
					<div className="ml-auto flex items-center gap-1">
						{shortcut.split("+").map((key, i) => (
							<React.Fragment key={key}>
								{i > 0 && (
									<span className="text-muted-foreground text-xs">+</span>
								)}
								<Kbd>
									{key === "cmd" || key === "⌘"
										? getModifierKey().symbol
										: key === "shift"
											? "⇧"
											: key === "alt"
												? "⌥"
												: key === "ctrl"
													? getModifierKey().key === "cmd"
														? "⌃"
														: "Ctrl"
													: key}
								</Kbd>
							</React.Fragment>
						))}
					</div>
				)}
			</button>
		);
	}
);
CommandMenuItem.displayName = "CommandMenuItem";

const CommandMenuSeparator = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		className={cn("-mx-1 my-1 h-px bg-border", className)}
		ref={ref}
		{...props}
	/>
));
CommandMenuSeparator.displayName = "CommandMenuSeparator";

const CommandMenuEmpty = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children = "No results found.", ...props }, ref) => (
	<div
		className={cn("py-6 text-center text-muted-foreground text-sm", className)}
		ref={ref}
		{...props}
	>
		{children}
	</div>
));
CommandMenuEmpty.displayName = "CommandMenuEmpty";

export const useCommandMenuShortcut = (callback: () => void) => {
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				callback();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [callback]);
};

export {
	CommandMenu,
	CommandMenuTrigger,
	CommandMenuContent,
	CommandMenuTitle,
	CommandMenuDescription,
	CommandMenuInput,
	CommandMenuList,
	CommandMenuEmpty,
	CommandMenuGroup,
	CommandMenuItem,
	CommandMenuSeparator,
	CommandMenuClose,
	useCommandMenu,
};
