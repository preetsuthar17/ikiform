'use client';

import { Check, Code2, Copy, FileText, Globe, Shield, Zap } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button-base';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EmbedConfig } from './EmbedCustomizer';

interface EmbedCodeGeneratorProps {
  config: EmbedConfig;
  embedUrl: string;
  formId: string;
}

type EmbedMode = 'html' | 'react' | 'nextjs' | 'vue' | 'wordpress';

export default function EmbedCodeGenerator({
  config,
  embedUrl,
  formId,
}: EmbedCodeGeneratorProps) {
  const [embedMode, setEmbedMode] = useState<EmbedMode>('html');
  const [copied, setCopied] = useState(false);

  const generateIframeStyles = () => {
    const styles = [
      `width: ${config.responsive ? '100%' : config.width}`,
      `height: ${config.height}`,
      `border: ${config.showBorder ? `${config.borderWidth}px solid ${config.borderColor}` : 'none'}`,
      `border-radius: ${config.borderRadius}px`,
    ];

    if (!config.allowTransparency) {
      styles.push(`background-color: ${config.backgroundColor}`);
    }

    return styles.join('; ');
  };

  const generateContainerStyles = () => {
    if (config.padding === 0) return '';
    return `padding: ${config.padding}px;`;
  };

  const generateHtmlCode = () => {
    const containerStyle = generateContainerStyles();
    const iframeStyle = generateIframeStyles();

    let code = '';

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

    code += '\n></iframe>';

    if (containerStyle) {
      code += '\n</div>';
    }

    return code;
  };

  const generateReactCode = () => {
    const containerStyle = generateContainerStyles();
    const iframeStyle = generateIframeStyles();

    let code = `import React from 'react';\n\n`;
    code += 'export default function EmbeddedForm() {\n';
    code += '  const iframeStyle = {\n';

    const styleObject: Record<string, string> = {
      width: config.responsive ? '100%' : config.width,
      height: config.height,
      border: config.showBorder
        ? `${config.borderWidth}px solid ${config.borderColor}`
        : 'none',
      borderRadius: `${config.borderRadius}px`,
    };

    if (!config.allowTransparency) {
      styleObject.backgroundColor = config.backgroundColor;
    }

    Object.entries(styleObject).forEach(([key, value]) => {
      code += `    ${key}: '${value}',\n`;
    });

    code += '  };\n\n';

    if (containerStyle) {
      code += '  const containerStyle = {\n';
      code += `    padding: '${config.padding}px',\n`;
      code += '  };\n\n';
    }

    code += '  return (\n';

    if (containerStyle) {
      code += '    <div style={containerStyle}>\n      ';
    } else {
      code += '    ';
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

    code += '\n      />';

    if (containerStyle) {
      code += '\n    </div>';
    }

    code += '\n  );\n}';

    return code;
  };

  const generateNextjsCode = () => {
    let code = `'use client';\n\n`;
    code += `import { CSSProperties } from 'react';\n\n`;
    code += 'interface EmbeddedFormProps {\n';
    code += '  className?: string;\n';
    code += '  style?: CSSProperties;\n';
    code += '}\n\n';
    code +=
      'export default function EmbeddedForm({ className, style }: EmbeddedFormProps) {\n';

    const styleObject: Record<string, string> = {
      width: config.responsive ? '100%' : config.width,
      height: config.height,
      border: config.showBorder
        ? `${config.borderWidth}px solid ${config.borderColor}`
        : 'none',
      borderRadius: `${config.borderRadius}px`,
    };

    if (!config.allowTransparency) {
      styleObject.backgroundColor = config.backgroundColor;
    }

    code += '  const iframeStyle: CSSProperties = {\n';
    Object.entries(styleObject).forEach(([key, value]) => {
      code += `    ${key}: '${value}',\n`;
    });
    code += '    ...style,\n';
    code += '  };\n\n';

    if (config.padding > 0) {
      code += '  const containerStyle: CSSProperties = {\n';
      code += `    padding: '${config.padding}px',\n`;
      code += '  };\n\n';
    }

    code += '  return (\n';

    if (config.padding > 0) {
      code += '    <div style={containerStyle} className={className}>\n      ';
    } else {
      code += '    ';
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

    code += '\n      />';

    if (config.padding > 0) {
      code += '\n    </div>';
    }

    code += '\n  );\n}';

    return code;
  };

  const generateVueCode = () => {
    let code = '<template>\n';

    if (config.padding > 0) {
      code += `  <div :style="containerStyle">\n    `;
    } else {
      code += '  ';
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

    code += '\n    />';

    if (config.padding > 0) {
      code += '\n  </div>';
    }

    code += '\n</template>\n\n';
    code += '<script setup>\n';
    code += `const embedUrl = '${embedUrl}';\n\n`;

    const styleObject: Record<string, string> = {
      width: config.responsive ? '100%' : config.width,
      height: config.height,
      border: config.showBorder
        ? `${config.borderWidth}px solid ${config.borderColor}`
        : 'none',
      borderRadius: `${config.borderRadius}px`,
    };

    if (!config.allowTransparency) {
      styleObject.backgroundColor = config.backgroundColor;
    }

    code += 'const iframeStyle = {\n';
    Object.entries(styleObject).forEach(([key, value]) => {
      code += `  '${key}': '${value}',\n`;
    });
    code += '};\n';

    if (config.padding > 0) {
      code += '\nconst containerStyle = {\n';
      code += `  padding: '${config.padding}px',\n`;
      code += '};\n';
    }

    code += '</script>';

    return code;
  };

  const generateWordPressCode = () => {
    const shortcode = `[ikiform_embed id="${formId}" width="${config.width}" height="${config.height}"]`;

    let code = '<!-- WordPress Shortcode -->\n';
    code += `${shortcode}\n\n`;
    code += '<!-- Or use HTML directly in a Custom HTML block -->\n';
    code += generateHtmlCode();

    return code;
  };

  const getCode = () => {
    switch (embedMode) {
      case 'html':
        return generateHtmlCode();
      case 'react':
        return generateReactCode();
      case 'nextjs':
        return generateNextjsCode();
      case 'vue':
        return generateVueCode();
      case 'wordpress':
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
      console.error('Failed to copy code:', err);
    }
  };

  const embedModes = [
    {
      id: 'html',
      name: 'HTML',
      icon: Globe,
      description: 'Universal HTML iframe',
    },
    { id: 'react', name: 'React', icon: Code2, description: 'React component' },
    {
      id: 'nextjs',
      name: 'Next.js',
      icon: Code2,
      description: 'Next.js component',
    },
    { id: 'vue', name: 'Vue', icon: Code2, description: 'Vue.js component' },
    {
      id: 'wordpress',
      name: 'WordPress',
      icon: FileText,
      description: 'WordPress shortcode',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-lg">
          Get Embed Code
        </h3>
        <Button
          className="gap-2"
          onClick={copyToClipboard}
          variant={copied ? 'outline' : 'default'}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Code
            </>
          )}
        </Button>
      </div>

      {/* Embed Mode Selection */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {embedModes.map((mode) => {
          const IconComponent = mode.icon;
          return (
            <Card
              className={`hover: cursor-pointer transition-all ${
                embedMode === mode.id
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              key={mode.id}
              onClick={() => setEmbedMode(mode.id as EmbedMode)}
            >
              <CardContent className="p-3">
                <div className="mb-1 flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium text-sm">{mode.name}</span>
                  {embedMode === mode.id && (
                    <Badge className="ml-auto text-xs" variant="default">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  {mode.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Code Display */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <CardTitle className="font-medium text-sm">
              {embedModes.find((mode) => mode.id === embedMode)?.name} Code
            </CardTitle>
            <Badge className="text-xs" variant="outline">
              Ready to copy
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto bg-muted/30 p-4">
            <pre className="whitespace-pre-wrap break-words font-mono text-foreground text-sm">
              <code>{getCode()}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-semibold text-sm">
            <FileText className="h-4 w-4" />
            Integration Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 text-muted-foreground text-sm">
            {embedMode === 'html' && (
              <p>
                Copy the HTML code and paste it directly into your website where
                you want the form to appear.
              </p>
            )}
            {embedMode === 'react' && (
              <div>
                <p>1. Copy the React component code</p>
                <p>
                  2. Save it as a new component file (e.g., EmbeddedForm.jsx)
                </p>
                <p>3. Import and use it in your React application</p>
              </div>
            )}
            {embedMode === 'nextjs' && (
              <div>
                <p>1. Copy the Next.js component code</p>
                <p>2. Save it in your components directory</p>
                <p>3. Import and use it in your pages or components</p>
                <p>
                  4. The component includes TypeScript types for better
                  development experience
                </p>
              </div>
            )}
            {embedMode === 'vue' && (
              <div>
                <p>1. Copy the Vue component code</p>
                <p>2. Save it as a .vue file in your components directory</p>
                <p>3. Import and use it in your Vue application</p>
              </div>
            )}
            {embedMode === 'wordpress' && (
              <div>
                <p>1. Use the shortcode in any post, page, or widget</p>
                <p>
                  2. Or paste the HTML code in a Custom HTML block in the block
                  editor
                </p>
                <p>
                  3. The shortcode requires the IkiForm WordPress plugin (coming
                  soon)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security & Performance Notes */}
      <Card className="border-warning/20 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-semibold text-sm">
            <Shield className="h-4 w-4" />
            Security & Performance Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-1 text-muted-foreground text-sm">
            <li className="flex items-center gap-2">
              <Shield className="h-3 w-3" />
              The iframe includes security sandbox attributes for safe embedding
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-3 w-3" />
              Lazy loading is enabled to improve page performance
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-3 w-3" />
              The form is served over HTTPS for secure data transmission
            </li>
            <li className="flex items-center gap-2">
              <Globe className="h-3 w-3" />
              Consider testing the embed on different devices and browsers
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
