import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { FieldSettingsProps } from "./types";

export function PollFieldSettings({
	field,
	onUpdateSettings,
	onFieldUpdate,
}: FieldSettingsProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.poll");
	const [newOption, setNewOption] = useState("");

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="poll-options">
						{t("pollOptions")}
					</Label>
					<div className="flex gap-2">
						<Input
							aria-describedby="poll-options-help"
							autoComplete="off"
							className="flex-1"
							id="poll-option-input"
							name="poll-option-input"
							onChange={(e) => setNewOption(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && newOption.trim()) {
									e.preventDefault();
									onUpdateSettings({
										pollOptions: [
											...(field.settings?.pollOptions || []),
											newOption.trim(),
										],
									});
									setNewOption("");
								} else if (e.key === "Escape") {
									e.currentTarget.blur();
								}
							}}
							placeholder={t("addOptionPlaceholder")}
							type="text"
							value={newOption || ""}
						/>
						<Button
							aria-label={t("addOptionAria")}
							className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
							disabled={!(newOption && newOption.trim())}
							onClick={() => {
								if (newOption && newOption.trim()) {
									onUpdateSettings({
										pollOptions: [
											...(field.settings?.pollOptions || []),
											newOption.trim(),
										],
									});
									setNewOption("");
								}
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									if (newOption && newOption.trim()) {
										onUpdateSettings({
											pollOptions: [
												...(field.settings?.pollOptions || []),
												newOption.trim(),
											],
										});
										setNewOption("");
									}
								}
							}}
							size="icon"
							type="button"
						>
							<Plus aria-hidden="true" className="size-4" />
						</Button>
					</div>
					<p className="text-muted-foreground text-xs" id="poll-options-help">
						{t("optionsHelp")}
					</p>
				</div>
				<div className="flex flex-col gap-1">
					{(field.settings?.pollOptions || []).map((option, idx) => (
						<div className="flex items-center gap-2" key={idx}>
							<Input
								aria-label={t("editOptionAria", { index: idx + 1 })}
								autoComplete="off"
								className="flex-1"
								name={`poll-option-${idx}`}
								onChange={(e) => {
									const updated = [...(field.settings?.pollOptions || [])];
									updated[idx] = e.target.value;
									onUpdateSettings({ pollOptions: updated });
								}}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								type="text"
								value={option}
							/>
							<Button
								aria-label={t("removeOptionAria", { index: idx + 1 })}
								className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
								onClick={() => {
									const updated = [...(field.settings?.pollOptions || [])];
									updated.splice(idx, 1);
									onUpdateSettings({ pollOptions: updated });
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										const updated = [...(field.settings?.pollOptions || [])];
										updated.splice(idx, 1);
										onUpdateSettings({ pollOptions: updated });
									}
								}}
								size="icon"
								type="button"
								variant="ghost"
							>
								<X aria-hidden="true" className="size-4" />
							</Button>
						</div>
					))}
				</div>
				<div
					aria-label={t("orAria")}
					className="relative my-4 flex items-center"
				>
					<div aria-hidden="true" className="h-px flex-1 bg-border" />
					<span className="mx-4 select-none whitespace-nowrap font-medium text-muted-foreground text-xs">
						{t("or")}
					</span>
					<div aria-hidden="true" className="h-px flex-1 bg-border" />
				</div>
				<div className="flex flex-col gap-4">
					<h3 className="font-medium text-card-foreground">
						{t("fetchFromApi")}
					</h3>
					<div className="flex flex-col gap-2">
						<Input
							aria-describedby="poll-api-help"
							autoComplete="off"
							id="poll-options-api"
							name="poll-options-api"
							onChange={(e) =>
								onFieldUpdate({ ...field, optionsApi: e.target.value })
							}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									e.currentTarget.blur();
								}
							}}
							placeholder={t("apiEndpointPlaceholder")}
							type="url"
							value={field.optionsApi || ""}
						/>
						<p className="text-muted-foreground text-xs" id="poll-api-help">
							{t("apiEndpointHelp")}
						</p>
					</div>
					<div className="flex gap-2">
						<div className="flex flex-1 flex-col gap-2">
							<Input
								aria-describedby="poll-value-key-help"
								autoComplete="off"
								id="poll-valueKey"
								name="poll-valueKey"
								onChange={(e) =>
									onFieldUpdate({ ...field, valueKey: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								placeholder={t("valueKeyPlaceholder")}
								type="text"
								value={field.valueKey || ""}
							/>
							<p
								className="text-muted-foreground text-xs"
								id="poll-value-key-help"
							>
								{t("valueKeyHelp")}
							</p>
						</div>
						<div className="flex flex-1 flex-col gap-2">
							<Input
								aria-describedby="poll-label-key-help"
								autoComplete="off"
								id="poll-labelKey"
								name="poll-labelKey"
								onChange={(e) =>
									onFieldUpdate({ ...field, labelKey: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								placeholder={t("labelKeyPlaceholder")}
								type="text"
								value={field.labelKey || ""}
							/>
							<p
								className="text-muted-foreground text-xs"
								id="poll-label-key-help"
							>
								{t("labelKeyHelp")}
							</p>
						</div>
					</div>
					{field.optionsApi && (
						<div
							aria-live="polite"
							className="rounded border border-blue-200 bg-blue-50 p-2 text-blue-900 text-xs"
							role="status"
						>
							<strong>{t("apiGuidanceTitle")}</strong> {t("apiGuidanceIntro")}
							<br />
							<span className="font-mono text-xs">{field.optionsApi}</span>
							<br />
							<span>
								{t("apiShouldReturn")}
								<ul className="mt-1 ml-6 list-disc">
									<li>
										<code>["Option 1", "Option 2", ...]</code> <em>{t("apiType1Hint")}</em>
									</li>
									<li>
										<code>[&#123; value: "opt1", label: "Option 1" &#125;, ...]</code>{" "}
										<em>{t("apiType2Hint")}</em>
									</li>
									<li>
										<code>&#123; options: [...] &#125;</code> <em>{t("apiType3Hint")}</em>
									</li>
									<li>
										<code>[&#123; id: "opt1", name: "Option 1" &#125;, ...]</code>{" "}
										<em>{t("apiType4Hint")}</em>
									</li>
								</ul>
								<span className="mt-1 block">
									{t("apiCustomKeysHelp")}
									<br />
									{t("apiValueLabelHelp")} <code>value</code> {t("apiValueLabelHelpOr")}{" "}
									<code>label</code> {t("apiValueLabelHelpSuffix")}
								</span>
							</span>
						</div>
					)}
				</div>
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1">
						<Label className="font-medium text-sm" htmlFor="poll-show-results">
							{t("showResults")}
						</Label>
						<p className="text-muted-foreground text-xs">
							{t("showResultsHelp")}
						</p>
					</div>
					<Switch
						aria-describedby="poll-show-results-help"
						checked={!!field.settings?.showResults}
						id="poll-show-results"
						name="poll-show-results"
						onCheckedChange={(checked) =>
							onUpdateSettings({ showResults: checked })
						}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
