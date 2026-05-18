import Link from "next/link";
import { CheckCircle2, GraduationCap, Star } from "lucide-react";

import type { PublicProfile } from "@/types/database";

const avatarGradients = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-500"
];

function getGradient(id: string) {
  const code = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return avatarGradients[code % avatarGradients.length];
}

type ProfileSummaryProps = {
  profile: PublicProfile;
};

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  const initials = profile.full_name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const gradient = getGradient(profile.id);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.05]">
      {/* Gradient header strip */}
      <div className={`h-14 bg-gradient-to-r ${gradient} opacity-80`} />

      <div className="-mt-7 px-5 pb-5">
        {/* Avatar */}
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-base font-bold text-white shadow-md ring-2 ring-white`}>
          {initials}
        </div>

        <div className="mt-3">
          <Link
            href={`/profile/${profile.id}`}
            className="font-bold text-slate-900 hover:text-violet-600 transition-colors"
          >
            {profile.full_name}
          </Link>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
              {profile.university_name}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${star <= Math.round(profile.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-800">{profile.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({profile.review_count} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
