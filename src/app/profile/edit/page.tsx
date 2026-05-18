import { notFound } from "next/navigation";

import { updateProfileAction } from "@/app/profile/actions";
import { ProfileEditForm } from "@/components/marketplace/profile-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { getDemoProfile } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export default async function ProfileEditPage() {
  const user = await requireConfirmedUser();
  let profile: Profile | null = null;

  if (!hasSupabaseEnv()) {
    profile = getDemoProfile(user.id);
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>
            Update your name, school, and status. Your email domain is locked in — that&apos;s what makes you verified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileEditForm profile={profile} action={updateProfileAction} />
        </CardContent>
      </Card>
    </main>
  );
}
