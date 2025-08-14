import { CSSProperties } from "react";

  interface EmbeddedFormProps {
    className?: string;
    style?: CSSProperties;
  }


export default function Feedback() {
  const iframeStyle: CSSProperties = {
 width: '100%',
 height: '600px',
 border: '1px solid #e5e7eb',
 borderRadius: '8px',
 backgroundColor: '#ffffff',

};
  return (
    <main>

  return (
    <iframe
        src="https://www.ikiform.com/forms/d908beb5-adf7-4fbd-b23b-8a4bbe8792eb?theme=light"
        style={iframeStyle}
        title="Form"
        loading="eager"
        allow="clipboard-write; camera; microphone"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        frameBorder="0"
      />
  );
    </main>
  );
}
