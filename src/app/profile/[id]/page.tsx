import { notFound } from "next/navigation";
import { Star } from "lucide-react";

import { ListingCard } from "@/components/marketplace/listing-card";
import { ProfileSummary } from "@/components/marketplace/profile-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function ProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireConfirmedUser();
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: profile }, { data: listings }, { data: reviews }] = await Promise.all([
    supabase.from("public_profiles").select("*").eq("id", id).single(),
    supabase
      .from("listings")
      .select("*")
      .eq("seller_id", id)
      .eq("status", "available")
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select("*")
      .eq("reviewee_id", id)
      .order("created_at", { ascending: false })
      .limit(10)
  ]);

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <ProfileSummary profile={profile} />
          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>Institution: {profile.university_name}</p>
              <p>Domain: {profile.university_domain}</p>
              <p>Status: {profile.enrollment_status.replaceAll("_", " ")}</p>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Active listings</h1>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {(listings ?? []).map((listing) => (
                <ListingCard key={listing.id} listing={listing} seller={profile} />
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(reviews ?? []).map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-4 last:border-b-0">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{review.comment}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(review.created_at)}</p>
                </div>
              ))}
              {!reviews?.length ? (
                <p className="text-sm text-slate-500">No completed transaction reviews yet.</p>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
