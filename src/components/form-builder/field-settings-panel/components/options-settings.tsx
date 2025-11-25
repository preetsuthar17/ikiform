import { Plus, X } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { OptionsSettingsProps } from "../types";

import { createFieldUpdater, createOptionHandlers } from "../utils";

export const OptionsSettings: React.FC<OptionsSettingsProps> = ({
	field,
	onFieldUpdate,
}) => {
	const { updateField } = createFieldUpdater(field, onFieldUpdate);
	const { addOption, updateOption, removeOption } = createOptionHandlers(
		field,
		updateField,
	);

	const {
		sanitizeOptions,
	} = require("@/components/form-builder/form-field-renderer/utils/sanitizeOptions");

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-lg">
						Options
					</CardTitle>
					<Button
						aria-label="Add new option"
						className="flex gap-2"
						onClick={addOption}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								addOption();
							}
						}}
						size="sm"
						variant="outline"
					>
						<Plus aria-hidden="true" className="size-4" />
						Add Option
					</Button>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					{sanitizeOptions(field.options || []).map(
						(option: any, index: number) => {
							let value = "";
							if (typeof option === "string") {
								value = option;
							} else if (
								option &&
								typeof option === "object" &&
								"value" in option
							) {
								value = option.value;
							}
							return (
								<div className="flex items-center gap-2" key={index}>
									<Input
										aria-describedby={`option-${index}-help`}
										autoComplete="off"
										id={`option-${index}`}
										name={`option-${index}`}
										onChange={(e) => updateOption(index, e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Escape") {
												e.currentTarget.blur();
											}
										}}
										placeholder={`Option ${index + 1}`}
										type="text"
										value={value}
									/>
									<Button
										aria-label={`Remove option ${index + 1}`}
										className="flex gap-2"
										onClick={() => removeOption(index)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												removeOption(index);
											}
										}}
										size="icon"
										variant="destructive"
									>
										<X aria-hidden="true" className="size-4" />
									</Button>
								</div>
							);
						},
					)}
					{(field.options || []).length === 0 && (
						<p
							aria-live="polite"
							className="text-muted-foreground text-sm"
							role="status"
						>
							No options added yet
						</p>
					)}
				</div>
				<div className="flex items-center gap-2 py-2">
					<div aria-hidden="true" className="h-px flex-1 bg-muted" />
					<span
						aria-label="or"
						className="select-none px-2 font-semibold text-muted-foreground text-xs"
					>
						OR
					</span>
					<div aria-hidden="true" className="h-px flex-1 bg-muted" />
				</div>
				<div className="flex flex-col gap-4">
					<h3 className="font-medium text-card-foreground">Fetch from API</h3>
					<div className="flex flex-col gap-2">
						<Input
							aria-describedby="options-api-help"
							autoComplete="off"
							id="optionsApi"
							name="optionsApi"
							onChange={(e) => updateField({ optionsApi: e.target.value })}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									e.currentTarget.blur();
								}
							}}
							placeholder="https://your-api.com/options"
							type="url"
							value={field.optionsApi || ""}
						/>
						<p className="text-muted-foreground text-xs" id="options-api-help">
							API endpoint to fetch options from
						</p>
					</div>
					<div className="flex gap-2">
						<div className="flex flex-1 flex-col gap-2">
							<Input
								aria-describedby="value-key-help"
								autoComplete="off"
								id="valueKey"
								name="valueKey"
								onChange={(e) => updateField({ valueKey: e.target.value })}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								placeholder="Value key (e.g. id)"
								type="text"
								value={field.valueKey || ""}
							/>
							<p className="text-muted-foreground text-xs" id="value-key-help">
								Key for option values
							</p>
						</div>
						<div className="flex flex-1 flex-col gap-2">
							<Input
								aria-describedby="label-key-help"
								autoComplete="off"
								id="labelKey"
								name="labelKey"
								onChange={(e) => updateField({ labelKey: e.target.value })}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								placeholder="Label key (e.g. name)"
								type="text"
								value={field.labelKey || ""}
							/>
							<p className="text-muted-foreground text-xs" id="label-key-help">
								Key for option labels
							</p>
						</div>
					</div>
					{field.optionsApi && (
						<div
							aria-live="polite"
							className="flex flex-col gap-2 rounded border border-blue-200 bg-blue-50 p-2 text-blue-900 text-xs"
							role="status"
						>
							<strong>API Data Guidance:</strong> This field will fetch options
							from the API endpoint:
							<span className="font-mono text-xs">{field.optionsApi}</span>
							<span>
								The API should return either:
								<ul className="ml-6 list-disc">
									<li>
										<code>["Option 1", "Option 2", ...]</code>{" "}
										<em>(array of strings)</em>
									</li>
									<li>
										<code>
											[&#123; value: "opt1", label: "Option 1" &#125;, ...]
										</code>{" "}
										<em>(array of objects)</em>
									</li>
									<li>
										<code>&#123; options: [...] &#125;</code>{" "}
										<em>(object with options array)</em>
									</li>
									<li>
										<code>
											[&#123; id: "opt1", name: "Option 1" &#125;, ...]
										</code>{" "}
										<em>(custom keys)</em>
									</li>
								</ul>
								<span>
									You can specify custom keys above to map your API data.
									<br />
									Each option must have a <code>value</code> property (or your
									custom key). <code>label</code> is optional.
								</span>
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
