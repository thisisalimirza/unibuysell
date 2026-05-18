"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { ProfileActionState } from "@/app/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Profile } from "@/types/database";

type ProfileEditFormProps = {
  profile: Profile;
  action: (prevState: ProfileActionState, formData: FormData) => Promise<ProfileActionState>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save profile"}
    </Button>
  );
}

export function ProfileEditForm({ profile, action }: ProfileEditFormProps) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.error || state.success ? (
        <div
          className={`rounded-xl border p-3 text-sm ${
            state.error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {state.error ?? state.success}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" defaultValue={profile.full_name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="university_name">University / School name</Label>
        <Input
          id="university_name"
          name="university_name"
          defaultValue={profile.university_name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="enrollment_status">Enrollment status</Label>
        <Select
          id="enrollment_status"
          name="enrollment_status"
          defaultValue={profile.enrollment_status}
          required
        >
          <option value="verified_student">Verified student</option>
          <option value="verified_medical_student">Verified medical student</option>
        </Select>
      </div>

      <div className="space-y-1">
        <Label>Verified email domain</Label>
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
          @{profile.university_domain}
        </p>
        <p className="text-xs text-slate-400">Domain is tied to your confirmed email and cannot be changed.</p>
      </div>

      <SubmitButton />
    </form>
  );
}
