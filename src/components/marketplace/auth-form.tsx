"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { AuthActionState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Securing account..." : mode === "sign-in" ? "Sign in" : "Create verified account"}
    </Button>
  );
}

export function AuthForm({ mode, action, message }: AuthFormProps) {
  const [state, formAction] = useActionState(action, {});
  const isSignUp = mode === "sign-up";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isSignUp ? "Join with your school email" : "Welcome back"}</CardTitle>
        <CardDescription>
          {isSignUp
            ? "Only verified college and medical school addresses can enter UniBuySell."
            : "Use your confirmed institutional email to access the marketplace."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {isSignUp ? (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" autoComplete="name" required />
            </div>
          ) : null}
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              minLength={8}
            />
          </div>
          {(message || state.error || state.success) && (
            <div
              className={`rounded-xl border p-3 text-sm ${
                state.error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {state.error ?? state.success ?? message}
            </div>
          )}
          <SubmitButton mode={mode} />
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          {isSignUp ? "Already verified?" : "Need a verified account?"}{" "}
          <Link
            className="font-semibold text-primary hover:underline"
            href={isSignUp ? "/auth/sign-in" : "/auth/sign-up"}
          >
            {isSignUp ? "Sign in" : "Join UniBuySell"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
