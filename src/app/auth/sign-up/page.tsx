import { CheckCircle2 } from "lucide-react";

import { signUpAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/marketplace/auth-form";

const acceptedDomains = [
  ".edu (US universities)",
  ".ac.uk (UK universities)",
  ".edu.au (Australian universities)",
  ".ac.nz (New Zealand)",
  ".edu.sg (Singapore)",
  "and other national academic domains"
];

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center gap-12 px-4 py-12 lg:grid lg:grid-cols-2">
      <div className="hidden lg:block">
        <h2 className="text-2xl font-bold text-slate-950">
          Accepted university email domains
        </h2>
        <p className="mt-3 text-slate-600">
          We verify your institution through your email domain. Only confirmed academic
          addresses can access the marketplace.
        </p>
        <ul className="mt-6 space-y-3">
          {acceptedDomains.map((domain) => (
            <li key={domain} className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 flex-none text-emerald-600" />
              {domain}
            </li>
          ))}
        </ul>
        <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          After sign-up, check your university inbox for a confirmation link. You can browse
          the marketplace once your email is confirmed.
        </p>
      </div>
      <div className="w-full">
        <AuthForm mode="sign-up" action={signUpAction} />
      </div>
    </main>
  );
}
