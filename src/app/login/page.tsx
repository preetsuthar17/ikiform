import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LoginSkeleton } from "@/components/auth/login-skeleton";

const LoginClient = dynamic(() => import("./client"), {
  loading: () => <LoginSkeleton />,
});

export default function Login() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginClient />
    </Suspense>
  );
}
