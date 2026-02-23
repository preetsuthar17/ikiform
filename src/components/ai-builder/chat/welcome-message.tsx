import { motion } from "motion/react";
import { useTranslations } from "next-intl";

import Image from "next/image";
import Link from "next/link";

interface WelcomeMessageProps {
	mounted: boolean;
}

export function WelcomeMessage({ mounted }: WelcomeMessageProps) {
	const t = useTranslations("product.aiBuilder.welcome");

	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col items-center gap-4 py-8 text-center"
			initial={{ opacity: 0, y: 20 }}
		>
			<div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
				<Link href="/">
					<Image
						alt="Ikiform"
						className={"pointer-events-none"}
						height={69}
						src="/logo.svg"
						width={69}
					/>
				</Link>
			</div>
			<h2 className="font-semibold text-2xl" id="welcome-heading">
				{t("heading")}
			</h2>
			<p
				aria-describedby="welcome-heading"
				className="max-w-md text-muted-foreground text-sm"
			>
				{t("description")}
			</p>
		</motion.div>
	);
}
