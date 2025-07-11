"use client";

import React, { useState } from "react";
import { EmbedCodeModal } from "./EmbedCodeModal";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_FORM_ID = "cb5a67ce-c87d-4252-ab6f-a364a27b7804";

export default function EmbedCustomizerPage() {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(600);
  const [padding, setPadding] = useState(24);
  const [theme, setTheme] = useState("light");
  const [fit, setFit] = useState("fit");
  const [formId, setFormId] = useState(DEFAULT_FORM_ID);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  const embedCode = `<div\n  data-ikiform-id=\"${formId}\"\n  data-width=\"${width}px\"\n  data-height=\"${fit === "fit" ? "auto" : height + "px"}\"\n  data-padding=\"${padding}\"\n  data-fit=\"${fit}\"\n  data-theme=\"${theme}\"\n  style=\"max-width:100%\"\n></div>\n<script\n defer\n src=\"https://ikiform.com/js/script.js\"></script>`;

  return (
    <main className="min-h-screen py-8 px-2 md:px-8">
      <EmbedCodeModal
        code={embedCode}
        isOpen={showEmbedModal}
        onClose={() => setShowEmbedModal(false)}
      />
      <ResizablePanelGroup
        direction="horizontal"
        className="h-screen rounded-card border bg-background shadow-lg"
      >
        <ResizablePanel
          minSize={30}
          defaultSize={40}
          border="right"
          className="p-6 flex flex-col gap-8"
        >
          <div className="sticky top-8 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <label className="font-medium">Form ID</label>
              <Input
                className="input input-bordered w-full"
                value={formId}
                onChange={(e) => setFormId(e.target.value)}
                placeholder="Enter Form ID"
              />
            </div>
            <div className="flex flex-col gap-6">
              <label className="font-medium">Width</label>
              <Slider
                min={320}
                max={700}
                value={[width > 700 ? 700 : width]}
                onValueChange={(v) => setWidth(Math.min(v[0], 700))}
                showValue
                formatValue={(v) => `${v}px`}
              />
            </div>
            <div className="flex flex-col gap-6">
              <label className="font-medium">Height</label>
              <Slider
                min={200}
                max={1200}
                value={[height]}
                onValueChange={(v) => setHeight(v[0])}
                showValue
                formatValue={(v) => `${v}px`}
                disabled={fit === "fit"}
              />
            </div>
            <div className="flex flex-col gap-6">
              <label className="font-medium">Padding</label>
              <Slider
                min={0}
                max={64}
                value={[padding]}
                onValueChange={(v) => setPadding(v[0])}
                showValue
                formatValue={(v) => `${v}px`}
              />
            </div>
            <div className="flex flex-col gap-6">
              <label className="font-medium">Theme</label>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                orientation="horizontal"
              >
                <RadioItem value="light" label="Light" />
                <RadioItem value="dark" label="Dark" />
                <RadioItem value="system" label="System" />
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-6">
              <label className="font-medium">Fit Mode</label>
              <RadioGroup
                value={fit}
                onValueChange={setFit}
                orientation="horizontal"
              >
                <RadioItem value="fit" label="Auto Height" />
                <RadioItem value="fixed" label="Fixed Height" />
              </RadioGroup>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          minSize={30}
          defaultSize={60}
          className="p-6 flex flex-col gap-6 items-center justify-center"
        >
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex justify-between gap-4">
              <label className="font-medium">Live Preview</label>
              <Button onClick={() => setShowEmbedModal(true)} className="w-fit">
                Show Embed Code
              </Button>
            </div>
            <div className="rounded-card border bg-muted p-4 flex items-center justify-center min-h-[400px]">
              <div
                ref={(el) => {
                  if (!el) return;
                  // TypeScript: extend window for ikiformEmbedInit
                  type IkiformWindow = typeof window & {
                    ikiformEmbedInit?: (el: HTMLElement) => void;
                  };
                  const w = window as IkiformWindow;
                  if (w.ikiformEmbedInit) {
                    w.ikiformEmbedInit(el);
                  }
                }}
                data-ikiform-id={formId}
                data-width={`${width}px`}
                data-height={fit === "fit" ? "auto" : `${height}px`}
                data-padding={padding}
                data-fit={fit}
                data-theme={theme}
                style={{ maxWidth: "100%" }}
              ></div>
            </div>
          </div>

          <Script src="/js/script.js" strategy="afterInteractive" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
