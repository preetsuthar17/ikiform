/**
 * Robust clipboard utility that handles document focus issues and provides fallbacks
 */

interface ClipboardOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Copy text to clipboard with proper fallbacks for when document is not focused
 */
export async function copyToClipboard(
  text: string,
  options: ClipboardOptions = {}
): Promise<boolean> {
  const {
    showSuccessToast = false,
    showErrorToast = false,
    successMessage = 'Copied to clipboard!',
    errorMessage = 'Failed to copy to clipboard',
  } = options;

  // First try the modern Clipboard API if available and secure context
  if (navigator.clipboard && window.isSecureContext) {
    try {
      // Check if document is focused
      if (document.hasFocus()) {
        await navigator.clipboard.writeText(text);
        if (showSuccessToast) {
          const { toast } = await import('@/hooks/use-toast');
          toast.success(successMessage);
        }
        return true;
      }
      // Document is not focused, try to focus it first
      window.focus();

      // Wait a brief moment for focus to take effect
      await new Promise((resolve) => setTimeout(resolve, 50));

      if (document.hasFocus()) {
        await navigator.clipboard.writeText(text);
        if (showSuccessToast) {
          const { toast } = await import('@/hooks/use-toast');
          toast.success(successMessage);
        }
        return true;
      }
      // Still not focused, fall back to the manual method
      return fallbackCopyToClipboard(text, options);
    } catch (error) {
      console.warn(
        'Clipboard API failed, falling back to manual method:',
        error
      );
      return fallbackCopyToClipboard(text, options);
    }
  }

  // Fallback for browsers without Clipboard API or insecure contexts
  return fallbackCopyToClipboard(text, options);
}

/**
 * Fallback method using execCommand and temporary textarea
 */
function fallbackCopyToClipboard(
  text: string,
  options: ClipboardOptions = {}
): boolean {
  const {
    showSuccessToast = false,
    showErrorToast = false,
    successMessage = 'Copied to clipboard!',
    errorMessage = 'Failed to copy to clipboard',
  } = options;

  try {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Position it off-screen
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    textarea.setAttribute('readonly', '');

    // Add to DOM
    document.body.appendChild(textarea);

    // Select and copy
    textarea.select();
    textarea.setSelectionRange(0, 99_999); // For mobile devices

    const successful = document.execCommand('copy');

    // Clean up
    document.body.removeChild(textarea);

    if (successful) {
      if (showSuccessToast) {
        import('@/hooks/use-toast').then(({ toast }) => {
          toast.success(successMessage);
        });
      }
      return true;
    }
    throw new Error('execCommand copy failed');
  } catch (error) {
    console.error('Fallback copy method failed:', error);
    if (showErrorToast) {
      import('@/hooks/use-toast').then(({ toast }) => {
        toast.error(errorMessage);
      });
    }
    return false;
  }
}

/**
 * Check if clipboard functionality is available
 */
export function isClipboardSupported(): boolean {
  return !!(
    (navigator.clipboard && window.isSecureContext) ||
    document.queryCommandSupported?.('copy')
  );
}

/**
 * Copy text with automatic toast notifications
 */
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
