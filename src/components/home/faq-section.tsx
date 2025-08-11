"use client";

import Link from "next/link";
import type React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: React.ReactNode;
}

const faqs = [
  {
    question: "What is Ikiform?",
    answer:
      "Ikiform is an open-source alternative to Google Forms. It helps you create beautiful, interactive forms easily.",
  },
  {
    question: "Why use Ikiform instead of Typeform or Google Forms?",
    answer:
      "Ikiform is open source and gives you full control over your data and branding. There are no hidden costs, and you can self-host for extra privacy and flexibility.",
  },
  {
    question: "What types of forms can I create?",
    answer:
      "You can create single-page forms and multi-step forms with progress tracking.",
  },
  {
    question: "What field types are supported?",
    answer:
      "Supported fields include text, email, textarea, radio, checkbox, number, select, slider, tags, and social fields.",
  },
  {
    question: "How does the AI Builder help?",
    answer:
      "The AI Builder can generate forms for you based on your prompt, making form creation faster.",
  },
  {
    question: "Can I analyze form results?",
    answer:
      "Yes, you get analytics like submission trends, field stats, and can export data as CSV or JSON.",
  },
  {
    question: "Can I customize my forms?",
    answer:
      "You can change colors, fonts, layout, add your logo, and control the look of each field.",
  },
  {
    question: "How is my data protected?",
    answer:
      "Forms can have password protection, rate limiting, profanity filters, and are GDPR compliant.",
  },
  {
    question: "Is Ikiform open source?",
    answer: (
      <>
        <p>
          Ikiform is completely open-source and available on{" "}
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
  {
    question: "Where can I suggest features?",
    answer: (
      <>
        <p>
          You can suggest any features at{" "}
          <Link className="underline" href="https://insigh.to/b/ikiform">
            Feature Board
          </Link>
        </p>
      </>
    ),
  },
  {
    question: "Is the data I submit shared with anyone?",
    answer:
      "No, your data is not sold or shared with third parties except trusted providers needed to run Ikiform.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "Your data is encrypted and securely stored in the EU using Supabase.",
  },
  {
    question: "How is my data kept safe?",
    answer:
      "We use strong security measures and only authorized staff can access your data.",
  },
  {
    question: "Will my data be deleted if I cancel my account?",
    answer:
      "Yes. You can delete your data anytime. Deleted data is removed from backups within 30 days.",
  },
  {
    question: "Can I access or delete my data?",
    answer:
      "Yes. You can request access or deletion of your data at any time by emailing hi@ikiform.com.",
  },
  {
    question: "Who owns the data collected through my forms?",
    answer: "You own all data you collect. Ikiform just stores it for you.",
  },
];

export default function FAQSection() {
  const firstHalf = faqs.slice(0, Math.ceil(faqs.length / 2));
  const secondHalf = faqs.slice(Math.ceil(faqs.length / 2));

  return (
    <section className="flex w-full flex-col items-center justify-center gap-12 px-4 py-12 text-center md:px-8 md:py-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-18">
        <div className="flex flex-col items-center gap-4 px-6">
          <h2 className="font-semibold text-3xl md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-xl text-md text-muted-foreground">
            Answers to common questions about Ikiform, features, and usage.
          </p>
        </div>
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-2 text-left lg:grid-cols-2">
          <FAQList faqs={firstHalf} />
          <FAQList faqs={secondHalf} />
        </div>
      </div>
    </section>
  );
}

const FAQList = ({ faqs }: { faqs: FAQ[] }) => {
  return (
    <div className="mx-auto flex w-full max-w-7xl grow flex-col gap-2 text-left">
      {faqs.map((faq, i) => (
        <Accordion
          className="my-0 w-full"
          collapsible
          key={i}
          type="single"
          variant="ghost"
        >
          <AccordionItem
            className="w-full rounded-lg bg-muted"
            value={String(i)}
          >
            <AccordionTrigger className="font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};
