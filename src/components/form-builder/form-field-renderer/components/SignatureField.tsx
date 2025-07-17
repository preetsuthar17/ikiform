import React, { useRef, useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import type { BaseFieldProps } from "../types";
import { useTheme } from "next-themes";

export function SignatureField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const sigRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const penColor = theme === "dark" ? "white" : "black";
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
      <div ref={containerRef} className="w-full">
        <SignatureCanvas
          ref={sigRef}
          penColor={penColor}
          backgroundColor="#fff"
          canvasProps={{
            width: canvasWidth,
            height: canvasHeight,
            style: { display: "block", width: "100%", height: canvasHeight },
          }}
          onEnd={disabled ? undefined : handleEnd}
          // Prevent drawing if disabled
          {...(disabled && {
            onMouseDown: (e: { preventDefault: () => any }) =>
              e.preventDefault(),
            onTouchStart: (e: { preventDefault: () => any }) =>
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
        <img
          src={value}
          alt="Signature preview"
          className="mt-2 border rounded-card w-full"
          style={{ height: canvasHeight, objectFit: "contain" }}
        />
      )}
    </div>
  );
}
