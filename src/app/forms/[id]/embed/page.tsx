import { notFound } from "next/navigation";
import { PublicForm } from "@/components/forms/public-form";
import { formsDbServer } from "@/lib/database";

interface EmbedFormPageProps {
  params: { id: string };
}

export default async function EmbedFormPage({ params }: EmbedFormPageProps) {
  const { id } = params;

  try {
    const form = await formsDbServer.getPublicForm(id);
    if (!form) {
      notFound();
    }
    const searchParams =
      typeof window === "undefined"
        ? null
        : new URLSearchParams(window.location.search);
    const fit = searchParams?.get("fit");
    const width = searchParams?.get("width");
    const height = searchParams?.get("height");
    const padding = searchParams?.get("padding");

    // Style logic
    let style: React.CSSProperties = {
      maxWidth: width || "100%",
      margin: "0 auto",
      padding: padding ? Number(padding) : 0,
      borderRadius: 12,
      width: width || undefined,
      minHeight: height || 500,
      boxSizing: "border-box",
      overflow: "hidden",
      height: fit === "fit" && height ? height : undefined,
    };

    return (
      <>
        <div id="embeddable-form" style={style}>
          <PublicForm
            formId={form.id}
            schema={{
              ...form.schema,
              settings: {
                ...form.schema.settings,
                theme: {
                  ...(form.schema.settings.theme || {}),
                  colorScheme: searchParams?.get("theme") || "light",
                },
              },
            }}
          />
        </div>
        {/* Auto-resize script for fit/auto height mode */}
        {(fit === "fit" || height === "auto") && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                function postHeight() {
                  var h = document.body.scrollHeight;
                  if (document.getElementById('embeddable-form')) {
                    h = document.getElementById('embeddable-form').offsetHeight;
                  }
                  // Add a small buffer to avoid scrollbars
                  h = h + 2;
                  window.parent.postMessage({
                    ikiformEmbedHeight: h,
                    formId: '${form.id}'
                  }, '*');
                }
                window.addEventListener('load', postHeight);
                window.addEventListener('resize', postHeight);
                const observer = new MutationObserver(postHeight);
                observer.observe(document.body, { childList: true, subtree: true, attributes: true });
                setTimeout(postHeight, 200);
              `,
            }}
          />
        )}
      </>
    );
  } catch (error) {
    console.error("Error loading form:", error);
    notFound();
  }
}
