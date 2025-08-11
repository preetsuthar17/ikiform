'use client';

import { EmbedConfig } from './EmbedCustomizer';

interface EmbedPreviewProps {
  config: EmbedConfig;
  embedUrl: string;
  formTitle: string;
  viewMode?: 'desktop' | 'mobile';
}

export default function EmbedPreview({ config, embedUrl, formTitle, viewMode = 'desktop' }: EmbedPreviewProps) {
  const getIframeStyles = () => {
    const baseWidth = config.responsive ? '100%' : config.width;
    const styles: React.CSSProperties = {
      width: viewMode === 'mobile' ? '375px' : baseWidth,
      height: viewMode === 'mobile' ? '500px' : config.height,
      border: config.showBorder ? `${config.borderWidth}px solid ${config.borderColor}` : 'none',
      borderRadius: `${config.borderRadius}px`,
      backgroundColor: config.allowTransparency ? 'transparent' : config.backgroundColor,
      maxWidth: viewMode === 'mobile' ? '375px' : 'none',
    };

    return styles;
  };

  const getContainerStyles = () => {
    const styles: React.CSSProperties = {
      padding: `${config.padding}px`,
    };

    return styles;
  };

  return (
    <div 
      style={getContainerStyles()} 
      className={`flex ${viewMode === 'mobile' ? 'justify-center' : 'justify-start'} bg-accent/5 rounded-lg p-4`}
    >
      <iframe
        src={embedUrl}
        style={getIframeStyles()}
        title={formTitle}
        loading={config.loadingMode}
        allow="clipboard-write; camera; microphone"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        className="transition-all duration-300"
      />
    </div>
  );
}
