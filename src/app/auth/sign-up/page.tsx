import { CheckCircle2, GraduationCap } from "lucide-react";

import { signUpAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/marketplace/auth-form";

const acceptedDomains = [
  { label: ".edu", desc: "US universities (harvard.edu, mit.edu, etc.)" },
  { label: ".ac.uk", desc: "UK universities (ox.ac.uk, cam.ac.uk, etc.)" },
  { label: ".edu.au", desc: "Australian universities (uq.edu.au, etc.)" },
  { label: ".edu.sg / .edu.hk", desc: "Singapore & Hong Kong universities" },
  { label: ".ac.nz / .ac.in", desc: "New Zealand & India universities" },
  { label: "Other national academic domains", desc: "We support most university email systems worldwide" }
];

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-100 opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-100 opacity-60 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
        {/* Left: what you're signing up for */}
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700">
            <GraduationCap className="h-4 w-4" />
            Your university email is your badge
          </div>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
            We check your email domain so you don't have to worry about who you're dealing with.
          </h2>

          <p className="mt-3 text-slate-500 leading-7">
            Anyone on this platform has been through the same check you're doing right now.
            That's the whole point — you shouldn't have to guess if the person you're buying
            from is actually a student.
          </p>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Accepted domains
            </p>
            {acceptedDomains.map((domain) => (
              <div key={domain.label} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-500" />
                <div>
                  <span className="font-semibold text-slate-800">{domain.label}</span>
                  <span className="ml-1.5 text-sm text-slate-500">{domain.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="text-sm font-semibold text-emerald-800">After you sign up</p>
            <p className="mt-1 text-sm text-emerald-700">
              Check your university inbox for a confirmation link. Once you click it,
              you're in and can start browsing or listing right away.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div>
          <AuthForm mode="sign-up" action={signUpAction} />
        </div>
      </div>
    </main>
  );
}
