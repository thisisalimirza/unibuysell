import Link from "next/link";
import { MessageSquare, Package, ShieldCheck, Star } from "lucide-react";

import { ListingCard } from "@/components/marketplace/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { PublicProfile } from "@/types/database";

export default async function DashboardPage() {
  const user = await requireConfirmedUser();
  const supabase = await createClient();

  const [
    { data: profile },
    { data: myListings },
    { count: messageCount },
    { data: latestListings }
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("listings")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("chat_rooms")
      .select("id", { count: "exact", head: true })
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`),
    supabase
      .from("listings")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .limit(4)
  ]);

  const sellerIds = Array.from(new Set((latestListings ?? []).map((listing) => listing.seller_id)));
  const { data: sellers } = sellerIds.length
    ? await supabase.from("public_profiles").select("*").in("id", sellerIds)
    : { data: [] as PublicProfile[] };
  const sellerMap = new Map((sellers ?? []).map((seller) => [seller.id, seller]));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Badge variant="verified" className="mb-3">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
            Email confirmed
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Welcome, {profile?.full_name ?? "verified student"}
          </h1>
          <p className="mt-2 text-slate-600">
            {profile?.university_name ?? "Your institution"} ·{" "}
            {profile?.enrollment_status.replaceAll("_", " ") ?? "verified student"}
          </p>
        </div>
        <Button asChild>
          <Link href="/listings/new">Create listing</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Your listings</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myListings?.length ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Message rooms</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{messageCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Trust rating</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile?.rating.toFixed(1) ?? "5.0"}</div>
          </CardContent>
        </Card>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-950">Latest verified listings</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/listings">View all</Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(latestListings ?? []).map((listing) => (
            <ListingCard key={listing.id} listing={listing} seller={sellerMap.get(listing.seller_id)} />
          ))}
        </div>
      </section>
    </main>
  );
}
