import { toast as sonnerToast } from "sonner";

const toast = (message: string, data?: any) => {
  return sonnerToast(message, data);
};

toast.success = (message: string, data?: any) =>
  sonnerToast.success(message, data);
toast.error = (message: string, data?: any) => sonnerToast.error(message, data);
toast.warning = (message: string, data?: any) =>
  sonnerToast.warning(message, data);
toast.info = (message: string, data?: any) => sonnerToast.info(message, data);
toast.loading = (message: string, data?: any) =>
  sonnerToast.loading(message, data);
toast.dismiss = (id?: string | number) => sonnerToast.dismiss(id);

export { toast };
