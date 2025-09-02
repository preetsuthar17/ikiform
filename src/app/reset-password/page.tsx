import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LoginSkeleton } from "@/components/auth/login-skeleton";

const ResetPasswordClient = dynamic(() => import("./reset-password-client"), {
  loading: () => <LoginSkeleton />,
});

export default function ResetPassword() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
