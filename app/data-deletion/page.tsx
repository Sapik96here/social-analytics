export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-[#08090f] text-white px-6 py-16">
      <div className="max-w-2xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">User Data Deletion</h1>
          <p className="text-zinc-500 text-sm">Last updated: May 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">What data do we store?</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Mad Scientist Studio uses the TikTok and Meta APIs solely for reading analytics data
            (follower counts, post insights, trend signals). We do not store any personally
            identifiable information about your followers or third-party users. The only data we
            retain is your authorisation token and the analytics metrics you choose to track.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">How to request data deletion</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            If you have connected your TikTok or Meta account to this platform and wish to have
            your data removed, you can:
          </p>
          <ul className="list-disc list-inside text-zinc-400 text-sm space-y-2 pl-2">
            <li>Email us at <a href="mailto:shyafiq2596@gmail.com" className="text-violet-400 underline">shyafiq2596@gmail.com</a> with the subject line <span className="text-zinc-300 font-semibold">"Data Deletion Request"</span></li>
            <li>Revoke access directly from your TikTok or Meta account settings under <span className="text-zinc-300">Manage App Permissions</span></li>
          </ul>
          <p className="text-zinc-400 text-sm leading-relaxed">
            We will process your request and confirm deletion within <span className="text-white font-semibold">30 days</span>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Automated deletion callback</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            When you revoke app permissions on TikTok or Meta, those platforms automatically
            notify us via a secure callback. Upon receiving this notification we immediately
            remove your access token and any associated analytics data from our systems.
          </p>
          <div className="bg-[#0f1020] border border-white/[0.06] rounded-xl px-4 py-3">
            <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Callback endpoint</p>
            <p className="text-sm font-mono text-violet-300">POST https://social-analytics-beryl.vercel.app/api/data-deletion</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Contact</h2>
          <p className="text-zinc-400 text-sm">
            For any privacy-related questions, contact us at{" "}
            <a href="mailto:shyafiq2596@gmail.com" className="text-violet-400 underline">
              shyafiq2596@gmail.com
            </a>
          </p>
        </section>

        <div className="pt-4 border-t border-white/[0.06]">
          <a href="/" className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors">← Back to home</a>
        </div>

      </div>
    </div>
  );
}
