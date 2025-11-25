import { Check, Copy } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyWithToast } from "@/lib/utils/clipboard";

interface CopyButtonProps {
	schema: unknown;
}

export function CopyButton({ schema }: CopyButtonProps) {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = async () => {
		const success = await copyWithToast(
			JSON.stringify(schema, null, 2),
			"Schema copied to clipboard!",
			"Failed to copy schema",
		);
		if (success) {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		}
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label={copied ? "Copied!" : "Copy schema"}
						className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
						disabled={copied}
						onClick={handleCopy}
						size="icon"
						type="button"
						variant="outline"
					>
						<span className="sr-only">
							{copied ? "Copied!" : "Copy JSON Schema"}
						</span>
						{copied ? (
							<Check aria-hidden="true" className="size-" />
						) : (
							<Copy aria-hidden="true" className="size-4 transition-all" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent
					align="center"
					className="select-none px-3 py-1.5 font-medium text-xs"
					side="top"
				>
					{copied ? "Copied" : "Copy"}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
