"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../ui/modal";
import DemoFormBuilder from "@/components/form-builder/form-builder/DemoFormBuilder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OptimizedImage } from "../other/optimized-image";
import { Play } from "lucide-react";

export default function Hero() {
  const { user } = useAuth();

  const [open, setOpen] = React.useState(false);
  const [videoOpen, setVideoOpen] = React.useState(false);

  return (
    <section className="flex flex-col gap-10 md:gap-16 md:pb-28 pb-16 w-full max-w-[75%] max-sm:max-w-[90%] mx-auto h-dvh my-12">
      <div className="flex flex-col gap-8 w-full h-full md:p-12 p-8 rounded-card relative  overflow-hidden">
        {/* Flipped Background Image */}
        <OptimizedImage
          src="https://av5on64jc4.ufs.sh/f/jYAIyA6pXignqJWGPAydcGjOVJB5FWLa3M9CXA0uUgsZ48yo"
          alt="Hero background"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover rounded-card z-0"
          style={{ transform: "scaleX(-1)" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none rounded-card z-2 backdrop-blur-[1px]" />

        {/* Content Container */}
        <div className="flex flex-col gap-6 items-center text-center  z-20 text-white h-full grow py-6 ">
          {/* Heading */}
          <h1 className="text-5xl max-[414px]:text-4xl md:text-7xl tracking-tight leading-tight text-white font-medium">
            Forms that are affordable and beautiful
          </h1>

          {/* Description */}
          <p className="md:text-lg text-white">
            Ikiform is an open-source alternative to Google Forms, designed to
            help you create beautiful forms effortlessly.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 items-center justify-center w-fit">
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
              onClick={() => setOpen(true)}
            >
              Try Demo
            </Button>
          </div>
          <div className="w-full my-12 h-full grow relative">
            <div className="w-full h-full">
              <div className="w-full h-full relative">
                <video
                  className="w-full h-full object-cover rounded-card"
                  muted
                  loop
                  playsInline
                  poster="https://av5on64jc4.ufs.sh/f/jYAIyA6pXignGqQATXK0tHoJKUbaeVrBSA5DZGMjxyd1qTkn"
                >
                  <source
                    src="https://av5on64jc4.ufs.sh/f/jYAIyA6pXignfWh6w6a3obyWxJCaFlVO6zhMk0rpTSDi5EQf"
                    type="video/mp4"
                  />
                </video>
                <div
                  className="absolute inset-0 z-5 flex items-center justify-center bg-foreground/10 cursor-pointer transition-opacity hover:bg-foreground/20 rounded-card"
                  onClick={() => setVideoOpen(true)}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-card">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            </div>
            {/* Modal for demo options */}
            <Modal open={open} onOpenChange={setOpen}>
              <ModalContent className="max-w-xs w-full flex flex-col gap-6 z-50 items-center justify-center">
                <ModalHeader>
                  <ModalTitle>Choose a Demo</ModalTitle>
                </ModalHeader>
                <div className="flex flex-col gap-4 w-full items-center">
                  <Button
                    size="lg"
                    className="w-full max-w-xs font-medium"
                    asChild
                  >
                    <Link href="/demo-form-builder">Form Builder Demo</Link>
                  </Button>
                  <Button
                    size="lg"
                    className="w-full max-w-xs font-medium"
                    asChild
                  >
                    <Link
                      href="https://www.ikiform.com/forms/a2675039-5901-4052-88c0-b60977d3d048"
                      target="_blank"
                    >
                      Form Demo
                    </Link>
                  </Button>
                </div>
              </ModalContent>
            </Modal>
            {/* Modal for video demo */}
            <Modal open={videoOpen} onOpenChange={setVideoOpen}>
              <ModalContent className="max-w-[90%] aspect-video w-full flex flex-col gap-6 z-50">
                <ModalHeader className="sr-only">
                  <ModalTitle>Demo Video</ModalTitle>
                </ModalHeader>
                <div className="w-full aspect-video">
                  <video
                    className="w-full h-full object-cover rounded-card"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="https://av5on64jc4.ufs.sh/f/jYAIyA6pXignqJWGPAydcGjOVJB5FWLa3M9CXA0uUgsZ48yo"
                  >
                    <source
                      src="https://av5on64jc4.ufs.sh/f/jYAIyA6pXignfWh6w6a3obyWxJCaFlVO6zhMk0rpTSDi5EQf"
                      type="video/mp4"
                    />
                  </video>
                </div>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
}
