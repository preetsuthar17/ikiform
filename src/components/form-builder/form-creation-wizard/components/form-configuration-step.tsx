import type React from "react";
import { useTranslations } from "next-intl";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { FormConfigurationStepProps } from "../types";

export const FormConfigurationStep: React.FC<FormConfigurationStepProps> = ({
	configuration,
	onConfigurationChange,
}) => {
	const t = useTranslations("product.formBuilder.creation.configuration");

	return (
		<div className="flex flex-col gap-6">
			<Card className="shadow-none">
				<CardHeader className="[.border-b]:border-border">
					<CardTitle className="text-base">{t("title")}</CardTitle>
					<CardDescription>{t("description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="form-title">
								{t("internalTitle")} <span aria-hidden>*</span>
							</Label>
							<Input
								aria-describedby="form-title-help"
								autoCapitalize="sentences"
								autoComplete="off"
								className="w-full text-sm"
								id="form-title"
								inputMode="text"
								name="internal-title"
								onBlur={(e) => onConfigurationChange({ title: e.target.value })}
								onChange={(e) => onConfigurationChange({ title: e.target.value })}
								placeholder={t("internalTitlePlaceholder")}
								required
								spellCheck={false}
								value={configuration.title}
							/>
							<p className="text-muted-foreground text-xs" id="form-title-help">
								{t("internalTitleHelp")}
							</p>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="form-public-title">{t("publicTitle")}</Label>
							<Input
								aria-describedby="form-public-title-help"
								autoCapitalize="sentences"
								className="w-full text-sm"
								id="form-public-title"
								inputMode="text"
								name="public-title"
								onBlur={(e) =>
									onConfigurationChange({ publicTitle: e.target.value })
								}
								onChange={(e) =>
									onConfigurationChange({ publicTitle: e.target.value })
								}
								placeholder={t("publicTitlePlaceholder")}
								value={configuration.publicTitle || ""}
							/>
							<p
								className="text-muted-foreground text-xs"
								id="form-public-title-help"
							>
								{t("publicTitleHelp")}
							</p>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="form-description">{t("formDescription")}</Label>
							<Textarea
								aria-describedby="form-description-help"
								className="min-h-[100px] w-full text-sm"
								id="form-description"
								inputMode="text"
								name="form-description"
								onBlur={(e) =>
									onConfigurationChange({ description: e.target.value })
								}
								onChange={(e) =>
									onConfigurationChange({ description: e.target.value })
								}
								placeholder={t("formDescriptionPlaceholder")}
								rows={4}
								value={configuration.description}
							/>
							<p
								className="text-muted-foreground text-xs"
								id="form-description-help"
							>
								{t("formDescriptionHelp")}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
