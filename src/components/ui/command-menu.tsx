"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Search, X } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";
import { Kbd } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
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
	scrollType?: "auto" | "always" | "scroll" | "hover";
	scrollHideDelay?: number;
}

const CommandMenuContext = React.createContext<
	CommandMenuContextType | undefined
>(undefined);

const CommandMenuProvider: React.FC<{
	children: React.ReactNode;
	value: string;
	setValue: (value: string) => void;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
	scrollType?: "auto" | "always" | "scroll" | "hover";
	scrollHideDelay?: number;
}> = ({
	children,
	value,
	setValue,
	selectedIndex,
	setSelectedIndex,
	scrollType,
	scrollHideDelay,
}) => (
	<CommandMenuContext.Provider
		value={{
			value,
			setValue,
			selectedIndex,
			setSelectedIndex,
			scrollType,
			scrollHideDelay,
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

const CommandMenu = DialogPrimitive.Root;
const CommandMenuTrigger = DialogPrimitive.Trigger;
const CommandMenuPortal = DialogPrimitive.Portal;
const CommandMenuClose = DialogPrimitive.Close;

const CommandMenuTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		className={cn(
			"font-semibold text-foreground text-lg leading-none tracking-tight",
			className,
		)}
		ref={ref}
		{...props}
	/>
));
CommandMenuTitle.displayName = "CommandMenuTitle";

const CommandMenuDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		className={cn("text-muted-foreground text-sm", className)}
		ref={ref}
		{...props}
	/>
));
CommandMenuDescription.displayName = "CommandMenuDescription";

const CommandMenuOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		className={cn(
			"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in",
			className,
		)}
		ref={ref}
		{...props}
	/>
));
CommandMenuOverlay.displayName = "CommandMenuOverlay";

const CommandMenuContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
		showShortcut?: boolean;
		scrollType?: "auto" | "always" | "scroll" | "hover";
		scrollHideDelay?: number;
	}
>(
	(
		{
			className,
			children,
			showShortcut = true,
			scrollType = "hover",
			scrollHideDelay = 600,
			...props
		},
		ref,
	) => {
		const [value, setValue] = React.useState("");
		const [selectedIndex, setSelectedIndex] = React.useState(0);

		React.useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "ArrowDown") {
					e.preventDefault();
				} else if (e.key === "ArrowUp") {
					e.preventDefault();
				} else if (e.key === "Enter") {
					e.preventDefault();
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}, []);

		return (
			<CommandMenuPortal>
				<CommandMenuOverlay />
				<DialogPrimitive.Content asChild ref={ref} {...props}>
					<motion.div
						animate={{ opacity: 1, scale: 1, y: 0 }}
						className={cn(
							"fixed top-[30%] left-[50%] z-50 w-[95%] max-w-2xl translate-x-[-50%] translate-y-[-50%]",
							"rounded-2xl border border-border bg-background",
							"overflow-hidden",
							className,
						)}
						exit={{ opacity: 0, scale: 0.95, y: -20 }}
						initial={{ opacity: 0, scale: 0.95, y: -20 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					>
						{" "}
						<CommandMenuProvider
							scrollHideDelay={scrollHideDelay}
							scrollType={scrollType}
							selectedIndex={selectedIndex}
							setSelectedIndex={setSelectedIndex}
							setValue={setValue}
							value={value}
						>
							<VisuallyHidden.Root>
								<CommandMenuTitle>Command Menu</CommandMenuTitle>
							</VisuallyHidden.Root>

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
					</motion.div>
				</DialogPrimitive.Content>
			</CommandMenuPortal>
		);
	},
);
CommandMenuContent.displayName = "CommandMenuContent";

const CommandMenuInput = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement> & {
		placeholder?: string;
	}
>(
	(
		{ className, placeholder = "Type a command or search...", ...props },
		ref,
	) => {
		const { value, setValue } = useCommandMenu();

		return (
			<div className="flex items-center border-border border-b px-3 py-0">
				<Search className="mr-3 size-4 shrink-0 text-muted-foreground" />
				<input
					className={cn(
						"flex h-12 w-full rounded-none border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					onChange={(e) => setValue(e.target.value)}
					placeholder={placeholder}
					ref={ref}
					value={value}
					{...props}
				/>
			</div>
		);
	},
);
CommandMenuInput.displayName = "CommandMenuInput";

const CommandMenuList = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		maxHeight?: string;
	}
>(({ className, children, maxHeight = "300px", ...props }, ref) => {
	const {
		selectedIndex,
		setSelectedIndex,
		scrollType = "hover",
		scrollHideDelay = 600,
	} = useCommandMenu();

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const items = document.querySelectorAll("[data-command-item]");
			const maxIndex = items.length - 1;

			if (e.key === "ArrowDown") {
				e.preventDefault();
				const newIndex = Math.min(selectedIndex + 1, maxIndex);
				setSelectedIndex(newIndex);

				const selectedItem = items[newIndex] as HTMLElement;
				if (selectedItem) {
					selectedItem.scrollIntoView({
						block: "nearest",
						behavior: "smooth",
					});
				}
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				const newIndex = Math.max(selectedIndex - 1, 0);
				setSelectedIndex(newIndex);

				const selectedItem = items[newIndex] as HTMLElement;
				if (selectedItem) {
					selectedItem.scrollIntoView({
						block: "nearest",
						behavior: "smooth",
					});
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [selectedIndex, setSelectedIndex]);

	return (
		<div className="p-1" ref={ref} {...props}>
			<ScrollArea
				className={cn("w-full", className)}
				scrollHideDelay={scrollHideDelay}
				style={{ height: maxHeight }}
				type={scrollType}
			>
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
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
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
		ref,
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
			<div
				className={cn(
					"relative flex cursor-default select-none items-center gap-2 rounded-xl px-2 py-2 text-sm outline-none transition-colors",
					"hover:bg-accent hover:text-accent-foreground",
					isSelected && "bg-accent text-accent-foreground",
					disabled && "pointer-events-none opacity-50",
					className,
				)}
				data-command-item
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
			</div>
		);
	},
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
