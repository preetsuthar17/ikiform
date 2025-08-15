import { notFound } from 'next/navigation';
import { formsDbServer } from '@/lib/database';
import PublicFormServerWrapper from './components/PublicFormServerWrapper';

interface PublicFormPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const form = await formsDbServer.getPublicForm(id);
    if (!form) return {};
    const title = form.schema?.settings?.title || form.title || 'Form';
    const description =
      form.schema?.settings?.description ||
      form.description ||
      'Fill out this form.';
    const identifier = form.slug || id;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.ikiform.com/f/${identifier}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch {
    return {};
  }
}

export default async function PublicFormPage({
  params,
  searchParams,
}: PublicFormPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const theme =
    typeof resolvedSearchParams?.theme === 'string'
      ? resolvedSearchParams.theme
      : undefined;

  try {
    const form = await formsDbServer.getPublicForm(id);

    if (!form) {
      notFound();
    }

    return (
      <PublicFormServerWrapper formId={id} schema={form.schema} theme={theme} />
    );
  } catch (error) {
    console.error('Error loading form:', error);
    notFound();
  }
}
