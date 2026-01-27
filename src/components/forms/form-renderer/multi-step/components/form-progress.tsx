import type React from "react";

import { Progress } from "@/components/ui/progress";
import { useFormStyling } from "@/hooks/use-form-styling";
import type { FormSchema } from "@/lib/database";

interface FormProgressProps {
	progress: number;
	totalSteps: number;
	showProgress: boolean;
	schema: FormSchema;
}

export const FormProgress: React.FC<FormProgressProps> = ({
	progress,
	totalSteps,
	showProgress,
	schema,
}) => {
	const { getButtonStyles } = useFormStyling(schema);
	const buttonStyles = getButtonStyles(true);

	if (totalSteps <= 1 || !showProgress) return null;

	return (
		<div className="flex flex-col gap-2">
			<Progress
				className="h-2 w-full"
				indicatorStyle={
					buttonStyles.backgroundColor
						? {
								backgroundColor: buttonStyles.backgroundColor,
							}
						: undefined
				}
				value={progress}
			/>
		</div>
	);
};
