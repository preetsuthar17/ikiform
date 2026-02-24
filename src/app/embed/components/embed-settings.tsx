"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { EmbedConfig } from "./embed-customizer";

interface EmbedSettingsProps {
	config: EmbedConfig;
	updateConfig: (updates: Partial<EmbedConfig>) => void;
}

export default function EmbedSettings({
	config,
	updateConfig,
}: EmbedSettingsProps) {
	const t = useTranslations("product.embed.settings");
	return (
		<div className="flex flex-col gap-6">
			{}
			<div className="flex flex-col gap-3">
				<h3 className="font-medium text-sm">{t("dimensions.title")}</h3>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="flex flex-col gap-2">
						<Label>{t("dimensions.width")}</Label>
						<div className="flex gap-2">
							<Input
								className="flex-1"
								onChange={(e) => updateConfig({ width: e.target.value })}
								placeholder={t("dimensions.widthPlaceholder")}
								value={config.width}
							/>
							<Button
								onClick={() => updateConfig({ width: "100%" })}
								size="sm"
								variant="outline"
							>
								100%
							</Button>
							<Button
								onClick={() => updateConfig({ width: "800px" })}
								size="sm"
								variant="outline"
							>
								800px
							</Button>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label>{t("dimensions.height")}</Label>
						<div className="flex gap-2">
							<Input
								className="flex-1"
								onChange={(e) => updateConfig({ height: e.target.value })}
								placeholder={t("dimensions.heightPlaceholder")}
								value={config.height}
							/>
							<Button
								onClick={() => updateConfig({ height: "600px" })}
								size="sm"
								variant="outline"
							>
								600px
							</Button>
							<Button
								onClick={() => updateConfig({ height: "800px" })}
								size="sm"
								variant="outline"
							>
								800px
							</Button>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Switch
						checked={config.responsive}
						onCheckedChange={(checked) => updateConfig({ responsive: checked })}
					/>
					<Label>{t("dimensions.makeResponsive")}</Label>
				</div>
			</div>

			{}
			<div className="flex flex-col gap-3">
				<h3 className="font-medium text-sm">{t("appearance.title")}</h3>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="flex flex-col gap-2">
						<Label>{t("appearance.backgroundColor")}</Label>
						<div className="flex gap-2">
							<input
								className="h-10 w-12 cursor-pointer rounded-xl border border-border"
								onChange={(e) =>
									updateConfig({ backgroundColor: e.target.value })
								}
								type="color"
								value={config.backgroundColor}
							/>
							<Input
								className="flex-1"
								onChange={(e) =>
									updateConfig({ backgroundColor: e.target.value })
								}
								placeholder="#ffffff"
								value={config.backgroundColor}
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Switch
						checked={config.allowTransparency}
						onCheckedChange={(checked) =>
							updateConfig({ allowTransparency: checked })
						}
					/>
					<Label>
						{t("appearance.allowTransparentBackground")}
					</Label>
				</div>
			</div>

			{}
			<div className="flex flex-col gap-3">
				<h3 className="font-medium text-sm">{t("border.title")}</h3>

				<div className="flex items-center gap-2">
					<Switch
						checked={config.showBorder}
						onCheckedChange={(checked) => updateConfig({ showBorder: checked })}
					/>
					<Label>{t("border.showBorder")}</Label>
				</div>

				{config.showBorder && (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						<div className="flex flex-col gap-2">
							<Label>{t("border.borderColor")}</Label>
							<div className="flex gap-2">
								<input
									className="h-10 w-12 cursor-pointer rounded-xl border border-border"
									onChange={(e) =>
										updateConfig({ borderColor: e.target.value })
									}
									type="color"
									value={config.borderColor}
								/>
								<Input
									className="flex-1"
									onChange={(e) =>
										updateConfig({ borderColor: e.target.value })
									}
									placeholder="#e5e7eb"
									value={config.borderColor}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<Label>{t("border.borderWidth")}</Label>
							<Input
								max="10"
								min="0"
								onChange={(e) =>
									updateConfig({
										borderWidth: Number.parseInt(e.target.value) || 0,
									})
								}
								type="number"
								value={config.borderWidth.toString()}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label>{t("border.borderRadius")}</Label>
							<Input
								max="50"
								min="0"
								onChange={(e) =>
									updateConfig({
										borderRadius: Number.parseInt(e.target.value) || 0,
									})
								}
								type="number"
								value={config.borderRadius.toString()}
							/>
						</div>
					</div>
				)}

				<div className="flex flex-col gap-2">
					<Label>{t("border.padding")}</Label>
					<Input
						className="w-full md:w-32"
						max="100"
						min="0"
						onChange={(e) =>
							updateConfig({ padding: Number.parseInt(e.target.value) || 0 })
						}
						type="number"
						value={config.padding.toString()}
					/>
					<p className="text-muted-foreground text-xs">
						{t("border.paddingHelp")}
					</p>
				</div>
			</div>

			{}
			<div className="flex flex-col gap-3">
				<h3 className="font-medium text-sm">{t("performance.title")}</h3>
				<div className="flex flex-col gap-2">
					<Label>{t("performance.loadingMode")}</Label>
					<Select
						onValueChange={(value) =>
							updateConfig({ loadingMode: value as "eager" | "lazy" })
						}
						value={config.loadingMode}
					>
						<SelectTrigger>
							<SelectValue placeholder={t("performance.loadingModePlaceholder")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="lazy">{t("performance.lazy")}</SelectItem>
							<SelectItem value="eager">{t("performance.eager")}</SelectItem>
						</SelectContent>
					</Select>
					<p className="text-muted-foreground text-xs">
						{t("performance.help")}
					</p>
				</div>
			</div>
		</div>
	);
}
