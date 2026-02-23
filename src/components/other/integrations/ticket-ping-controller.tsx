"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const TicketpingWithNoSsr = dynamic(
	async () => {
		const mod = await import("./ticket-ping");
		return mod.Ticketping;
	},
	{ ssr: false }
);

export function TicketpingController() {
	const pathname = usePathname();
	const ticketpingDisabled =
		process.env.NEXT_PUBLIC_DISABLE_TICKETPING === "1";

	const shouldHide =
		pathname.startsWith("/forms") ||
		pathname.startsWith("/f") ||
		pathname.startsWith("/dashboard/forms") ||
		(pathname.startsWith("/dashboard/forms/") &&
			pathname.includes("analytics"));

	if (shouldHide || ticketpingDisabled) {
		return null;
	}

	return <TicketpingWithNoSsr />;
}

export default TicketpingController;
