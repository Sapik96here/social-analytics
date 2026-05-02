import Link from "next/link";
import { Cinzel_Decorative } from "next/font/google";

const cinzel = Cinzel_Decorative({ weight: "700", subsets: ["latin"], display: "swap" });

const LAST_UPDATED = "2 May 2026";
const APP_NAME = "Mad Scientist Social Analytics";
const CONTACT_EMAIL = "shyafiq2596@gmail.com";
const SITE_URL = "https://social-analytics-beryl.vercel.app";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#08090f] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.05] bg-[#0a0a14]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span
              className={`${cinzel.className} text-xl tracking-wider`}
              style={{
                background: "linear-gradient(135deg, #a07820, #e8c84a, #c89828)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MS.
            </span>
            <span className="text-xs text-zinc-600 font-medium hidden sm:inline">
              Mad Scientist
            </span>
          </Link>
          <Link
            href="/privacy"
            className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            Privacy Policy →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-3 block">
            Legal
          </span>
          <h1 className="text-3xl font-black text-white mb-2">Terms of Service</h1>
          <p className="text-xs text-zinc-600">
            Last updated: {LAST_UPDATED} · Effective date: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-8 text-sm text-zinc-400 leading-relaxed">

          <section>
            <p>
              Please read these Terms of Service ("Terms") carefully before using{" "}
              {APP_NAME} ("Service"), operated at{" "}
              <span className="text-zinc-300">{SITE_URL}</span>. By accessing or using the
              Service, you agree to be bound by these Terms. If you do not agree, do not use
              the Service.
            </p>
          </section>

          <Section title="1. Description of Service">
            <p>
              {APP_NAME} is an internal social media analytics and content creation platform
              that enables users to monitor performance metrics across Instagram and Facebook
              accounts, identify content trends, and generate AI-assisted content using
              connected third-party services (ElevenLabs, HeyGen, Meta Graph API).
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>
              You must be at least 13 years of age to use this Service. By using the Service,
              you represent and warrant that you meet this requirement and that you have the
              authority to enter into these Terms on behalf of yourself or any entity you
              represent.
            </p>
          </Section>

          <Section title="3. Account and Access">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                You are responsible for maintaining the confidentiality of any credentials
                used to access the Service.
              </li>
              <li>
                You are responsible for all activity that occurs under your access, including
                any social media accounts connected to the Service.
              </li>
              <li>
                You agree to notify us immediately at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                of any unauthorised use of the Service.
              </li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Use the Service for any unlawful purpose or in violation of any regulations.</li>
              <li>
                Violate Meta's Platform Terms, Community Standards, or any other applicable
                platform policies when using connected social media integrations.
              </li>
              <li>
                Attempt to gain unauthorised access to any portion of the Service or its
                related systems.
              </li>
              <li>
                Use the Service to collect data about individuals without their consent.
              </li>
              <li>
                Reverse engineer, decompile, or otherwise attempt to extract the source code
                of the Service.
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the Service.
              </li>
            </ul>
          </Section>

          <Section title="5. Third-Party Integrations">
            <p>
              The Service integrates with third-party platforms including Meta (Instagram /
              Facebook), ElevenLabs, and HeyGen. Your use of those integrations is also
              governed by their respective terms of service and privacy policies. We are not
              responsible for the availability, accuracy, or conduct of any third-party service.
            </p>
            <p className="mt-3">
              When you connect your social media accounts via Meta's Graph API, you authorise
              us to access data from those accounts as described in our{" "}
              <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              All content, design, code, and materials comprising the Service are the
              intellectual property of Mad Scientist and are protected by applicable copyright
              and trademark laws.
            </p>
            <p className="mt-3">
              Content you upload (e.g. script files) remains your property. By uploading
              content, you grant us a limited, non-exclusive licence to process that content
              solely for the purpose of providing the Service to you.
            </p>
          </Section>

          <Section title="7. Disclaimer of Warranties">
            <p>
              The Service is provided on an "as is" and "as available" basis without warranties
              of any kind, either express or implied, including but not limited to warranties of
              merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p className="mt-3">
              We do not warrant that the Service will be uninterrupted, error-free, or free
              of harmful components. Analytics data displayed is sourced from third-party APIs
              and we make no guarantees as to its accuracy or completeness.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Mad Scientist shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages, including
              loss of profits, data, or goodwill, arising from your use of or inability to
              use the Service, even if advised of the possibility of such damages.
            </p>
          </Section>

          <Section title="9. Indemnification">
            <p>
              You agree to indemnify and hold harmless Mad Scientist and its affiliates from
              any claims, damages, losses, or expenses (including legal fees) arising from
              your use of the Service, your violation of these Terms, or your violation of
              any third-party rights.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              We reserve the right to suspend or terminate your access to the Service at any
              time, with or without notice, for conduct that we believe violates these Terms
              or is harmful to the Service, its users, or third parties.
            </p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>
              We may update these Terms from time to time. Material changes will be indicated
              by updating the "Last updated" date. Continued use of the Service after changes
              constitutes your acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="12. Governing Law">
            <p>
              These Terms are governed by and construed in accordance with applicable law.
              Any disputes arising under these Terms shall be resolved through good-faith
              negotiation, and if unresolved, through the courts of competent jurisdiction.
            </p>
          </Section>

          <Section title="13. Contact Us">
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <div className="mt-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-zinc-300 font-semibold">{APP_NAME}</p>
              <p className="mt-1">
                Email:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>Website: <span className="text-zinc-300">{SITE_URL}</span></p>
            </div>
          </Section>

        </div>
      </main>

      <footer className="border-t border-white/[0.05] mt-16">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="text-[11px] text-zinc-700">© 2026 Mad Scientist. All rights reserved.</p>
          <Link href="/privacy" className="text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-bold text-white mb-3">{title}</h2>
      {children}
    </section>
  );
}
