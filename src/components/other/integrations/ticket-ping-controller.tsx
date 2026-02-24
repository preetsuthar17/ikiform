"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { stripLocalePrefix } from "@/lib/i18n/pathname";

const TicketpingWithNoSsr = dynamic(
	async () => {
		const mod = await import("./ticket-ping");
		return mod.Ticketping;
	},
	{ ssr: false }
);

export function TicketpingController() {
	const pathname = usePathname();
	const normalizedPathname = stripLocalePrefix(pathname);
	const ticketpingDisabled =
		process.env.NEXT_PUBLIC_DISABLE_TICKETPING === "1";

	const shouldHide =
		normalizedPathname.startsWith("/forms") ||
		normalizedPathname.startsWith("/f") ||
		normalizedPathname.startsWith("/dashboard/forms") ||
		(normalizedPathname.startsWith("/dashboard/forms/") &&
			normalizedPathname.includes("analytics"));

	if (shouldHide || ticketpingDisabled) {
		return null;
	}

	return <TicketpingWithNoSsr />;
}

export default TicketpingController;
