// Animation imports
import { motion } from 'motion/react';

// Next.js imports
import Image from 'next/image';
import Link from 'next/link';

interface WelcomeMessageProps {
  mounted: boolean;
  theme: string | undefined;
}

export function WelcomeMessage({ mounted, theme }: WelcomeMessageProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 py-8 text-center"
      initial={{ opacity: 0, y: 20 }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-card bg-primary/10">
        <Link href="/">
          <Image
            alt="Ikiform"
            className={`pointer-events-none ${
              mounted && theme === 'light' ? 'invert' : ''
            }`}
            height={69}
            src="/logo.svg"
            width={69}
          />
        </Link>
      </div>
      <h2 className="font-semibold text-2xl">How can Kiko help you?</h2>
      <p className="max-w-md text-muted-foreground text-sm">
        Hi, I'm Kiko your personalized AI form builder :3
      </p>
    </motion.div>
  );
}
