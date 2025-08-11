import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Customization",
  description: "Customize the design and appearance of your form",
};

export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
