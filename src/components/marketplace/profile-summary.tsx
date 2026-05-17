import Link from "next/link";
import { CheckCircle2, GraduationCap, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PublicProfile } from "@/types/database";

type ProfileSummaryProps = {
  profile: PublicProfile;
};

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
          {profile.full_name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/profile/${profile.id}`} className="font-semibold text-slate-950 hover:underline">
            {profile.full_name}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="verified">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              Verified
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <GraduationCap className="h-3.5 w-3.5" />
              {profile.university_name}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {profile.rating.toFixed(1)} ({profile.review_count})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
