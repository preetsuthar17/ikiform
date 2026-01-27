import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { BaseFieldProps } from "../types";

import { sanitizeOptions } from "../utils/sanitizeOptions";

export function PollField({
	field,
	value,
	onChange,
	error,
	fieldRef,
	disabled,
}: BaseFieldProps) {
	const [apiOptions, setApiOptions] = React.useState<Array<
		string | { value: string; label?: string }
	> | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [fetchError, setFetchError] = React.useState<string | null>(null);

	const fetchPollOptions = async () => {
		if (!field.optionsApi) {
			setApiOptions(null);
			return;
		}

		setIsLoading(true);
		setFetchError(null);

		try {
			const response = await fetch(field.optionsApi);
			const data = await response.json();

			let options: Array<any> = [];
			if (Array.isArray(data)) {
				options = data;
			} else if (Array.isArray(data.options)) {
				options = data.options;
			}

			if (field.valueKey || field.labelKey) {
				options = options.map((item: any) => ({
					value: field.valueKey ? item[field.valueKey] : item.value,
					label: field.labelKey
						? item[field.labelKey]
						: item.label || item.value,
				}));
			}

			setApiOptions(sanitizeOptions(options));
		} catch (error) {
			setFetchError("Failed to fetch options");
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		fetchPollOptions();
	}, [field.optionsApi, field.valueKey ?? "", field.labelKey ?? ""]);

	const getPollOptions = () => apiOptions ?? field.settings?.pollOptions ?? [];

	const getShowResults = () => !!field.settings?.showResults;

	const getOptionValue = (
		option: string | { value: string; label?: string }
	): string => (typeof option === "string" ? option : option.value);

	const getOptionLabel = (
		option: string | { value: string; label?: string }
	): string =>
		typeof option === "string" ? option : option.label || option.value;

	const generateFakeResults = () => {
		const options = getPollOptions();
		return options.map((opt) => ({
			label: getOptionLabel(opt),
			votes: Math.floor(Math.random() * 20),
		}));
	};

	const getTotalVotes = () => {
		const fakeResults = generateFakeResults();
		return fakeResults.reduce((sum, result) => sum + result.votes, 0);
	};

	const handleValueChange = (newValue: string) => {
		onChange(newValue);
	};

	const renderPollOptions = () => {
		const options = getPollOptions();

		return (
			<Card className="border-0 p-0 shadow-none">
				<CardContent className="p-0">
					<RadioGroup
						className="flex flex-col gap-2"
						disabled={disabled || isLoading}
						onValueChange={handleValueChange}
						value={value || ""}
					>
						{fetchError && (
							<div
								className="rounded-md bg-destructive/10 p-3 text-destructive text-sm"
								role="alert"
							>
								{fetchError}
							</div>
						)}
						{options.map((option, index) => {
							const optionValue = getOptionValue(option);
							const optionLabel = getOptionLabel(option);

							return (
								<div
									className="flex items-center gap-2 rounded-md border border-border px-3 transition-colors hover:bg-accent/50"
									key={index}
								>
									<RadioGroupItem
										className="mt-0"
										disabled={disabled || isLoading}
										id={`${field.id}-${index}`}
										value={optionValue}
									/>
									<Label
										className="h-12 flex-1 cursor-pointer font-medium text-sm"
										htmlFor={`${field.id}-${index}`}
									>
										{optionLabel}
									</Label>
								</div>
							);
						})}
					</RadioGroup>
				</CardContent>
			</Card>
		);
	};

	const renderPollResults = () => {
		if (!getShowResults()) return null;

		const fakeResults = generateFakeResults();
		const totalVotes = getTotalVotes();

		return (
			<Card className="mt-4 border-0 bg-muted/30 shadow-none">
				<CardContent className="p-4">
					<div className="mb-4 flex items-center justify-between">
						<h4 className="font-semibold text-sm">Poll Results</h4>
						<Badge className="text-xs" variant="secondary">
							{totalVotes} total votes
						</Badge>
					</div>
					<div className="flex flex-col gap-4">
						{fakeResults.map((result, index) => {
							const percentage =
								totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0;

							return (
								<div className="flex flex-col gap-2" key={index}>
									<div className="flex items-center justify-between">
										<span className="font-medium text-sm">{result.label}</span>
										<div className="flex items-center gap-2">
											<span className="text-muted-foreground text-sm">
												{result.votes} votes
											</span>
											<Badge className="text-xs" variant="outline">
												{percentage.toFixed(1)}%
											</Badge>
										</div>
									</div>
									<Progress className="h-2" value={percentage} />
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className="flex flex-col gap-3">
			{renderPollOptions()}
			{renderPollResults()}
		</div>
	);
}
