"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
          <Link className="underline" href="https://github.com">
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="faq"
      className="flex flex-col items-center justify-center gap-16 md:py-28 py-12 md:px-8 px-4 text-center w-full"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-start text-left max-[1024px]:text-center max-[1024px]:items-center max-[1024px]:justify-center">
          <div
            className={`flex flex-col gap-6 ${
              isMobile
                ? "text-center lg:text-left relative"
                : "sticky top-8 h-fit"
            }`}
          >
            <Badge
              variant="secondary"
              className="px-4 py-2 w-fit max-[1024px]:mx-auto"
            >
              FAQ
            </Badge>
            <h2 className="text-3xl font-medium">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-md max-[1024px]:text-center max-[1024px]:items-center max-[1024px]:justify-center max-[1024px]:max-w-full">
              Answers to common questions about Ikiform, features, and usage.
            </p>
          </div>
          <div className="max-w-lg mx-auto lg:mx-0 w-full flex flex-col gap-6">
            <Card className="text-left p-0 border-0 bg-transparent shadow-md/3">
              <Accordion type="single" collapsible defaultValue="0">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={String(i)}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
