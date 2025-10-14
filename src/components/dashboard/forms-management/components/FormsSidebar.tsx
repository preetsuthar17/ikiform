import type { FormsSidebarProps } from "../types";
import { FormStats } from "./FormStats";

export function FormsSidebar({ forms, loading }: FormsSidebarProps) {
  return (
    <div className="flex w-full flex-col">
      <FormStats forms={forms} loading={loading} />
    </div>
  );
}

export default FormsSidebar;
