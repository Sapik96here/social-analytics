import Link from "next/link";
import { Cinzel_Decorative } from "next/font/google";

const cinzel = Cinzel_Decorative({ weight: "700", subsets: ["latin"], display: "swap" });

const LAST_UPDATED = "2 May 2026";
const APP_NAME = "Mad Scientist Social Analytics";
const CONTACT_EMAIL = "shyafiq2596@gmail.com";
const SITE_URL = "https://social-analytics-beryl.vercel.app";

export default function PrivacyPolicy() {
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
            href="/terms"
            className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            Terms of Service →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-violet-500 mb-3 block">
            Legal
          </span>
          <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-xs text-zinc-600">
            Last updated: {LAST_UPDATED} · Effective date: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-8 text-sm text-zinc-400 leading-relaxed">

          <section>
            <p>
              This Privacy Policy describes how {APP_NAME} ("{APP_NAME}", "we", "us", or "our"),
              operated at <span className="text-zinc-300">{SITE_URL}</span>, collects, uses, and
              handles information when you use our social media analytics platform.
            </p>
          </section>

          <Section title="1. Information We Collect">
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>
                <strong className="text-zinc-300">Social Media Account Data</strong> — when you
                connect your Instagram or Facebook accounts via Meta's Graph API, we access page
                insights, post metrics (reach, impressions, engagement), follower data, and
                account identifiers as permitted by Meta's Platform Terms.
              </li>
              <li>
                <strong className="text-zinc-300">Usage Data</strong> — browser type, pages
                visited, time spent, and other diagnostic information to improve the service.
              </li>
              <li>
                <strong className="text-zinc-300">Content You Upload</strong> — script files
                (.docx) you upload for the content generation pipeline are processed in memory
                and are not stored permanently.
              </li>
              <li>
                <strong className="text-zinc-300">Communications</strong> — if you contact us
                directly, we may retain records of that correspondence.
              </li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-2">
              <li>To display social media performance analytics for your connected accounts.</li>
              <li>To generate AI-powered content ideas and trend analysis.</li>
              <li>To operate, maintain, and improve the platform.</li>
              <li>To comply with legal obligations.</li>
              <li>
                We do <strong className="text-zinc-300">not</strong> sell your personal
                information or social media data to third parties.
              </li>
            </ul>
          </Section>

          <Section title="3. Meta Platform Data">
            <p>
              This application uses the Meta Graph API to access Instagram and Facebook account
              data. By connecting your accounts you agree to Meta's Platform Terms and Data
              Policy. We only request permissions necessary for the analytics features described
              in this service. We comply with Meta's Platform Terms regarding data storage,
              deletion, and usage restrictions.
            </p>
            <p className="mt-3">
              Data obtained through the Meta API is used solely to provide in-app analytics
              and is not shared with unaffiliated third parties except as required by law.
            </p>
          </Section>

          <Section title="4. Third-Party Services">
            <p>We integrate with the following third-party services:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>
                <strong className="text-zinc-300">Meta Graph API</strong> — for Instagram and
                Facebook analytics data.
              </li>
              <li>
                <strong className="text-zinc-300">ElevenLabs</strong> — for AI audio generation
                from script content. Audio is processed and returned; scripts are not stored
                by us after processing.
              </li>
              <li>
                <strong className="text-zinc-300">HeyGen</strong> — for AI avatar video
                generation. Video generation requests are subject to HeyGen's own privacy policy.
              </li>
              <li>
                <strong className="text-zinc-300">Vercel</strong> — for hosting and deployment.
              </li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p>
              We retain social media analytics data only as long as necessary to provide the
              service. Uploaded script files are not persisted after processing. You may request
              deletion of your data at any time by contacting us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="6. Data Security">
            <p>
              We implement industry-standard security measures including HTTPS encryption,
              secure credential storage, and access controls. However, no method of transmission
              over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              This service is not directed at children under 13. We do not knowingly collect
              personal information from children under 13. If you believe we have inadvertently
              collected such information, please contact us immediately.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Withdraw consent for data processing.</li>
              <li>Lodge a complaint with a supervisory authority.</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify users of
              material changes by updating the "Last updated" date at the top of this page.
              Continued use of the service after changes constitutes acceptance of the updated
              policy.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>
              If you have questions about this Privacy Policy or our data practices, please
              contact us at:
            </p>
            <div className="mt-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-zinc-300 font-semibold">{APP_NAME}</p>
              <p className="mt-1">
                Email:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-violet-400 hover:text-violet-300 transition-colors"
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
          <Link href="/terms" className="text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors">
            Terms of Service
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
