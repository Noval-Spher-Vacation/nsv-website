import { Link } from "react-router";

export default function AccessRequiredPage() {
  return (
    <div className="min-h-screen bg-[#07060c] text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full glass-panel rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(255,72,170,0.28)] p-10 text-center">
        <p className="uppercase text-xs tracking-[0.5em] text-white/60 mb-4">
          Cloudflare Access
        </p>
        <h1 className="neon-title text-4xl md:text-5xl font-semibold mb-4">
          Access Required
        </h1>
        <p className="text-white/70 text-lg leading-relaxed">
          This staff area is protected by Cloudflare Zero Trust Access. Open the
          dashboard through your approved Access policy to continue.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="cta-glow bg-white/10 border border-white/25 px-6 py-3 rounded-full font-semibold inline-flex items-center justify-center"
          >
            Back to Home
          </Link>
          <a
            href="https://one.dash.cloudflare.com/"
            className="cta-glow bg-gradient-to-r from-[#ff2d94] to-[#b44bff] text-black px-6 py-3 rounded-full font-semibold inline-flex items-center justify-center"
            target="_blank"
            rel="noreferrer"
          >
            Open Zero Trust
          </a>
        </div>
      </div>
    </div>
  );
}
