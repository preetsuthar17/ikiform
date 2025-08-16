'use client';

import { ChevronRight, Play, Star } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '../ui';
import { Button } from '../ui/button';
import { Chip } from '../ui/chip';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '../ui/modal';
import { CSSProperties } from 'react';

interface EmbeddedFormProps {
  className?: string;
  style?: CSSProperties;
}

export function EmbeddedForm({ className, style }: EmbeddedFormProps) {
  const [iframeHeight, setIframeHeight] = React.useState(850);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.ikiform.com') return;
      
      if (event.data?.type === 'resize' && event.data?.height) {
        setIframeHeight(event.data.height);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const iframeStyle: CSSProperties = {
    width: '100%',
    height: `${iframeHeight}px`,
    border: '1px solid #ffffff',
    borderRadius: '18px',
    display: 'block',
    margin: '0 auto',
    ...style,
  };

  return (
    <div className={`flex justify-center w-full ${className || ''}`}>
      <iframe
        ref={iframeRef}
        src="https://www.ikiform.com/forms/24ec3d8d-40ef-4143-b289-4e43c112d80e?theme=light"
        style={iframeStyle}
        title="Form"
        loading="lazy"
        allow="clipboard-write; camera; microphone"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        frameBorder="0"
      />
    </div>
  );
}

export default function Hero() {
  const { user } = useAuth();

  const [open, setOpen] = React.useState(false);
  const [videoOpen, setVideoOpen] = React.useState(false);

  return (
    <section className="mx-auto mt-2 flex w-full max-w-7xl flex-col gap-12 p-4">
      <div className="z-20 flex h-full grow flex-col items-center gap-12 text-center">
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
              Vercel
            </span>
          </Link>
        </Chip>
        <h1 className="text-center font-dm-sans font-medium text-4xl leading-tighter tracking-[-2px] md:max-w-4xl md:text-6xl">
          <span className="hidden sm:inline">Beautiful & </span>
          <span className="relative">
            <span className="relative z-10 text-black">Affordable</span>
            <span className="-translate-y-1/2 -rotate-1 -z-10 absolute inset-0 top-1/2 transform rounded-md bg-blue-200 py-6 md:py-8" />
          </span>{' '}
          forms that won't{' '}
          <span className="relative">
            <span className="relative z-10 text-black">bore users</span>
            <span className="-translate-y-1/2 -rotate-1 -z-10 absolute inset-0 top-1/2 transform rounded-md bg-yellow-200 py-6 md:py-8" />
          </span>
        </h1>

        <p className="md:text-lg">
          Enterprise-level forms with all the features you need at a price that
          makes sense
        </p>

        <div className="flex w-fit flex-wrap items-center justify-center gap-3">
          {user ? (
            <Button
              asChild
              className="rounded-full border border-[0.5px] px-7 py-6 hover:brightness-99 md:w-fit w-full"
              variant="default"
            >
              <Link
                className="flex items-center gap-2 font-medium"
                href="/dashboard"
              >
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
            <Button
              asChild
              className="rounded-full border border-[0.5px] px-7 py-6 hover:brightness-99 md:w-fit w-full"
              variant="default"
            >
              <Link
                className="flex items-center gap-2 font-medium"
                href="/login"
              >
                Create Your First Form <ChevronRight />
              </Link>
            </Button>
          )}

          <Button
            className="rounded-full border border-[0.5px] px-7 py-6 hover:brightness-99 md:w-fit w-full"
            onClick={() => setOpen(true)}
            variant="secondary"
          >
            Try Demo
          </Button>
        </div>

        <div className="flex items-center gap-2 bg-transparent px-0 py-2 md:px-2 flex-wrap justify-center">
          <AvatarGroup max={5} size="lg" spacing="tighter">
            <Avatar className="rounded-full border-5">
              <AvatarImage
                alt="user1"
                className="rounded-full"
                src="https://pbs.twimg.com/profile_images/1929279033180618752/0z6QXRbm_400x400.jpg"
              />
              <AvatarFallback className="rounded-full bg-gray-100" />
            </Avatar>
            <Avatar className="rounded-full border-5">
              <AvatarImage
                alt="user2"
                className="rounded-full"
                src="https://lh3.googleusercontent.com/a/ACg8ocLqFndqzPkUI_oMGZC8hSPgLWK3Lm3QKe7zMx6xkpisOApHiyZg7A=s96-c"
              />
              <AvatarFallback className="rounded-full bg-[#635BFF]" />
            </Avatar>
            <Avatar className="rounded-full border-5">
              <AvatarImage
                alt="user3"
                className="rounded-full"
                src="https://avatars.githubusercontent.com/u/34282087?v=4"
              />
              <AvatarFallback className="rounded-full bg-white" />
            </Avatar>
            <Avatar className="rounded-full border-5">
              <AvatarImage
                alt="user4"
                className="rounded-full"
                src="https://avatars.githubusercontent.com/u/6717865?v=4"
              />
              <AvatarFallback className="rounded-full" />
            </Avatar>
            <Avatar className="rounded-full border-5">
              <AvatarImage
                alt="user5"
                className="rounded-full"
                src="https://avatars.githubusercontent.com/u/1053948?v=4"
              />
              <AvatarFallback className="rounded-full" />
            </Avatar>
          </AvatarGroup>
          <div className="flex flex-col items-center justify-center rounded-full px-5 py-2">
            <span className="flex items-center justify-center gap-1 text-center">
              <span className="text-sm">300+</span>
              <span className="text-sm opacity-80">
                active users sharing forms
              </span>
            </span>
            <div className="mt-2 flex items-center justify-start gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  aria-label="star"
                  className="fill-[#FFD600] text-[#FFD600]"
                  key={i}
                  size={18}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full w-full grow">
        <div className="h-full w-full overflow-hidden rounded-4xl">
          <div className="relative h-full w-full">
            <video
              className="h-full w-full object-cover"
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
        <Modal onOpenChange={setOpen} open={open}>
          <ModalContent className="z-50 flex w-full max-w-xs flex-col items-center justify-center gap-6">
            <ModalHeader>
              <ModalTitle>Choose a Demo</ModalTitle>
            </ModalHeader>
            <div className="flex w-full flex-col items-center gap-2">
                <Button
              asChild
              className="rounded-full border border-[0.5px] px-6 py-5 hover:brightness-99 w-full"
              variant="secondary"
            >
              <Link
                className="flex items-center gap-2 font-medium"
                href="/demo-form-builder"
              >
                Interactive Form Builder Demo
              </Link>
            </Button>
               <Button
              asChild
              className="rounded-full border border-[0.5px] px-6 py-5 hover:brightness-99 w-full"
              variant="secondary"
            >
              <Link
                className="flex items-center gap-2 font-medium"
                href="/feedback"
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
      <div className='w-full max-w-7xl bg-card rounded-4xl p-4'>
      <EmbeddedForm className='bg-card' />
      </div>
    </section>
  );
}
