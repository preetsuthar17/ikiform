interface ClipboardOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export async function copyToClipboard(
  text: string,
  options: ClipboardOptions = {}
): Promise<boolean> {
  const {
    showSuccessToast = false,
    showErrorToast = false,
    successMessage = "Copied to clipboard!",
    errorMessage = "Failed to copy to clipboard",
  } = options;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      if (document.hasFocus()) {
        await navigator.clipboard.writeText(text);
        if (showSuccessToast) {
          const { toast } = await import("@/hooks/use-toast");
          toast.success(successMessage);
        }
        return true;
      }

      window.focus();

      await new Promise((resolve) => setTimeout(resolve, 50));

      if (document.hasFocus()) {
        await navigator.clipboard.writeText(text);
        if (showSuccessToast) {
          const { toast } = await import("@/hooks/use-toast");
          toast.success(successMessage);
        }
        return true;
      }

      return fallbackCopyToClipboard(text, options);
    } catch (error) {
      console.warn(
        "Clipboard API failed, falling back to manual method:",
        error
      );
      return fallbackCopyToClipboard(text, options);
    }
  }

  return fallbackCopyToClipboard(text, options);
}

function fallbackCopyToClipboard(
  text: string,
  options: ClipboardOptions = {}
): boolean {
  const {
    showSuccessToast = false,
    showErrorToast = false,
    successMessage = "Copied to clipboard!",
    errorMessage = "Failed to copy to clipboard",
  } = options;

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    textarea.setAttribute("readonly", "");

    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, 99_999);

    const successful = document.execCommand("copy");

    document.body.removeChild(textarea);

    if (successful) {
      if (showSuccessToast) {
        import("@/hooks/use-toast").then(({ toast }) => {
          toast.success(successMessage);
        });
      }
      return true;
    }
    throw new Error("execCommand copy failed");
  } catch (error) {
    console.error("Fallback copy method failed:", error);
    if (showErrorToast) {
      import("@/hooks/use-toast").then(({ toast }) => {
        toast.error(errorMessage);
      });
    }
    return false;
  }
}

export function isClipboardSupported(): boolean {
  return !!(
    (navigator.clipboard && window.isSecureContext) ||
    document.queryCommandSupported?.("copy")
  );
}

export async function copyWithToast(
  text: string,
  successMessage?: string,
  errorMessage?: string
): Promise<boolean> {
  return copyToClipboard(text, {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage,
    errorMessage,
  });
}
