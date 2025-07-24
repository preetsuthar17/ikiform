import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import type { BaseFieldProps } from "../types";
import { useTheme } from "next-themes";

export function SignatureField({
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
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
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
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
      onChange(dataUrl);
    }
  };

  const handleClear = () => {
    sigRef.current?.clear();
    onChange("");
  };

  return (
    <div
      className="flex flex-col gap-2 w-full"
      style={{ alignItems: "flex-start" }}
    >
      <div ref={containerRef} className="w-full rounded-card">
        <SignatureCanvas
          ref={sigRef}
          penColor="#000"
          backgroundColor="#fff"
          canvasProps={{
            width: canvasWidth,
            height: canvasHeight,
            style: {
              display: "block",
              width: "100%",
              height: canvasHeight,
              borderRadius: "var(--card-radius)",
            },
          }}
          onEnd={disabled ? undefined : handleEnd}
          // Prevent drawing if disabled
          {...(disabled && {
            onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) =>
              e.preventDefault(),
            onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) =>
              e.preventDefault(),
          })}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleClear}
          disabled={disabled}
        >
          Clear
        </Button>
      </div>
      {value && (
        <Image
          src={value}
          alt="Signature preview"
          className="mt-2 border rounded-card w-full"
          style={{ height: canvasHeight, objectFit: "contain" }}
          width={canvasWidth}
          height={canvasHeight}
        />
      )}
    </div>
  );
}
