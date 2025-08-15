'use client';

import { Play } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';
import { Chip } from '../ui/chip';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '../ui/modal';

export default function Hero() {
  const { user } = useAuth();

  const [open, setOpen] = React.useState(false);
  const [videoOpen, setVideoOpen] = React.useState(false);

  return (
    <section className="mx-auto flex w-full max-w-[75%] flex-col gap-10 max-sm:max-w-[90%] md:gap-16">
      <div className="relative flex h-full w-full flex-col gap-8 rounded-card p-8 md:p-12">
        {}
        <div className="z-20 flex h-full grow flex-col items-center gap-6 py-6 text-center">
          <Chip className="rounded-full" variant={'secondary'}>
            <Link
              className="flex items-center justify-center gap-2"
              href="https://vercel.com/open-source-program?utm_source=ikiform"
              target="_blank"
            >
              Sponsored by
              <span className="flex items-center justify-center gap-2">
                <svg
                  aria-label="Vercel logo"
                  height="13"
                  strokeLinejoin="round"
                  viewBox="0 0 16 16"
                  width="13"
                >
                  <path
                    clipRule="evenodd"
                    d="M8 1L16 15H0L8 1Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
                Vercel OSS
              </span>
            </Link>
          </Chip>
          {}
          <h1 className="font-medium text-5xl leading-tight tracking-tight max-[414px]:text-4xl md:text-6xl">
            Forms that are affordable and beautiful
          </h1>

          {}
          <p className="md:text-lg">
            Ikiform is an open-source alternative to Google Forms, designed to
            help you create beautiful forms effortlessly.
          </p>

          {}
          <div className="flex w-fit flex-wrap items-center justify-center gap-3">
            {user ? (
              <Button asChild className="h-[45px] font-medium" size="lg">
                <Link href="/dashboard">
                  Go to Dashboard{' '}
                  <svg
                    height="1em"
                    viewBox="0 0 24 24"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01"
                      fill="currentColor"
                    />
                  </svg>
                </Link>
              </Button>
            ) : (
              <Button asChild className="h-[45px] font-medium" size="lg">
                <Link href="/login">Create your first form</Link>
              </Button>
            )}

            <Button
              className="h-[45px] font-medium underline"
              onClick={() => setOpen(true)}
              size="lg"
              variant="link"
            >
              Demo{' '}
              <svg height="1em" viewBox="0 0 24 24" width="1em">
                <path
                  d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13a.996.996 0 1 0 1.41 1.41L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </div>
          <div className="relative my-12 h-full w-full grow">
            <div className="h-full w-full">
              <div className="relative h-full w-full">
                <video
                  className="h-full w-full rounded-card object-cover"
                  loop
                  muted
                  playsInline
                  poster="https://av5on64jc4.ufs.sh/f/jYAIyA6pXignGqQATXK0tHoJKUbaeVrBSA5DZGMjxyd1qTkn"
                >
                  <source
                    src="https://av5on64jc4.ufs.sh/f/jYAIyA6pXignfWh6w6a3obyWxJCaFlVO6zhMk0rpTSDi5EQf"
                    type="video/mp4"
                  />
                </video>
                <div
                  className="absolute inset-0 z-5 flex cursor-pointer items-center justify-center rounded-card bg-foreground/10 transition-opacity hover:bg-foreground/20"
                  onClick={() => setVideoOpen(true)}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-card bg-white/20 backdrop-blur-sm">
                    <Play className="ml-1 h-8 w-8 text-white" fill="white" />
                  </div>
                </div>
              </div>
            </div>
            {}
            <Modal onOpenChange={setOpen} open={open}>
              <ModalContent className="z-50 flex w-full max-w-xs flex-col items-center justify-center gap-6">
                <ModalHeader>
                  <ModalTitle>Choose a Demo</ModalTitle>
                </ModalHeader>
                <div className="flex w-full flex-col items-center gap-4">
                  <Button
                    asChild
                    className="w-full max-w-xs font-medium"
                    size="lg"
                  >
                    <Link href="/demo-form-builder">Form Builder Demo</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full max-w-xs font-medium"
                    size="lg"
                  >
                    <Link
                      href="/f/24ec3d8d-40ef-4143-b289-4e43c112d80e"
                      target="_blank"
                    >
                      Form Demo
                    </Link>
                  </Button>
                </div>
              </ModalContent>
            </Modal>
            {}
            <Modal onOpenChange={setVideoOpen} open={videoOpen}>
              <ModalContent className="z-50 flex aspect-video w-full max-w-[90%] flex-col gap-6">
                <ModalHeader className="sr-only">
                  <ModalTitle>Demo Video</ModalTitle>
                </ModalHeader>
                <div className="aspect-video w-full">
                  <video
                    autoPlay
                    className="h-full w-full rounded-card object-cover"
                    controls
                    loop
                    muted
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
