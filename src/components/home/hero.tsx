"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../ui/modal";
import DemoFormBuilder from "@/components/form-builder/form-builder/DemoFormBuilder";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Hero() {
  const { user } = useAuth();

  const [open, setOpen] = React.useState(false);

  return (
    <section className="flex flex-col gap-10 md:gap-16 md:pb-28 pb-16 w-full max-w-[75%] max-sm:max-w-[90%] mx-auto h-dvh my-12">
      <div className="flex flex-col gap-8 w-full h-full md:p-12 p-4 rounded-card relative  overflow-hidden">
        {/* Flipped Background Image */}
        <div
          className="absolute inset-0 rounded-card z-0"
          style={{
            backgroundImage: `url(/hero/bg.png)`,
            backgroundSize: "104%",
            backgroundPosition: "left",
            transform: "scaleX(-1)",
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/2 pointer-events-none rounded-card z-2" />

        {/* Content Container */}
        <div className="flex flex-col gap-6 items-start text-left z-20 text-white h-full grow">
          {/* Heading */}
          <h1 className="text-5xl max-[414px]:text-4xl md:text-6xl tracking-tight leading-tight text-white  max-w-4xl">
            Stop settling for expensive subscriptions and ugly forms
          </h1>

          {/* Description */}
          <p className="md:max-w-lg md:text-lg text-white">
            Ikiform is an open-source alternative to Typeform and Google Forms,
            designed to help you create beautiful forms effortlessly.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 items-center w-fit">
            {!user ? (
              <Button size="lg" className="font-medium h-[45px]" asChild>
                <Link href="/login">Create your first form</Link>
              </Button>
            ) : (
              <Button className="font-medium h-[45px]" size="lg" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
            <Button
              className="font-medium h-[45px] text-white"
              size="lg"
              variant="ghost"
              asChild
            >
              <Link href="/#pricing">Check out pricing</Link>
            </Button>
          </div>
          <div className="w-full my-12 h-full grow relative">
            <div
              className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/10 cursor-pointer transition-opacity hover:bg-foreground/20 rounded-card"
              onClick={() => setOpen(true)}
            >
              <span className="sr-only">Interactive demo</span>
            </div>
            <div className="w-full h-full">
              <DemoFormBuilder />
            </div>
            {/* Modal for interactive demo */}
            <Modal open={open} onOpenChange={setOpen}>
              <ModalContent className="max-w-[90%] w-full flex flex-col gap-6 z-99">
                <ModalHeader>
                  <ModalTitle>Interactive Demo</ModalTitle>
                </ModalHeader>
                <ScrollArea className="w-full h-[82dvh]">
                  <DemoFormBuilder />
                </ScrollArea>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
}
