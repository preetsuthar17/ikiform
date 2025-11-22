import { memo } from "react";
import type { FormsSidebarProps } from "../types";
import { FormStats } from "./FormStats";

export const FormsSidebar = memo(function FormsSidebar({
	forms,
	loading,
}: FormsSidebarProps) {
	return (
		<aside
			aria-label="Forms statistics sidebar"
			className="flex w-full flex-col"
			role="complementary"
		>
			<FormStats forms={forms} loading={loading} />
		</aside>
	);
});

export default FormsSidebar;
