import React from "react";

// UI Components
import { Button } from "@/components/ui/button";

// Next.js Components
import Image from "next/image";

// Types
import type { FloatingChatButtonProps } from "../types";

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  onClick,
  theme,
  mounted,
}) => {
  return (
    <div className="cursor-pointer">
      <Button
        onClick={onClick}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-ele flex items-center justify-center transition-all duration-200 z-50 border border-border bg-transparent shadow-xl cursor-pointer"
        size="icon"
      >
        <Image
          src="/logo.svg"
          alt="Ikiform"
          width={100}
          height={100}
          className={`pointer-events-none rounded-ele cursor-pointer ${
            mounted && theme === "light" ? "invert" : ""
          }`}
        />
      </Button>
    </div>
  );
};
