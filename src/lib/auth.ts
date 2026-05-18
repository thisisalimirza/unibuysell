import { redirect } from "next/navigation";

import { demoCurrentUserId, getDemoProfile } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
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
    domain.endsWith(".edu") ||         // US universities (harvard.edu, mit.edu)
    domain.endsWith(".ac.uk") ||       // UK universities (ox.ac.uk, cam.ac.uk)
    domain.endsWith(".edu.au") ||      // Australian universities (uq.edu.au)
    domain.endsWith(".ac.nz") ||       // New Zealand universities
    domain.endsWith(".ac.za") ||       // South African universities
    domain.endsWith(".edu.sg") ||      // Singapore universities
    domain.endsWith(".edu.hk") ||      // Hong Kong universities
    domain.endsWith(".ac.in") ||       // Indian universities
    domain.endsWith(".edu.mx") ||      // Mexican universities
    domain.endsWith(".edu.br") ||      // Brazilian universities
    domain.endsWith(".edu.co") ||      // Colombian universities
    domain.endsWith(".edu.ar")         // Argentine universities
  );
}

export function getInstitutionalEmailError(email: string) {
  if (isInstitutionalEmail(email)) {
    return null;
  }

  return "Use a valid university or medical school email (.edu, .ac.uk, .edu.au, etc.). Public email providers are not accepted.";
}

export function deriveUniversityName(domain: string) {
  const cleaned = domain
    .replace(/\.(edu|ac)\.(uk|au|nz|za|sg|hk|in|mx|br|co|ar)$/, "")
    .replace(/\.edu$/, "")
    .split(".")
    .filter((part) => !["mail", "student", "students", "email", "ac", "my"].includes(part))
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
  if (!hasSupabaseEnv()) {
    const demoProfile = getDemoProfile(demoCurrentUserId);

    return {
      id: demoCurrentUserId,
      email: demoProfile?.email ?? "demo@demo.edu",
      email_confirmed_at: new Date().toISOString()
    };
  }

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
