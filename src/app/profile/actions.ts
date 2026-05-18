"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireConfirmedUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const profileUpdateSchema = z.object({
  full_name: z.string().min(2, "Enter your full name.").max(120),
  enrollment_status: z.enum(["verified_student", "verified_medical_student"]),
  university_name: z.string().min(2, "Enter your school name.").max(120)
});

export type ProfileActionState = {
  error?: string;
  success?: string;
};

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const user = await requireConfirmedUser();
  const parsed = profileUpdateSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your profile details." };
  }

  if (!hasSupabaseEnv()) {
    return { success: "Demo mode — profile changes don't persist without Supabase." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      enrollment_status: parsed.data.enrollment_status,
      university_name: parsed.data.university_name,
      updated_at: new Date().toISOString()
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/profile/${user.id}`);
  return { success: "Profile updated successfully." };
}
