"use client";

import { AIBuilder } from "@/components/ai-builder";
import { initializeScrollbarStyles } from "@/lib/ai-builder/utils";
import { useEffect } from "react";

export default function AIChatPage() {
  useEffect(() => {
    initializeScrollbarStyles();
  }, []);

  return <AIBuilder />;
}
