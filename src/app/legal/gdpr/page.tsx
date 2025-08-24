import Link from 'next/link';

export default function GDPR() {
  return (
    <article className="legal mx-auto flex max-w-4xl flex-col gap-12 px-4 py-10">
      <section className="flex flex-col gap-4">
        <h1 className="font-bold text-4xl">GDPR Policy</h1>
        <p>
          The General Data Protection Regulation (GDPR) is a privacy law in the
          European Union (EU) that grants EU citizens and residents the right to
          access and control their personal data.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">Imprint</h2>
        <p>
          Pursuant to § 5 TMG (German Telemedia Act), the following information
          identifies the operator of this website:
        </p>
        <div className="flex flex-col gap-1">
          <div><strong>Operator</strong>: Preet Suthar</div>
          <div><strong>Address</strong>: Juna Rabadiya, Ta: Lunawada, Dis: Mahisagar, 389220, Gujarat, India</div>
          <div>
            <strong>Contact</strong>: 
            <Link className="text-blue-500 underline" href="mailto:hi@preetsuthar.me">
              hi@preetsuthar.me
            </Link>
          </div>
        </div>
        <p>
          For data protection inquiries, please contact our Data Protection Officer
          listed below.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">Is Ikiform GDPR compliant?</h2>
        <p>
          Yes. Ikiform's data centers and servers are located in the EU, and we
          fully comply with the GDPR framework.
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-6">
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
        <h2 className="font-semibold text-2xl">
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
        <h2 className="font-semibold text-2xl">What happens with form data?</h2>
        <p>
          Ikiform provides the form-building service but does not own the
          responses collected through forms. The form creator is responsible for
          the data they collect and acts as the data controller for respondent
          information. Ikiform acts as the data processor, storing data on
          behalf of form creators.
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-6">
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
        <h2 className="font-semibold text-2xl">
          How Ikiform uses your personal data
        </h2>
        <p>
          Ikiform acts as a data controller for the personal information you
          provide to us in order to use our service (such as registration
          details).
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-6">
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
        <h2 className="font-semibold text-2xl">Subprocessors</h2>
        <p>
          We use trusted third-party subprocessors to provide and support
          Ikiform services. Here is a list of our main subprocessors, their use,
          and links to their privacy policies:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-left text-sm">
            <thead>
              <tr className="bg-accent">
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
                    className="text-blue-500 underline"
                    href="https://vercel.com"
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
                    className="text-blue-500 underline"
                    href="https://supabase.com"
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
                    className="text-blue-500 underline"
                    href="https://upstash.com/legal"
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
                    className="text-blue-500 underline"
                    href="https://polar.sh"
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
                    className="text-blue-500 underline"
                    href="https://cohere.com/"
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
                    className="text-blue-500 underline"
                    href="https://resend.com"
                    target="_blank"
                  >
                    resend.com
                  </Link>
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Crisp</td>
                <td className="px-4 py-2">Customer Support</td>
                <td className="px-4 py-2">
                  <Link
                    className="text-blue-500 underline"
                    href="http://crisp.chat/"
                    target="_blank"
                  >
                    http://crisp.chat/
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">
          Contacting Us About Data Privacy
        </h2>
        <p>
          If you have any questions about how we collect, use, or protect your
          personal data, you can contact our Data Protection Officer (DPO):
        </p>
        <div className="flex flex-col gap-1">
          <div>DPO Name: Preet Suthar</div>
          <div>
            Email:{' '}
            <Link
              className="text-blue-500 underline"
              href="mailto:hi@preetsuthar.me"
            >
              hi@preetsuthar.me
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