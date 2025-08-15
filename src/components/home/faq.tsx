'use client';

import Link from 'next/link';
import type React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQ {
  question: string;
  answer: React.ReactNode;
}

const faqs = [
  {
    question: 'What is Ikiform?',
    answer:
      'Ikiform is an open-source alternative to Google Forms. It helps you create beautiful, interactive forms easily.',
  },
  {
    question: 'Why use Ikiform instead of google form or typeform?',
    answer:
      'Ikiform is open source and gives you full control over your data and branding. There are no hidden costs, and you can self-host for extra privacy and flexibility.',
  },
  {
    question: 'What types of forms can I create?',
    answer:
      'You can create single-page forms and multi-step forms with progress tracking.',
  },
  {
    question: 'What fields are supported?',
    answer:
      'Supported fields include text, email, textarea, radio, checkbox, number, select, slider, tags, and social fields.',
  },
  {
    question: 'How is my data protected?',
    answer:
      'Forms can have password protection, rate limiting, profanity filters, and are GDPR compliant.',
  },
  {
    question: 'Is the data I submit shared with anyone?',
    answer:
      'No, your data is not sold or shared with third parties except trusted providers needed to run Ikiform.',
  },
  {
    question: 'Can I customize my forms?',
    answer:
      'You can change colors, fonts, layout, add your logo, and control the look of each field.',
  },
  {
    question: 'Where can I suggest new features?',
    answer: (
      <>
        <p>
          You can suggest any features at{' '}
          <Link className="underline" href="https://insigh.to/b/ikiform">
            Feature Board
          </Link>
        </p>
      </>
    ),
  },
  {
    question: 'Where is my data stored?',
    answer:
      'Your data is encrypted and securely stored in the EU using Supabase.',
  },
  {
    question: 'How is my data kept safe?',
    answer:
      'We use strong security measures and only authorized staff can access your data.',
  },
  {
    question: 'Will my data be deleted if I cancel my account?',
    answer:
      'Yes. You can delete your data anytime. Deleted data is removed from backups within 30 days.',
  },
  {
    question: 'Can I delete my data?',
    answer:
      'Yes. You can request access or deletion of your data at any time by emailing hi@ikiform.com.',
  },
  {
    question: 'Who owns my form submission data?',
    answer: 'You own all data you collect. Ikiform just stores it for you.',
  },
  {
    question: 'Is Ikiform open-source?',
    answer: (
      <>
        <p>
          Ikiform is completely open-source and available on{' '}
          <Link
            className="underline"
            href="https://github.com/preetsuthar17/Ikiform"
          >
            GitHub
          </Link>
        </p>
      </>
    ),
  },
];

export default function FAQSection() {
  const firstHalf = faqs.slice(0, Math.ceil(faqs.length / 2));
  const secondHalf = faqs.slice(Math.ceil(faqs.length / 2));

  return (
    <section className="mx-auto w-full max-w-7xl bg-background">
      <div className="mx-auto flex w-full flex-col gap-18 px-4 md:px-8">
        {/* Header section */}
        <div className="flex flex-col gap-8 text-center">
          <p className="text-center text-base text-muted-foreground md:text-lg">
            Frequently Asked Questions{' '}
          </p>
          <h2 className="mx-auto max-w-2xl text-center font-dm-sans font-medium text-2xl text-foreground leading-normal tracking-tight md:text-3xl lg:text-4xl">
            Answers to common questions about Ikiform, features, and usage
          </h2>
        </div>
        {/* Rounded container matching the footer/CTA styling */}
        <div className="rounded-4xl bg-card p-8 md:p-12">
          <div className="flex flex-col items-center gap-12">
            {/* FAQ Grid */}
            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
              <FAQList faqs={firstHalf} />
              <FAQList faqs={secondHalf} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQList = ({ faqs }: { faqs: FAQ[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {faqs.map((faq, i) => (
        <Accordion
          className="w-full rounded-3xl border-none"
          collapsible
          key={i}
          type="single"
        >
          <AccordionItem
            className="w-full rounded-2xl border-none bg-background"
            value={String(i)}
          >
            <AccordionTrigger className="px-6 py-6 text-left font-medium text-foreground hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};
