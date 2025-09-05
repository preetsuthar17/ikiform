"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface FeatureIntroductionProps {
  id: string;
  delay?: number;
  title: string;
  description: string;
  imageUrl?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onAction?: () => void;
  actionText?: string;
  showAction?: boolean;
  className?: string;
}

const STORAGE_KEY_PREFIX = "feature-intro-dismissed-";

export function FeatureIntroduction({
  id,
  delay = 2000,
  title,
  description,
  imageUrl,
  children,
  onClose,
  onAction,
  actionText = "Get Started",
  showAction = true,
  className = "",
}: FeatureIntroductionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const hasBeenDismissed = localStorage.getItem(storageKey) === "true";
    if (!hasBeenDismissed) {
      const timer = setTimeout(() => {
        setShowDialog(true);
        setIsOpen(true);
        setIsLoaded(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    setIsLoaded(true);
  }, [delay, storageKey]);

  const handleClose = () => {
    setIsAnimating(true);
    closeTimeout.current = setTimeout(() => {
      setIsOpen(false);
      setShowDialog(false);
      setIsAnimating(false);
      localStorage.setItem(storageKey, "true");
      onClose?.();
    }, 150);
  };

  const handleAction = () => {
    onAction?.();
    handleClose();
  };

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  if (!(isLoaded && showDialog)) return null;

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent
        className={`flex max-w-md flex-col gap-6 rounded-3xl ${className} transition-transform duration-150 ease-in-out ${
          isAnimating
            ? "pointer-events-none scale-85 opacity-0"
            : "scale-90 opacity-100"
        } will-change-transform`}
      >
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-2 font-semibold text-xl">
            {title}
          </DialogTitle>
          <DialogClose asChild className="-top-2 -right-2 absolute">
            <Button
              onClick={handleClose}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {imageUrl && (
            <div className="flex justify-center">
              <img
                alt={title}
                className="h-32 w-32 rounded-lg object-cover"
                src={imageUrl}
              />
            </div>
          )}
          <div className="flex flex-col gap-4">
            {children ? (
              children
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {showAction && (
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1"
                onClick={handleClose}
                type="button"
                variant="outline"
              >
                Maybe Later
              </Button>
              <Button className="flex-1" onClick={handleAction} type="button">
                {actionText}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function resetFeatureIntroduction(id: string) {
  const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
  localStorage.removeItem(storageKey);
}

export function isFeatureIntroductionDismissed(id: string): boolean {
  const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
  return localStorage.getItem(storageKey) === "true";
}
