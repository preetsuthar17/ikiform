// Libraries
import React from "react";
import { Link } from "react-aria-components";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";
import type { FormSchema } from "@/lib/database";

interface FormFooterProps {
  schema: FormSchema;
}

export const FormFooter: React.FC<FormFooterProps> = ({ schema }) => {
  return (
    <div className="text-center space-y-4">
      {schema.settings.branding?.socialMedia?.enabled &&
        schema.settings.branding.socialMedia.platforms &&
        (schema.settings.branding.socialMedia.position === "footer" ||
          schema.settings.branding.socialMedia.position === "both") && (
          <SocialMediaIcons
            platforms={schema.settings.branding.socialMedia.platforms}
            iconSize={schema.settings.branding.socialMedia.iconSize || "md"}
            className="justify-center"
          />
        )}
      {Boolean(
        schema.settings.branding &&
          (schema.settings.branding as any).showIkiformBranding !== false
      ) && (
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <span className="font-medium underline text-foreground">
            <Link href="https://ikiform.com">Ikiform</Link>
          </span>
        </p>
      )}
    </div>
  );
};
