import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LoginSkeleton } from "@/components/auth/login-skeleton";

const RedeemClient = dynamic(() => import("./redeem-client"), {
  loading: () => <LoginSkeleton />,
});

export default function RedeemPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <RedeemClient />
    </Suspense>
  );
}
