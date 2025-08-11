import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redeem Code",
  description: "Redeem your promotional code to unlock features and rewards.",
};

export default function RedeemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
