import Link from "next/link";
import { Plus, SlidersHorizontal } from "lucide-react";

import { ListingCard } from "@/components/marketplace/listing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { demoListings, getDemoPublicProfileMap } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { listingCategories } from "@/lib/marketplace";
import { createClient } from "@/lib/supabase/server";
import type { Listing, ListingCategory, PublicProfile } from "@/types/database";

type SortOption = "newest" | "price_asc" | "price_desc";

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<{
    category?: ListingCategory;
    q?: string;
    sort?: SortOption;
    status?: "available" | "all";
  }>;
}) {
  await requireConfirmedUser();
  const params = await searchParams;
  const sort: SortOption = params.sort ?? "newest";
  const showAll = params.status === "all";
  let listings: Listing[] = [];
  let sellerMap = new Map<string, PublicProfile>();
  let errorMessage: string | null = null;

  if (!hasSupabaseEnv()) {
    listings = demoListings
      .filter((listing) => showAll || listing.status !== "sold")
      .filter((listing) => !params.category || listing.category === params.category)
      .filter(
        (listing) =>
          !params.q || listing.title.toLowerCase().includes(params.q.toLowerCase().trim())
      );

    if (sort === "price_asc") listings = [...listings].sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") listings = [...listings].sort((a, b) => b.price - a.price);

    sellerMap = getDemoPublicProfileMap();
  } else {
    const supabase = await createClient();
    let query = supabase.from("listings").select("*");

    if (!showAll) {
      query = query.neq("status", "sold");
    }

    if (params.category && listingCategories.includes(params.category)) {
      query = query.eq("category", params.category);
    }

    if (params.q) {
      query = query.ilike("title", `%${params.q}%`);
    }

    if (sort === "price_asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "price_desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
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

  const categoryCount = listingCategories.reduce(
    (acc, cat) => {
      acc[cat] = listings.filter((l) => l.category === cat).length;
      return acc;
    },
    {} as Record<string, number>
  );

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
          <Link href="/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            Create listing
          </Link>
        </Button>
      </div>

      <form className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_160px_auto]">
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
          <select
            name="sort"
            defaultValue={sort}
            className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
          <Button type="submit">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {listingCategories.map((cat) => {
            const active = params.category === cat;
            return (
              <button
                key={cat}
                type="submit"
                name="category"
                value={active ? "" : cat}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-slate-200 bg-white text-slate-600 hover:border-primary/50 hover:text-primary"
                }`}
              >
                {cat} {categoryCount[cat] ? `(${categoryCount[cat]})` : ""}
              </button>
            );
          })}
        </div>
      </form>

      {errorMessage ? (
        <Card className="mt-8">
          <CardContent className="p-6 text-red-700">{errorMessage}</CardContent>
        </Card>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            seller={sellerMap.get(listing.seller_id)}
          />
        ))}
      </div>

      {!listings.length && !errorMessage ? (
        <Card className="mt-8">
          <CardContent className="p-8 text-center text-slate-600">
            {params.q || params.category
              ? "No listings match your search. Try a different filter or category."
              : "No listings yet. Be the first verified student to post one."}
          </CardContent>
        </Card>
      ) : null}

      {listings.length > 0 ? (
        <p className="mt-6 text-center text-sm text-slate-400">
          {listings.length} listing{listings.length !== 1 ? "s" : ""} shown
        </p>
      ) : null}
    </main>
  );
}
