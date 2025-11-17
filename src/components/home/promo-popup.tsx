"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui";

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem("promo-popup-dismissed");
    if (hasDismissed) {
      return;
    }

    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 7000);

    return () => clearTimeout(hideTimer);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);

    localStorage.setItem("promo-popup-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{
            opacity: 1,
            y: 0,
            x: 0,
          }}
          className="fixed top-4 right-4 z-50 max-w-sm"
          exit={{
            opacity: 0,
            y: -100,
            x: 0,
          }}
          initial={{
            opacity: 0,
            y: -100,
            x: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            ease: "easeInOut",
          }}
        >
          <div className="relative rounded-2xl border border-border bg-card p-4">
            <Button
              aria-label="Close promotional popup"
              className="absolute top-2 right-2"
              onClick={handleClose}
              size={"icon"}
              variant={"ghost"}
            >
              <X className="size-4" />
            </Button>

            {}
            <div className="flex items-start gap-3 pr-3">
              <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1">
                <h3 className="pb-2 font-semibold text-sm">
                  Special Offer! 🎉
                </h3>
                <p className="text-xs">
                  Use code{" "}
                  <span className="rounded bg-accent px-1 font-mono">
                    FREE20
                  </span>{" "}
                  for 20% off your first month
                </p>
                <Button asChild className="p-0" size={"sm"} variant={"link"}>
                  <Link href="/#pricing">Grab deal now!</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
