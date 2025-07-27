'use client';

import { useEffect } from 'react';
import { AIBuilder } from '@/components/ai-builder';
import { initializeScrollbarStyles } from '@/lib/ai-builder/utils';

export default function AIChatPage() {
  useEffect(() => {
    initializeScrollbarStyles();
  }, []);

  return <AIBuilder />;
}
