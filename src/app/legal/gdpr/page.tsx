import Link from "next/link";

export default function GDPR() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">GDPR Policy</h1>
        <p>
          The General Data Protection Regulation (GDPR) is a privacy law in the
          European Union (EU) that grants EU citizens and residents the right to
          access and control their personal data.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Is Ikiform GDPR compliant?</h2>
        <p>
          Yes. Ikiform's data centers and servers are located in the EU, and we
          fully comply with the GDPR framework.
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-1">
          <li>
            Our Privacy Policy explains what data we collect, how long we retain
            it, how it may be transferred, and your data protection rights.
          </li>
          <li>
            All form data in Ikiform is encrypted both in transit and at rest,
            and securely stored within Europe.
          </li>
          <li>
            You have full control over the data you collect, store, and manage
            through Ikiform.
          </li>
          <li>
            We offer a Data Processing Agreement (DPA) for your convenience.
          </li>
        </ul>
        <p>Please check the Ikiform DPA for more details.</p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">
          Do you have a Data Processing Agreement?
        </h2>
        <p>
          By creating an Ikiform account and accepting our Terms and Conditions,
          professional users also agree to the terms of our Data Processing
          Agreement (DPA) on behalf of their company. No separate signature is
          required.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">What happens with form data?</h2>
        <p>
          Ikiform provides the form-building service but does not own the
          responses collected through forms. The form creator is responsible for
          the data they collect and acts as the data controller for respondent
          information. Ikiform acts as the data processor, storing data on
          behalf of form creators.
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-1">
          <li>
            As long as your account remains active, you (the form creator)
            retain full control over the data you collect and how long you
            choose to store it.
          </li>
          <li>
            You can delete or export form responses from your account at any
            time if needed.
          </li>
          <li>
            We respect all deletion requests. Any form data you delete is
            permanently removed from our backups within 30 days.
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">
          How Ikiform uses your personal data
        </h2>
        <p>
          Ikiform acts as a data controller for the personal information you
          provide to us in order to use our service (such as registration
          details).
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-1">
          <li>
            We do not sell personal data to third parties, nor do we use it for
            marketing or advertising purposes.
          </li>
          <li>
            We only share your information with trusted service providers who
            assist us in operating Ikiform, and these providers are required to
            comply with the GDPR framework.
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Subprocessors</h2>
        <p>
          We use trusted third-party subprocessors to provide and support
          Ikiform services. Here is a list of our main subprocessors, their use,
          and links to their privacy policies:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-left text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 font-semibold">Name</th>
                <th className="px-4 py-2 font-semibold">Use</th>
                <th className="px-4 py-2 font-semibold">Link</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">Vercel</td>
                <td className="px-4 py-2">Hosting</td>
                <td className="px-4 py-2">
                  <Link
                    href="https://vercel.com"
                    className="text-blue-500 underline"
                    target="_blank"
                  >
                    vercel.com
                  </Link>
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Supabase</td>
                <td className="px-4 py-2">Database, Authentication</td>
                <td className="px-4 py-2">
                  <Link
                    href="https://supabase.com"
                    className="text-blue-500 underline"
                    target="_blank"
                  >
                    supabase.com
                  </Link>
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Upstash</td>
                <td className="px-4 py-2">Redis (Rate Limiting, Caching)</td>
                <td className="px-4 py-2">
                  <Link
                    href="https://upstash.com/legal"
                    className="text-blue-500 underline"
                    target="_blank"
                  >
                    upstash.com
                  </Link>
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Polar</td>
                <td className="px-4 py-2">Payment Processing</td>
                <td className="px-4 py-2">
                  <Link
                    href="https://polar.sh"
                    className="text-blue-500 underline"
                    target="_blank"
                  >
                    polar.sh
                  </Link>
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Cohere</td>
                <td className="px-4 py-2">
                  AI Features (Form Generation, Analytics)
                </td>
                <td className="px-4 py-2">
                  <Link
                    href="https://cohere.com/"
                    className="text-blue-500 underline"
                    target="_blank"
                  >
                    cohere.com
                  </Link>
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Resend</td>
                <td className="px-4 py-2">Email Delivery</td>
                <td className="px-4 py-2">
                  <Link
                    href="https://resend.com"
                    className="text-blue-500 underline"
                    target="_blank"
                  >
                    resend.com
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">
          Contacting Us About Data Privacy
        </h2>
        <p>
          If you have any questions about how we collect, use, or protect your
          personal data, you can contact our Data Protection Officer (DPO):
        </p>
        <div className="flex flex-col gap-1">
          <div>DPO Name: Preet Suthar</div>
          <div>
            Email:{" "}
            <Link
              href="mailto:hi@ikiform.com"
              className="text-blue-500 underline"
            >
              hi@ikiform.com
            </Link>
          </div>
          <div>
            We aim to respond to all inquiries within 3-4 business days.
          </div>
        </div>
      </section>
    </article>
  );
}
