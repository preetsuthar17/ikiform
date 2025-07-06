// Animation imports
import { motion } from "motion/react";

// Next.js imports
import Image from "next/image";
import Link from "next/link";

interface WelcomeMessageProps {
  mounted: boolean;
  theme: string | undefined;
}

export function WelcomeMessage({ mounted, theme }: WelcomeMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8 flex flex-col gap-4 items-center"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Ikiform"
            width={69}
            height={69}
            className={`pointer-events-none ${
              mounted && theme === "light" ? "invert" : ""
            }`}
          />
        </Link>
      </div>
      <h2 className="text-2xl font-semibold">How can Kiko help you?</h2>
      <p className="text-muted-foreground max-w-md text-sm">
        Hi, I'm Kiko your personalized AI form builder :3
      </p>
    </motion.div>
  );
}
