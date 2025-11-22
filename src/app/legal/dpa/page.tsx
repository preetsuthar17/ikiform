import Link from "next/link";

export default function DPA() {
	return (
		<article className="legal mx-auto flex max-w-4xl flex-col gap-12 px-4 py-10">
			<section className="flex flex-col gap-4">
				<h1 className="font-bold text-4xl">Data Processing Agreement (DPA)</h1>
				<div className="text-muted-foreground text-sm">
					Last updated: 06th July 2025
				</div>
			</section>
			<section className="flex flex-col gap-4">
				<h2 className="font-semibold text-2xl">1. Introduction</h2>
				<p>
					This Data Processing Agreement ("DPA") is part of the Terms of Service
					("Principal Agreement") between Ikiform ("Processor", "we", "us", or
					"our") and you ("Controller", "Customer", "you").
				</p>
				<p>
					This DPA sets out the terms for the processing of Personal Data in
					accordance with applicable Data Protection Laws, including the General
					Data Protection Regulation (EU) 2016/679 ("GDPR").
				</p>
			</section>
			<section className="flex flex-col gap-4">
				<h2 className="font-semibold text-2xl">2. Definitions</h2>
				<ul className="flex list-disc flex-col gap-1 pl-6">
					<li>
						<b>Personal Data</b>: Any information relating to an identified or
						identifiable natural person.
					</li>
					<li>
						<b>Processing</b>: Any operation performed on Personal Data, such as
						collection, storage, use, transfer, or deletion.
					</li>
					<li>
						<b>Data Controller</b>: The entity that determines the purposes and
						means of Processing Personal Data.
					</li>
					<li>
						<b>Data Processor</b>: The entity that processes Personal Data on
						behalf of the Data Controller.
					</li>
					<li>
						<b>Subprocessor</b>: Any third party appointed by the Processor to
						assist with Processing activities.
					</li>
				</ul>
			</section>
			<section className="flex flex-col gap-4">
				<h2 className="font-semibold text-2xl">3. Scope and Roles</h2>
				<p>
					You, as the Customer, are the Data Controller of any Personal Data
					collected through forms created on Ikiform. Ikiform acts as the Data
					Processor, processing Personal Data on your behalf.
				</p>
			</section>
			<section className="flex flex-col gap-4">
				<h2 className="font-semibold text-2xl">
					4. Processing of Personal Data
				</h2>
				<ul className="flex list-disc flex-col gap-1 pl-6">
					<li>
						We process Personal Data only on your documented instructions,
						unless required by law to act otherwise.
					</li>
					<li>
						Persons authorized to process Personal Data are bound by
						confidentiality obligations.
					</li>
					<li>
						We implement appropriate technical and organizational measures to
						ensure a level of security appropriate to the risk.
					</li>
					<li>
						We assist you, as far as possible, in fulfilling your obligations to
						respond to Data Subject requests.
					</li>
					<li>
						We provide reasonable assistance in ensuring compliance with
						security, breach notifications, data protection impact assessments,
						and consultations with supervisory authorities.
					</li>
					<li>
						Upon termination of services, at your choice, we will delete or
						return all Personal Data, unless otherwise required by law.
					</li>
				</ul>
			</section>
			<section className="flex flex-col gap-4">
				<h2 className="font-semibold text-2xl">5. Subprocessors</h2>
				<p>
					Ikiform may engage Subprocessors to process Personal Data on your
					behalf. A current list of Subprocessors is available in our{" "}
					<Link className="text-blue-500 underline" href="/legal/gdpr">
						GDPR Policy
					</Link>
					.
				</p>
				<p>
					We will notify Customers of any changes to Subprocessors as required
					by applicable Data Protection Laws.
				</p>
			</section>
			<section className="flex flex-col gap-4">
				<h2 className="font-semibold text-2xl">
					6. International Data Transfers
				</h2>
				<p>
					When transferring Personal Data outside the European Economic Area
					(EEA), Ikiform ensures such transfers comply with applicable Data
					Protection Laws. We rely on appropriate safeguards, such as Standard
					Contractual Clauses (SCCs), for such transfers.
				</p>
			</section>
			<section className="flex flex-col gap-4">
				<h2 className="font-semibold text-2xl">7. Data Subject Rights</h2>
				<p>
					We assist you, to the extent reasonably possible, in fulfilling your
					obligations to respond to requests by Data Subjects to exercise their
					rights under the GDPR, including rights of access, rectification,
					erasure, and portability of their Personal Data.
				</p>
			</section>
			<section className="flex flex-col gap-4">
				<h2 className="font-semibold text-2xl">8. Security Measures</h2>
				<p>
					Ikiform implements and maintains appropriate technical and
					organizational security measures to protect Personal Data against
					accidental or unlawful destruction, loss, alteration, unauthorized
					disclosure, or access. Details about our security practices are
					available upon request.
				</p>
			</section>
			<section className="flex flex-col gap-4">
				<h2 className="font-semibold text-2xl">9. Personal Data Breach</h2>
				<p>
					In the event of a Personal Data breach affecting your Personal Data,
					Ikiform will notify you without undue delay and provide all necessary
					information to enable you to comply with your breach notification
					obligations under GDPR.
				</p>
			</section>
			<section className="flex flex-col gap-4">
				<h2 className="font-semibold text-2xl">10. Termination</h2>
				<p>
					Upon termination of the Principal Agreement, you may request deletion
					of your Personal Data processed by Ikiform. We will comply with such a
					request within a reasonable time unless otherwise required to retain
					the data under applicable law.
				</p>
			</section>
			<section className="flex flex-col gap-4">
				<h2 className="font-semibold text-2xl">11. Governing Law</h2>
				<p>
					This DPA is governed by and construed in accordance with the laws of
					India.
				</p>
				<p>By using Ikiform, you agree to this Data Processing Agreement.</p>
			</section>
		</article>
	);
}
