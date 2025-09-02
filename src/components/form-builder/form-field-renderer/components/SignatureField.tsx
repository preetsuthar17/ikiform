import Image from "next/image";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import type { BaseFieldProps } from "../types";

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
      className="flex w-full flex-col gap-2"
      style={{ alignItems: "flex-start" }}
    >
      <div className="w-full rounded-card" ref={containerRef}>
        <SignatureCanvas
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
          penColor="#000"
          ref={sigRef}
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
          disabled={disabled}
          onClick={handleClear}
          size="sm"
          type="button"
          variant="outline"
        >
          Clear
        </Button>
      </div>
      {value && (
        <Image
          alt="Signature preview"
          className="mt-2 w-full rounded-card border"
          height={canvasHeight}
          src={value}
          style={{ height: canvasHeight, objectFit: "contain" }}
          width={canvasWidth}
        />
      )}
    </div>
  );
}
