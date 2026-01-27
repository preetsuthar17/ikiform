import { useState } from "react";

import type { FormBlock } from "@/lib/database";

export function useBlockExpansion(blocks: FormBlock[]) {
	const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(
		new Set(blocks.map((block) => block.id))
	);

	const toggleBlockExpansion = (blockId: string) => {
		const newExpanded = new Set(expandedBlocks);
		if (newExpanded.has(blockId)) {
			newExpanded.delete(blockId);
		} else {
			newExpanded.add(blockId);
		}
		setExpandedBlocks(newExpanded);
	};

	return {
		expandedBlocks,
		toggleBlockExpansion,
	};
}
