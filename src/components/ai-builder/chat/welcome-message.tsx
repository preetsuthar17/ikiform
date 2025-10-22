import { motion } from "motion/react";

import Image from "next/image";
import Link from "next/link";

interface WelcomeMessageProps {
  mounted: boolean;
}

export function WelcomeMessage({ mounted }: WelcomeMessageProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 py-8 text-center"
      initial={{ opacity: 0, y: 20 }}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
        <Link href="/">
          <Image
            alt="Ikiform"
            className={"pointer-events-none"}
            height={69}
            src="/logo.svg"
            width={69}
          />
        </Link>
      </div>
      <h2 className="font-semibold text-2xl" id="welcome-heading">
        How can Kiko assist you today?
      </h2>
      <p
        aria-describedby="welcome-heading"
        className="max-w-md text-muted-foreground text-sm"
      >
        Hi, I’m Kiko—your AI-powered form assistant.
        <br />
        Ask me to create, edit, or analyze forms for you!
      </p>
    </motion.div>
  );
}
