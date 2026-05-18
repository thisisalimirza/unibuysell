import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Settings } from "lucide-react";

import { ListingCard } from "@/components/marketplace/listing-card";
import { ProfileSummary } from "@/components/marketplace/profile-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { demoReviews, getDemoListingsForSeller, getDemoPublicProfile } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Listing, PublicProfile, Review } from "@/types/database";

export default async function ProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireConfirmedUser();
  const { id } = await params;
  let profile: PublicProfile | null = null;
  let listings: Listing[] = [];
  let reviews: Review[] = [];

  if (!hasSupabaseEnv()) {
    profile = getDemoPublicProfile(id);
    listings = getDemoListingsForSeller(id).filter((listing) => listing.status === "available");
    reviews = demoReviews.filter((review) => review.reviewee_id === id);
  } else {
    const supabase = await createClient();
    const [{ data: profileData }, { data: listingData }, { data: reviewData }] =
      await Promise.all([
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
          .limit(20)
      ]);

    profile = profileData;
    listings = listingData ?? [];
    reviews = reviewData ?? [];
  }

  if (!profile) {
    notFound();
  }

  const isOwnProfile = user.id === id;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <ProfileSummary profile={profile} />

          {isOwnProfile ? (
            <Button asChild variant="outline" className="w-full">
              <Link href="/profile/edit">
                <Settings className="mr-2 h-4 w-4" />
                Edit profile
              </Link>
            </Button>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Verified student ✓</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>School: {profile.university_name}</p>
              <p>Email domain: @{profile.university_domain}</p>
              <p>Status: {profile.enrollment_status.replaceAll("_", " ")}</p>
              {profile.verified_at ? (
                <p className="text-emerald-700">
                  On here since {formatDate(profile.verified_at)}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-8">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-950">
                {isOwnProfile ? "Your stuff for sale" : "What they're selling"}
              </h1>
              {isOwnProfile ? (
                <Button asChild size="sm">
                  <Link href="/listings/new">New listing</Link>
                </Button>
              ) : null}
            </div>
            {listings.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} seller={profile} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-slate-500">
                  {isOwnProfile
                    ? "Nothing listed yet — got something taking up space? List it!"
                    : "Nothing for sale right now. Check back later."}
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reviews from other students{reviews.length > 0 ? ` (${reviews.length})` : ""}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-4 last:border-b-0">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                      {Array.from({ length: 5 - review.rating }).map((_, index) => (
                        <Star key={`empty-${index}`} className="h-4 w-4 text-slate-200" />
                      ))}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{review.comment}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDate(review.created_at)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No reviews yet — complete a sale to get your first one.</p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
