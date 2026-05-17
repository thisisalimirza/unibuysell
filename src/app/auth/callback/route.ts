import { NextResponse, type NextRequest } from "next/server";

import {
  deriveUniversityName,
  getEmailDomain,
  isInstitutionalEmail
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/sign-in?message=Invalid%20confirmation%20link.`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/sign-in?message=${encodeURIComponent(error.message)}`
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email || !isInstitutionalEmail(user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      `${origin}/auth/sign-in?message=Only%20institutional%20email%20accounts%20are%20allowed.`
    );
  }

  const domain = getEmailDomain(user.email);
  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: String(user.user_metadata.full_name ?? "Verified student"),
    email: user.email.toLowerCase(),
    university_domain: domain,
    university_name: String(user.user_metadata.university_name ?? deriveUniversityName(domain)),
    enrollment_status: "verified_student",
    verified_at: user.email_confirmed_at ?? new Date().toISOString()
  });

  return NextResponse.redirect(`${origin}${next}`);
}
