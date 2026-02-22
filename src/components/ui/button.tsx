import { Slot } from "@/components/ui/slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader } from "./loader";

const buttonVariants = cva(
	"inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 " +
		"transition-transform will-change-transform active:scale-97",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
				warning:
					"bg-yellow-400/20 text-yellow-900 hover:bg-yellow-400/30 focus-visible:ring-yellow-400/20 dark:bg-yellow-300 dark:focus-visible:ring-yellow-300/40",
				outline:
					"border bg-background shadow-none hover:bg-accent hover:text-accent-foreground dark:border-border dark:bg-input/30 dark:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			loading = false,
			leftIcon,
			rightIcon,
			children,
			disabled,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";
		const isDisabled = disabled || loading;
		const slottedElement =
			asChild && React.isValidElement(children)
				? (children as React.ReactElement<{ children?: React.ReactNode }>)
				: null;

		const innerContent = (
			<>
				{loading && <Loader className="text-primary-foreground" size="md" />}
				{leftIcon && !loading && leftIcon}
				{children}
				{rightIcon && !loading && rightIcon}
			</>
		);

		const slottedContent = (
			<>
				{loading && <Loader className="text-primary-foreground" size="md" />}
				{leftIcon && !loading && leftIcon}
				{slottedElement?.props.children}
				{rightIcon && !loading && rightIcon}
			</>
		);

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				data-slot="button"
				disabled={isDisabled}
				ref={ref}
				{...props}
			>
				{asChild && slottedElement
					? React.cloneElement(slottedElement, { children: slottedContent })
					: innerContent}
			</Comp>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
