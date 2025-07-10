"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Link from "next/link";

const faqs = [
  {
    question: "What is Ikiform?",
    answer:
      "Ikiform is an open-source alternative to Typeform and Google Forms. It helps you create beautiful, interactive forms easily.",
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
];

export default function FAQSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="flex flex-col items-center justify-center gap-12 md:py-28 py-12 md:px-8 px-4 text-center w-full">
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-18">
        <div className="flex flex-col items-center gap-4 px-6">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Frequently Asked Questions
          </h2>
          <p className="text-md text-muted-foreground max-w-xl mx-auto">
            Answers to common questions about Ikiform, features, and usage.
          </p>
        </div>
        <div className="w-full max-w-7xl mx-auto flex flex-col  grow text-left">
          {faqs.map((faq, i) => (
            <Accordion
              type="single"
              collapsible
              defaultValue="0"
              className="w-full border-b my-0"
              variant={"ghost"}
              key={i}
            >
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`transition-all ${
                  hovered !== null && hovered !== i
                    ? "opacity-50 grayscale"
                    : "opacity-100"
                }`}
              >
                <AccordionItem value={String(i)} className="w-full">
                  <AccordionTrigger className="font-normal">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
