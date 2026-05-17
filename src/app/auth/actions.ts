"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  deriveUniversityName,
  getEmailDomain,
  getInstitutionalEmailError
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

const signUpSchema = credentialsSchema.extend({
  fullName: z.string().min(2, "Enter your full name.")
});

export type AuthActionState = {
  error?: string;
  success?: string;
};

async function getOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const host = headerStore.get("host");

  if (origin) {
    return origin;
  }

  return host ? `https://${host}` : "http://localhost:3000";
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your sign-up details." };
  }

  const emailError = getInstitutionalEmailError(parsed.data.email);
  if (emailError) {
    return { error: emailError };
  }

  const domain = getEmailDomain(parsed.data.email);
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email.trim().toLowerCase(),
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${await getOrigin()}/auth/callback`,
      data: {
        full_name: parsed.data.fullName.trim(),
        university_domain: domain,
        university_name: deriveUniversityName(domain),
        enrollment_status: "verified_student"
      }
    }
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "Check your university inbox to confirm your email. You can enter the marketplace after confirmation."
  };
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your sign-in details." };
  }

  const emailError = getInstitutionalEmailError(parsed.data.email);
  if (emailError) {
    return { error: emailError };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email.trim().toLowerCase(),
    password: parsed.data.password
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
