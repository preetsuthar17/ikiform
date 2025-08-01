import Link from 'next/link';

export default function Terms() {
  return (
    <article className="legal mx-auto flex max-w-4xl flex-col gap-12 px-4 py-10">
      <section className="flex flex-col gap-4">
        <h1 className="font-bold text-4xl">Terms of Service</h1>
        <div className="text-muted-foreground text-sm">
          Last updated: 06th July 2025
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">1. Terms</h2>
        <p>
          By accessing the website at{' '}
          <Link
            className="text-blue-500 underline"
            href="https://www.ikiform.com"
          >
            https://www.ikiform.com
          </Link>
          , you agree to be bound by these terms of service, all applicable laws
          and regulations, and agree that you are responsible for compliance
          with any applicable local laws. If you do not agree with any of these
          terms, you are prohibited from using or accessing this site. The
          materials contained in this website are protected by applicable
          copyright and trademark law.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">2. Use License</h2>
        <p>
          Permission is granted to use, copy, modify, and distribute this
          software and its accompanying materials in accordance with the terms
          of the open-source license provided with the project (e.g., MIT, GPL,
          etc.). This license grants rights to use the software for both
          personal and commercial purposes, subject to the following conditions:
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-6">
          <li>modify or copy the materials;</li>
          <li>
            use the materials for any commercial purpose, or for any public
            display (commercial or non-commercial) except as permitted by your
            subscription or plan;
          </li>
          <li>
            attempt to decompile or reverse engineer any software contained on
            Ikiform's website or services;
          </li>
          <li>
            remove any copyright or other proprietary notations from the
            materials; or
          </li>
          <li>
            transfer the materials to another person or "mirror" the materials
            on any other server.
          </li>
        </ul>
        <p>
          This license shall automatically terminate if you violate any of these
          restrictions and may be terminated by Ikiform at any time. Upon
          terminating your viewing of these materials or upon the termination of
          this license, you must destroy any downloaded materials in your
          possession whether in electronic or printed format.
        </p>
        <p>
          Ikiform may display your logo on its website, app, or marketing
          materials.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">3. Disclaimer</h2>
        <p>
          The materials on Ikiform's website and services are provided on an 'as
          is' basis. Ikiform makes no warranties, expressed or implied, and
          hereby disclaims and negates all other warranties including, without
          limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual
          property or other violation of rights. Further, Ikiform does not
          warrant or make any representations concerning the accuracy, likely
          results, or reliability of the use of the materials on its website or
          otherwise relating to such materials or on any sites linked to this
          site. Please review our{' '}
          <Link className="text-blue-500 underline" href="/legal/privacy">
            Privacy Policy
          </Link>{' '}
          in tandem with these terms.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">4. Limitations</h2>
        <p>
          In no event shall Ikiform or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or
          due to business interruption) arising out of the use or inability to
          use the materials on Ikiform's website or services, even if Ikiform or
          an authorized representative has been notified orally or in writing of
          the possibility of such damage. Because some jurisdictions do not
          allow limitations on implied warranties, or limitations of liability
          for consequential or incidental damages, these limitations may not
          apply to you.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">5. Accuracy of Materials</h2>
        <p>
          The materials appearing on Ikiform's website or app could include
          technical, typographical, or photographic errors. Ikiform does not
          warrant that any of the materials on its website or app are accurate,
          complete, or current. Ikiform may make changes to the materials
          contained on its website or app at any time without notice. However,
          Ikiform does not make any commitment to update the materials.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">6. Links</h2>
        <p>
          Ikiform has not reviewed all of the sites linked to its website and is
          not responsible for the contents of any such linked site. The
          inclusion of any link does not imply endorsement by Ikiform of the
          site. Use of any such linked website is at the user's own risk.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">7. Cancellation & Refunds</h2>
        <p>
          You can cancel your subscription at any time. Ikiform has a no-refund
          policy except in cases of technical issues originating from the
          Ikiform platform. In such cases, please contact us and we will address
          the issue. For yearly plans, refunds are provided on a pro-rata basis
          excluding the month of cancellation and payment gateway charges. For
          monthly plans, refunds are processed after deducting payment gateway
          charges.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">8. Fair Usage Policy</h2>
        <p>
          You may use Ikiform for personal and commercial purposes within fair
          usage limits. Abuse of the platform is strictly prohibited. You may
          create unlimited forms under our fair usage policy. If your usage
          consistently exceeds reasonable limits, you may be asked to upgrade to
          a higher plan.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">9. Modifications</h2>
        <p>
          Ikiform may revise these terms of service for its website or services
          at any time without notice. By using this website or app you are
          agreeing to be bound by the then current version of these terms of
          service.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">10. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance
          with the laws of India and you irrevocably submit to the exclusive
          jurisdiction of the courts in that State or location.
        </p>
      </section>
    </article>
  );
}
