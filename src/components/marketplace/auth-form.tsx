"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import type { AuthActionState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  action: (prevState: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  message?: string;
};

function SubmitButton({ mode }: { mode: AuthFormProps["mode"] }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending
        ? "Please wait…"
        : mode === "sign-in"
          ? "Sign in to marketplace"
          : "Create verified account"}
    </Button>
  );
}

export function AuthForm({ mode, action, message }: AuthFormProps) {
  const [state, formAction] = useActionState(action, {});
  const isSignUp = mode === "sign-up";

  const feedbackText = state.error ?? state.success ?? message;
  const isSuccess = !state.error && (state.success || message);

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-200">
          <span className="text-lg font-bold text-white">UB</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isSignUp ? "Join UniBuySell" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isSignUp
            ? "Only verified university and medical school emails accepted."
            : "Sign in with your confirmed institutional email."}
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/[0.05]">
        <form action={formAction} className="space-y-5">
          {isSignUp ? (
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" autoComplete="name" placeholder="Your full name" required />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="email">University email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              placeholder="you@school.edu"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {!isSignUp ? (
                <span className="text-xs text-slate-400">Min. 8 characters</span>
              ) : null}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              minLength={8}
            />
          </div>

          {feedbackText ? (
            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-sm ${
                isSuccess
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-100 bg-red-50 text-red-700"
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-red-500" />
              )}
              {feedbackText}
            </div>
          ) : null}

          <SubmitButton mode={mode} />
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            className="font-semibold text-violet-600 hover:text-violet-700 hover:underline"
            href={isSignUp ? "/auth/sign-in" : "/auth/sign-up"}
          >
            {isSignUp ? "Sign in" : "Join free"}
          </Link>
        </div>
      </div>
    </div>
  );
}
