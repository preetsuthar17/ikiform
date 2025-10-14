import { Section, Text } from "@react-email/components";
import { CtaList } from "../components/cta-list";
import EmailLayout from "../components/email-layout";

interface WelcomeEmailProps {
  name?: string;
  dashboardUrl: string;
}

export default function WelcomeEmail(props: WelcomeEmailProps) {
  return (
    <EmailLayout
      heading="Welcome to Ikiform! 🎉"
      previewText="Create beautiful forms, collect responses, and analyze your data."
    >
      <Section>
        <Text>
          Welcome{props.name ? `, ${props.name}` : ""}! We’re excited to have
          you on board.
        </Text>
        <Text>
          Build your first form in minutes and start collecting responses
          instantly.
        </Text>
      </Section>
      <CtaList
        primary={{ label: "Go to Dashboard", url: props.dashboardUrl }}
      />
    </EmailLayout>
  );
}
