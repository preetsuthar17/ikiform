"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { Button } from "../ui";
import Link from "next/link";

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the popup
    const hasDismissed = localStorage.getItem("promo-popup-dismissed");
    if (hasDismissed) {
      return;
    }

    // Show popup after 3 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Auto-hide after 7 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 7000);

    return () => clearTimeout(hideTimer);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    // Remember that user dismissed the popup
    localStorage.setItem("promo-popup-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            y: -100, 
            x: 0,
          }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            x: 0,
          }}
          exit={{ 
            opacity: 0, 
            y: -100, 
            x: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            ease: "easeInOut"
          }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className="rounded-2xl p-4 relative bg-card border border-border">
            <Button
            variant={"ghost"}
            size={"icon"}
              onClick={handleClose}
              className="absolute top-2 right-2"
              aria-label="Close promotional popup"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Content */}
            <div className="flex items-start gap-3 pr-3">
              <div className="flex-1 min-w-0 flex flex-col gap-1 items-start justify-center">
                <h3 className="text-sm font-semibold pb-2">
                  Special Offer! 🎉
                </h3>
                <p className="text-xs">
                  Use code <span className="font-mono bg-accent px-1 rounded">FREE20</span> for 20% off your first month
                </p>
                <Button asChild variant={"link"} size={"sm"} className="p-0">
                    <Link href="/#pricing">
                    Grab deal now!
                    </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
