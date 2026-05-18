import Link from "next/link";
import { MessageSquare, Package, Plus, ShieldCheck, Star, TrendingUp, ArrowRight } from "lucide-react";

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

const statCards = [
  {
    key: "listings",
    label: "Total listings",
    icon: Package,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600"
  },
  {
    key: "messages",
    label: "Message rooms",
    icon: MessageSquare,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    key: "rating",
    label: "Trust rating",
    icon: Star,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600"
  },
  {
    key: "value",
    label: "Listed value",
    icon: TrendingUp,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600"
  }
];

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
    myListings = demoListings.filter((l) => l.seller_id === user.id);
    myListingCount = myListings.length;
    messageCount = getDemoRoomsForUser(user.id).length;
    latestListings = demoListings.filter((l) => l.status === "available").slice(0, 4);
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

    const sellerIds = Array.from(new Set(latestListings.map((l) => l.seller_id)));
    const { data: sellers } = sellerIds.length
      ? await supabase.from("public_profiles").select("*").in("id", sellerIds)
      : { data: [] as PublicProfile[] };
    sellerMap = new Map((sellers ?? []).map((s) => [s.id, s]));
  }

  const activeCount = myListings.filter((l) => l.status === "available").length;
  const totalValue = myListings.filter((l) => l.status === "available").reduce((s, l) => s + l.price, 0);

  const statValues: Record<string, string> = {
    listings: String(myListingCount),
    messages: String(messageCount),
    rating: profile?.rating.toFixed(1) ?? "5.0",
    value: formatCurrency(totalValue)
  };

  const statSubs: Record<string, string> = {
    listings: `${activeCount} active`,
    messages: messageCount > 0 ? "View all →" : "No rooms yet",
    rating: `${profile?.review_count ?? 0} reviews`,
    value: "across active listings"
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Badge variant="verified" className="mb-3">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Email confirmed
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Hey, {profile?.full_name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="mt-1.5 text-slate-500">
            {profile?.university_name ?? "Your institution"} ·{" "}
            {profile?.enrollment_status?.replaceAll("_", " ") ?? "verified student"}
          </p>
        </div>
        <Button asChild>
          <Link href="/listings/new">
            <Plus className="h-4 w-4" />
            New listing
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{card.label}</CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBg}`}>
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-slate-900">{statValues[card.key]}</div>
              <p className="mt-0.5 text-xs text-slate-400">
                {card.key === "messages" && messageCount > 0 ? (
                  <Link href="/chats" className="text-violet-600 hover:underline">
                    {statSubs[card.key]}
                  </Link>
                ) : (
                  statSubs[card.key]
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My listings */}
      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Your listings</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/profile/${user.id}`}>
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {myListings.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {myListings.slice(0, 4).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
              <Package className="h-7 w-7 text-violet-400" />
            </div>
            <div>
              <p className="font-bold text-slate-800">No listings yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Post your first item — textbooks, gear, electronics, or a sublease.
              </p>
            </div>
            <Button asChild>
              <Link href="/listings/new">
                <Plus className="h-4 w-4" />
                Create your first listing
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* Latest from others */}
      <section className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Latest from verified students</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/listings">
              Browse all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
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
              No listings from others yet. Invite a classmate!
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
