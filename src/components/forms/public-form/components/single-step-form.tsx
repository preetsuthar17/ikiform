// Libraries

import Link from 'next/link';
import type React from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
// UI Components
import { Progress } from '@/components/ui/progress';
import { SocialMediaIcons } from '@/components/ui/social-media-icons';
import { getFormLayoutClasses } from '@/lib/utils/form-layout';
// Hooks
import { useSingleStepForm } from '../hooks/use-single-step-form';
// Types
import type { PublicFormProps } from '../types';

// Utilities
import { getAllFields } from '../utils/form-utils';
import { PasswordProtectionModal } from './PasswordProtectionModal';
import { SingleStepFormContent } from './single-step-form-content';
import { SingleStepSuccessScreen } from './single-step-success-screen';

export const SingleStepForm: React.FC<PublicFormProps & { dir?: string }> = ({
  formId,
  schema,
  dir,
}) => {
  const fields = getAllFields(schema);
  const {
    formData,
    errors,
    submitting,
    submitted,
    handleFieldValueChange,
    handleSubmit,
    fieldVisibility,
    logicMessages,
  } = useSingleStepForm(formId, schema, fields);

  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const { containerClass, marginClass } = getFormLayoutClasses(schema);

  useEffect(() => {
    const passwordProtection = schema.settings.passwordProtection;
    if (passwordProtection?.enabled && passwordProtection?.password) {
      setIsPasswordProtected(true);
      setShowPasswordModal(true);
    }
  }, [schema.settings.passwordProtection]);

  const handlePasswordSubmit = (password: string) => {
    const expectedPassword = schema.settings.passwordProtection?.password;
    if (password === expectedPassword) {
      setPasswordVerified(true);
      setShowPasswordModal(false);
    } else {
      toast.error('Incorrect password!');
    }
  };

  const handlePasswordCancel = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowForm(true);
    }, 1500);

    return () => clearTimeout(timer);
  });

  if (submitted) {
    return <SingleStepSuccessScreen schema={schema} />;
  }

  if (isPasswordProtected && !passwordVerified) {
    return (
      <PasswordProtectionModal
        isOpen={showPasswordModal}
        message={
          schema.settings.passwordProtection?.message ||
          'This form is password protected. Please enter the password to continue.'
        }
        onCancel={handlePasswordCancel}
        onPasswordSubmit={handlePasswordSubmit}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Progress className="w-[200px]" size="sm" value={100} />
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-center bg-background transition-opacity duration-500 ${showForm ? 'opacity-100' : 'opacity-0'} ${marginClass}`}
      dir={dir}
    >
      <div className={`flex w-full flex-col gap-8 ${containerClass}`}>
        <SingleStepFormContent
          errors={errors}
          fields={fields}
          fieldVisibility={fieldVisibility}
          formData={formData}
          logicMessages={logicMessages}
          onFieldValueChange={handleFieldValueChange}
          onSubmit={handleSubmit}
          schema={schema}
          submitting={submitting}
        />

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
      </div>
    </div>
  );
};
