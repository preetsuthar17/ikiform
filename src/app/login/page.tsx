import dynamic from "next/dynamic";
import { memo, Suspense } from "react";
import { Loader } from "@/components/ui";

const LoginClient = dynamic(() => import("./client"), {
	loading: () => <Loader />,
	ssr: true,
});

function Login() {
	return (
		<Suspense fallback={<Loader />}>
			<LoginClient />
		</Suspense>
	);
}

export default memo(Login);
