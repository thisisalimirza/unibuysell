import { CheckCircle2, GraduationCap } from "lucide-react";

import { signUpAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/marketplace/auth-form";

const acceptedDomains = [
  ".edu — US universities (harvard.edu, mit.edu…)",
  ".ac.uk — UK universities (ox.ac.uk, cam.ac.uk…)",
  ".edu.au — Australian universities (uq.edu.au…)",
  ".edu.sg, .edu.hk — Singapore, Hong Kong",
  ".ac.nz, .ac.in — New Zealand, India",
  "And other official academic domains"
];

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-100 opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-100 opacity-60 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
        {/* Left side info panel */}
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700">
            <GraduationCap className="h-4 w-4" />
            Accepted email domains
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
            Only verified university emails can join.
          </h2>
          <p className="mt-3 text-slate-500">
            We check your domain automatically. If your university isn't listed, email us — we
            add new institutions regularly.
          </p>
          <ul className="mt-6 space-y-3">
            {acceptedDomains.map((domain) => (
              <li key={domain} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-500" />
                {domain}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="text-sm font-semibold text-emerald-800">After signing up</p>
            <p className="mt-1 text-sm text-emerald-700">
              Check your university inbox for a confirmation link. You can browse the
              marketplace immediately after confirming.
            </p>
          </div>
        </div>

        {/* Right side form */}
        <div>
          <AuthForm mode="sign-up" action={signUpAction} />
        </div>
      </div>
    </main>
  );
}
