import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const publicEmailDomains = new Set([
  "aol.com",
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "mail.com",
  "me.com",
  "msn.com",
  "outlook.com",
  "proton.me",
  "protonmail.com",
  "yahoo.com",
  "ymail.com"
]);

export function getEmailDomain(email: string) {
  return email.trim().toLowerCase().split("@").at(1) ?? "";
}

export function isInstitutionalEmail(email: string) {
  const domain = getEmailDomain(email);

  if (!domain || publicEmailDomains.has(domain)) {
    return false;
  }

  return (
    domain.endsWith(".edu") ||
    domain.endsWith("mail.edu") ||
    domain.endsWith(".edu.get") ||
    domain.endsWith("edu.get")
  );
}

export function getInstitutionalEmailError(email: string) {
  if (isInstitutionalEmail(email)) {
    return null;
  }

  return "Use a valid university or medical school email. Public email providers are not accepted.";
}

export function deriveUniversityName(domain: string) {
  const cleaned = domain
    .replace(/\.edu\.get$/, "")
    .replace(/\.edu$/, "")
    .split(".")
    .filter((part) => !["mail", "student", "students", "email"].includes(part))
    .at(-1);

  if (!cleaned) {
    return "Verified Institution";
  }

  return cleaned
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function requireConfirmedUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  if (!user.email_confirmed_at) {
    redirect(
      "/auth/sign-in?message=Please%20confirm%20your%20university%20email%20before%20entering%20the%20marketplace."
    );
  }

  return user;
}
