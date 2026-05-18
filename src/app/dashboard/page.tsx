import Link from "next/link";
import { MessageSquare, Package, Plus, ShieldCheck, Star, TrendingUp } from "lucide-react";

import { ListingCard } from "@/components/marketplace/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import {
  demoListings,
  getDemoProfile,
  getDemoPublicProfileMap,
  getDemoRoomsForUser
} from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import type { Listing, Profile, PublicProfile } from "@/types/database";

export default async function DashboardPage() {
  const user = await requireConfirmedUser();
  let profile: Profile | null = null;
  let myListings: Listing[] = [];
  let myListingCount = 0;
  let messageCount = 0;
  let latestListings: Listing[] = [];
  let sellerMap = new Map<string, PublicProfile>();

  if (!hasSupabaseEnv()) {
    profile = getDemoProfile(user.id);
    myListings = demoListings.filter((listing) => listing.seller_id === user.id);
    myListingCount = myListings.length;
    messageCount = getDemoRoomsForUser(user.id).length;
    latestListings = demoListings.filter((listing) => listing.status === "available").slice(0, 4);
    sellerMap = getDemoPublicProfileMap();
  } else {
    const supabase = await createClient();
    const [
      { data: profileData },
      { data: myListingData, count: listingTotal },
      { count: roomCount },
      { data: latestListingData }
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("listings")
        .select("*", { count: "exact" })
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("chat_rooms")
        .select("id", { count: "exact", head: true })
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`),
      supabase
        .from("listings")
        .select("*")
        .neq("seller_id", user.id)
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(4)
    ]);

    profile = profileData;
    myListings = myListingData ?? [];
    myListingCount = listingTotal ?? 0;
    messageCount = roomCount ?? 0;
    latestListings = latestListingData ?? [];
    const sellerIds = Array.from(new Set(latestListings.map((listing) => listing.seller_id)));
    const { data: sellers } = sellerIds.length
      ? await supabase.from("public_profiles").select("*").in("id", sellerIds)
      : { data: [] as PublicProfile[] };
    sellerMap = new Map((sellers ?? []).map((seller) => [seller.id, seller]));
  }

  const activeListingCount = myListings.filter((l) => l.status === "available").length;
  const totalListingValue = myListings
    .filter((l) => l.status === "available")
    .reduce((sum, l) => sum + l.price, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Badge variant="verified" className="mb-3">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
            Email confirmed
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Welcome back, {profile?.full_name?.split(" ")[0] ?? "verified student"}
          </h1>
          <p className="mt-2 text-slate-600">
            {profile?.university_name ?? "Your institution"} ·{" "}
            {profile?.enrollment_status?.replaceAll("_", " ") ?? "verified student"}
          </p>
        </div>
        <Button asChild>
          <Link href="/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            Create listing
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total listings</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myListingCount}</div>
            <p className="mt-1 text-xs text-slate-500">{activeListingCount} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Message rooms</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{messageCount}</div>
            <p className="mt-1 text-xs text-slate-500">
              <Link href="/chats" className="text-primary hover:underline">
                View messages
              </Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Trust rating</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile?.rating.toFixed(1) ?? "5.0"}</div>
            <p className="mt-1 text-xs text-slate-500">{profile?.review_count ?? 0} reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Listed value</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalListingValue)}</div>
            <p className="mt-1 text-xs text-slate-500">across active listings</p>
          </CardContent>
        </Card>
      </div>

      {myListings.length > 0 ? (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">Your listings</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/profile/${user.id}`}>View all</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {myListings.slice(0, 4).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      ) : (
        <Card className="mt-10">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <Package className="h-10 w-10 text-slate-300" />
            <div>
              <p className="font-semibold text-slate-700">No listings yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Post your first item — textbooks, gear, electronics, or a sublease.
              </p>
            </div>
            <Button asChild>
              <Link href="/listings/new">Create your first listing</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-950">Latest verified listings</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/listings">View all</Link>
          </Button>
        </div>
        {latestListings.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latestListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                seller={sellerMap.get(listing.seller_id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-slate-500">
              No listings from other verified students yet. Check back soon.
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
