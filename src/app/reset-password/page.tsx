import { Loader } from "@/components/ui";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ResetPasswordClient = dynamic(() => import("./reset-password-client"), {
  loading: () => <Loader />,
});

export default function ResetPassword() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
