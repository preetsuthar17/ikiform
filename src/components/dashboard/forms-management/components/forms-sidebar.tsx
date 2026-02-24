import { useTranslations } from "next-intl";
import { memo } from "react";
import type { FormsSidebarProps } from "../types";
import { FormStats } from "./form-stats";

export const FormsSidebar = memo(function FormsSidebar({
	forms,
	loading,
}: FormsSidebarProps) {
	const t = useTranslations("dashboard.formsManagement.stats");

	return (
		<aside
			aria-label={t("sidebarAria")}
			className="flex w-full flex-col"
			role="complementary"
		>
			<FormStats forms={forms} loading={loading} />
		</aside>
	);
});

export default FormsSidebar;
