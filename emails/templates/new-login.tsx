import { Link, Section, Text } from "@react-email/components";
import { CtaList } from "../components/cta-list";
import EmailLayout from "../components/email-layout";

interface NewLoginEmailProps {
	name?: string;
	dashboardUrl: string;
}

export default function NewLoginEmail(props: NewLoginEmailProps) {
	return (
		<EmailLayout
			heading="New Login to Ikiform"
			previewText="If this wasn’t you, please contact us."
		>
			<Section>
				<Text>
					We detected a new login to your Ikiform account
					{props.name ? `, ${props.name}` : ""}. If this was you, you can safely
					ignore this email.
				</Text>
				<Text>
					If you did not perform this login, please{" "}
					<Link href="mailto:hi@ikiform.com   ">contact us</Link>.
				</Text>
			</Section>
			<CtaList
				primary={{ label: "Go to Dashboard", url: props.dashboardUrl }}
			/>
		</EmailLayout>
	);
}
