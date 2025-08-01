'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import type { BaseFieldProps } from '../types';

/**
 * Client-side SignatureField component
 * Handles canvas interactions and signature state
 * Optimized for minimal re-renders
 */
export function SignatureFieldClient({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const sigRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(400);
  const canvasHeight = 120;

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (value && sigRef.current && sigRef.current.isEmpty()) {
      sigRef.current.fromDataURL(value);
    } else if (!value && sigRef.current) {
      sigRef.current.clear();
    }
  }, [value, canvasWidth]);

  const handleEnd = () => {
    if (sigRef.current) {
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL('image/png');
      onChange(dataUrl);
    }
  };

  const handleClear = () => {
    sigRef.current?.clear();
    onChange('');
  };

  return (
    <div className="w-full space-y-2">
      <div
        className="relative w-full overflow-hidden rounded-md border-2 border-muted border-dashed bg-background"
        ref={containerRef}
      >
        {value && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Image
              alt="Signature"
              className="max-h-full max-w-full object-contain"
              height={canvasHeight}
              src={value}
              width={canvasWidth}
            />
          </div>
        )}
        <SignatureCanvas
          canvasProps={{
            width: canvasWidth,
            height: canvasHeight,
            className: value ? 'invisible' : 'block',
          }}
          onEnd={handleEnd}
          penColor="#000000"
          ref={sigRef}
        />
        {!value && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-muted-foreground">
            Draw your signature here
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          disabled={disabled}
          onClick={handleClear}
          size="sm"
          type="button"
          variant="outline"
        >
          Clear
        </Button>
        {value && (
          <Button
            disabled={disabled}
            onClick={() => {
              if (sigRef.current) {
                sigRef.current.clear();
                onChange('');
              }
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
