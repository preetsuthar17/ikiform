"use client";

import { Check, Code2, Copy, FileText, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal";
import type { EmbedConfig } from "./EmbedCustomizer";

interface EmbedCodeModalProps {
	isOpen: boolean;
	onClose: () => void;
	config: EmbedConfig;
	embedUrl: string;
	formId: string;
}

type EmbedMode = "html" | "react" | "nextjs" | "vue" | "wordpress";

export default function EmbedCodeModal({
	isOpen,
	onClose,
	config,
	embedUrl,
	formId,
}: EmbedCodeModalProps) {
	const [embedMode, setEmbedMode] = useState<EmbedMode>("html");
	const [copied, setCopied] = useState(false);

	const generateIframeStyles = () => {
		const styles = [
			`width: ${config.responsive ? "100%" : config.width}`,
			`height: ${config.height}`,
			`border: ${config.showBorder ? `${config.borderWidth}px solid ${config.borderColor}` : "none"}`,
			`border-radius: ${config.borderRadius}px`,
		];

		if (!config.allowTransparency) {
			styles.push(`background-color: ${config.backgroundColor}`);
		}

		return styles.join("; ");
	};

	const generateContainerStyles = () => {
		if (config.padding === 0) return "";
		return `padding: ${config.padding}px;`;
	};

	const generateHtmlCode = () => {
		const containerStyle = generateContainerStyles();
		const iframeStyle = generateIframeStyles();

		let code = "";

		if (containerStyle) {
			code += `<div style="${containerStyle}">\n  `;
		}

		code += `<iframe
  src="${embedUrl}"
  style="${iframeStyle}"
  title="Form"
  loading="${config.loadingMode}"
  allow="clipboard-write; camera; microphone"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"`;

		if (config.responsive) {
			code += `\n  frameborder="0"`;
		}

		code += "\n></iframe>";

		if (containerStyle) {
			code += "\n</div>";
		}

		return code;
	};

	const generateReactCode = () => {
		const containerStyle = generateContainerStyles();

		let code = `import React from 'react';\n\n`;
		code += "export default function EmbeddedForm() {\n";
		code += "  const iframeStyle = {\n";

		const styleObject: Record<string, string> = {
			width: config.responsive ? "100%" : config.width,
			height: config.height,
			border: config.showBorder
				? `${config.borderWidth}px solid ${config.borderColor}`
				: "none",
			borderRadius: `${config.borderRadius}px`,
		};

		if (!config.allowTransparency) {
			styleObject.backgroundColor = config.backgroundColor;
		}

		Object.entries(styleObject).forEach(([key, value]) => {
			code += `    ${key}: '${value}',\n`;
		});

		code += "  };\n\n";

		if (containerStyle) {
			code += "  const containerStyle = {\n";
			code += `    padding: '${config.padding}px',\n`;
			code += "  };\n\n";
		}

		code += "  return (\n";

		if (containerStyle) {
			code += "    <div style={containerStyle}>\n      ";
		} else {
			code += "    ";
		}

		code += `<iframe
        src="${embedUrl}"
        style={iframeStyle}
        title="Form"
        loading="${config.loadingMode}"
        allow="clipboard-write; camera; microphone"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"`;

		if (config.responsive) {
			code += `\n        frameBorder="0"`;
		}

		code += "\n      />";

		if (containerStyle) {
			code += "\n    </div>";
		}

		code += "\n  );\n}";

		return code;
	};

	const generateNextjsCode = () => {
		let code = `'use client';\n\n`;
		code += `import { CSSProperties } from 'react';\n\n`;
		code += "interface EmbeddedFormProps {\n";
		code += "  className?: string;\n";
		code += "  style?: CSSProperties;\n";
		code += "}\n\n";
		code +=
			"export default function EmbeddedForm({ className, style }: EmbeddedFormProps) {\n";

		const styleObject: Record<string, string> = {
			width: config.responsive ? "100%" : config.width,
			height: config.height,
			border: config.showBorder
				? `${config.borderWidth}px solid ${config.borderColor}`
				: "none",
			borderRadius: `${config.borderRadius}px`,
		};

		if (!config.allowTransparency) {
			styleObject.backgroundColor = config.backgroundColor;
		}

		code += "  const iframeStyle: CSSProperties = {\n";
		Object.entries(styleObject).forEach(([key, value]) => {
			code += `    ${key}: '${value}',\n`;
		});
		code += "    ...style,\n";
		code += "  };\n\n";

		if (config.padding > 0) {
			code += "  const containerStyle: CSSProperties = {\n";
			code += `    padding: '${config.padding}px',\n`;
			code += "  };\n\n";
		}

		code += "  return (\n";

		if (config.padding > 0) {
			code += "    <div style={containerStyle} className={className}>\n      ";
		} else {
			code += "    ";
		}

		code += `<iframe
        src="${embedUrl}"
        style={iframeStyle}
        title="Form"
        loading="${config.loadingMode}"
        allow="clipboard-write; camera; microphone"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"`;

		if (config.responsive) {
			code += `\n        frameBorder="0"`;
		}

		code += "\n      />";

		if (config.padding > 0) {
			code += "\n    </div>";
		}

		code += "\n  );\n}";

		return code;
	};

	const generateVueCode = () => {
		let code = "<template>\n";

		if (config.padding > 0) {
			code += `  <div :style="containerStyle">\n    `;
		} else {
			code += "  ";
		}

		code += `<iframe
      :src="embedUrl"
      :style="iframeStyle"
      title="Form"
      loading="${config.loadingMode}"
      allow="clipboard-write; camera; microphone"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"`;

		if (config.responsive) {
			code += `\n      frameborder="0"`;
		}

		code += "\n    />";

		if (config.padding > 0) {
			code += "\n  </div>";
		}

		code += "\n</template>\n\n";
		code += "<script setup>\n";
		code += `const embedUrl = '${embedUrl}';\n\n`;

		const styleObject: Record<string, string> = {
			width: config.responsive ? "100%" : config.width,
			height: config.height,
			border: config.showBorder
				? `${config.borderWidth}px solid ${config.borderColor}`
				: "none",
			borderRadius: `${config.borderRadius}px`,
		};

		if (!config.allowTransparency) {
			styleObject.backgroundColor = config.backgroundColor;
		}

		code += "const iframeStyle = {\n";
		Object.entries(styleObject).forEach(([key, value]) => {
			code += `  '${key}': '${value}',\n`;
		});
		code += "};\n";

		if (config.padding > 0) {
			code += "\nconst containerStyle = {\n";
			code += `  padding: '${config.padding}px',\n`;
			code += "};\n";
		}

		code += "</script>";

		return code;
	};

	const generateWordPressCode = () => {
		const shortcode = `[ikiform_embed id="${formId}" width="${config.width}" height="${config.height}"]`;

		let code = "<!-- WordPress Shortcode -->\n";
		code += `${shortcode}\n\n`;
		code += "<!-- Or use HTML directly in a Custom HTML block -->\n";
		code += generateHtmlCode();

		return code;
	};

	const getCode = () => {
		switch (embedMode) {
			case "html":
				return generateHtmlCode();
			case "react":
				return generateReactCode();
			case "nextjs":
				return generateNextjsCode();
			case "vue":
				return generateVueCode();
			case "wordpress":
				return generateWordPressCode();
			default:
				return generateHtmlCode();
		}
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(getCode());
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	};

	const embedModes = [
		{
			id: "html",
			name: "HTML",
			icon: Globe,
			description: "Universal HTML iframe",
		},
		{ id: "react", name: "React", icon: Code2, description: "React component" },
		{
			id: "nextjs",
			name: "Next.js",
			icon: Code2,
			description: "Next.js component",
		},
		{ id: "vue", name: "Vue", icon: Code2, description: "Vue.js component" },
		{
			id: "wordpress",
			name: "WordPress",
			icon: FileText,
			description: "WordPress shortcode",
		},
	];

	const activeMode = embedModes.find((mode) => mode.id === embedMode);

	return (
		<Modal onOpenChange={onClose} open={isOpen}>
			<ModalContent className="flex max-w-3xl flex-col gap-6">
				<ModalHeader>
					<ModalTitle>Embed Code</ModalTitle>
					<ModalDescription>
						Choose your framework and copy the code
					</ModalDescription>
				</ModalHeader>

				<div className="flex flex-col gap-4">
					{}
					<div className="flex flex-wrap gap-2">
						{embedModes.map((mode) => (
							<Button
								key={mode.id}
								onClick={() => setEmbedMode(mode.id as EmbedMode)}
								size="sm"
								variant={embedMode === mode.id ? "default" : "outline"}
							>
								{mode.name}
							</Button>
						))}
					</div>

					{}
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<span className="font-medium text-sm">
								{embedModes.find((m) => m.id === embedMode)?.name} Code
							</span>
							<Button
								className="flex items-center gap-2"
								onClick={copyToClipboard}
								size="sm"
								variant={copied ? "outline" : "default"}
							>
								{copied ? (
									<>
										<Check className="size-4" />
										Copied!
									</>
								) : (
									<>
										<Copy className="size-4" />
										Copy
									</>
								)}
							</Button>
						</div>

						<div className="max-h-96 overflow-x-auto rounded-lg bg-muted/30 p-4">
							<pre className="font-mono text-sm">
								<code>{getCode()}</code>
							</pre>
						</div>
					</div>
				</div>

				<ModalFooter>
					<Button onClick={onClose} variant="outline">
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
