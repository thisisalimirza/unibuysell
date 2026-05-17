import Link from "next/link";

import { ListingCard } from "@/components/marketplace/listing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { demoListings, getDemoPublicProfileMap } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { listingCategories } from "@/lib/marketplace";
import { createClient } from "@/lib/supabase/server";
import type { Listing, ListingCategory, PublicProfile } from "@/types/database";

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: ListingCategory; q?: string }>;
}) {
  await requireConfirmedUser();
  const params = await searchParams;
  let listings: Listing[] = [];
  let sellerMap = new Map<string, PublicProfile>();
  let errorMessage: string | null = null;

  if (!hasSupabaseEnv()) {
    listings = demoListings
      .filter((listing) => listing.status !== "sold")
      .filter((listing) => !params.category || listing.category === params.category)
      .filter(
        (listing) =>
          !params.q || listing.title.toLowerCase().includes(params.q.toLowerCase().trim())
      );
    sellerMap = getDemoPublicProfileMap();
  } else {
    const supabase = await createClient();
    let query = supabase
      .from("listings")
      .select("*")
      .neq("status", "sold")
      .order("created_at", { ascending: false });

    if (params.category && listingCategories.includes(params.category)) {
      query = query.eq("category", params.category);
    }

    if (params.q) {
      query = query.ilike("title", `%${params.q}%`);
    }

    const { data, error } = await query;
    listings = data ?? [];
    errorMessage = error?.message ?? null;
    const sellerIds = Array.from(new Set(listings.map((listing) => listing.seller_id)));
    const { data: sellers } = sellerIds.length
      ? await supabase.from("public_profiles").select("*").in("id", sellerIds)
      : { data: [] as PublicProfile[] };
    sellerMap = new Map((sellers ?? []).map((seller) => [seller.id, seller]));
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Verified listings</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Browse campus-vetted offers from confirmed students. Contact sellers through private
            marketplace chat.
          </p>
        </div>
        <Button asChild>
          <Link href="/listings/new">Create listing</Link>
        </Button>
      </div>

      <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_auto]">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search textbooks, gear, electronics..."
          className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <select
          name="category"
          defaultValue={params.category ?? ""}
          className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All categories</option>
          {listingCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <Button type="submit">Filter</Button>
      </form>

      {errorMessage ? (
        <Card className="mt-8">
          <CardContent className="p-6 text-red-700">{errorMessage}</CardContent>
        </Card>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} seller={sellerMap.get(listing.seller_id)} />
        ))}
      </div>

      {!listings.length ? (
        <Card className="mt-8">
          <CardContent className="p-8 text-center text-slate-600">
            No matching listings yet. Be the first verified student to post one.
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
