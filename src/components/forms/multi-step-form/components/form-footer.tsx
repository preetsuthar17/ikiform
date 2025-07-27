// Libraries
import type React from 'react';
import { Link } from 'react-aria-components';
import { SocialMediaIcons } from '@/components/ui/social-media-icons';
import type { FormSchema } from '@/lib/database';

interface FormFooterProps {
  schema: FormSchema;
}

export const FormFooter: React.FC<FormFooterProps> = ({ schema }) => {
  return (
    <div className="flex flex-col gap-4 text-center">
      {schema.settings.branding?.socialMedia?.enabled &&
        schema.settings.branding.socialMedia.platforms &&
        (schema.settings.branding.socialMedia.position === 'footer' ||
          schema.settings.branding.socialMedia.position === 'both') && (
          <SocialMediaIcons
            className="justify-center"
            iconSize={schema.settings.branding.socialMedia.iconSize || 'md'}
            platforms={schema.settings.branding.socialMedia.platforms}
          />
        )}
      {Boolean(
        schema.settings.branding &&
          (schema.settings.branding as any).showIkiformBranding !== false
      ) && (
        <p className="text-muted-foreground text-sm">
          Powered by{' '}
          <span className="font-medium text-foreground underline">
            <Link href="https://www.ikiform.com">Ikiform</Link>
          </span>
        </p>
      )}
    </div>
  );
};
