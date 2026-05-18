import Link from "next/link";
import { Plus, Search } from "lucide-react";

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

const categoryIcons: Record<string, string> = {
  Textbooks: "📚",
  "Medical Gear": "🩺",
  Electronics: "💻",
  Subleases: "🏠"
};

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<{
    category?: ListingCategory;
    q?: string;
    sort?: SortOption;
  }>;
}) {
  await requireConfirmedUser();
  const params = await searchParams;
  const sort: SortOption = params.sort ?? "newest";
  let listings: Listing[] = [];
  let sellerMap = new Map<string, PublicProfile>();
  let errorMessage: string | null = null;

  if (!hasSupabaseEnv()) {
    listings = demoListings
      .filter((l) => l.status !== "sold")
      .filter((l) => !params.category || l.category === params.category)
      .filter((l) => !params.q || l.title.toLowerCase().includes(params.q.toLowerCase().trim()));

    if (sort === "price_asc") listings = [...listings].sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") listings = [...listings].sort((a, b) => b.price - a.price);

    sellerMap = getDemoPublicProfileMap();
  } else {
    const supabase = await createClient();
    let query = supabase.from("listings").select("*").neq("status", "sold");

    if (params.category && listingCategories.includes(params.category)) {
      query = query.eq("category", params.category);
    }
    if (params.q) {
      query = query.ilike("title", `%${params.q}%`);
    }
    if (sort === "price_asc") query = query.order("price", { ascending: true });
    else if (sort === "price_desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    listings = data ?? [];
    errorMessage = error?.message ?? null;

    const sellerIds = Array.from(new Set(listings.map((l) => l.seller_id)));
    const { data: sellers } = sellerIds.length
      ? await supabase.from("public_profiles").select("*").in("id", sellerIds)
      : { data: [] as PublicProfile[] };
    sellerMap = new Map((sellers ?? []).map((s) => [s.id, s]));
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Verified listings
          </h1>
          <p className="mt-1.5 text-slate-500">
            {listings.length > 0
              ? `${listings.length} item${listings.length !== 1 ? "s" : ""} from confirmed students`
              : "From confirmed university students — contact via private chat"}
          </p>
        </div>
        <Button asChild>
          <Link href="/listings/new">
            <Plus className="h-4 w-4" />
            Post listing
          </Link>
        </Button>
      </div>

      {/* Category pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        <form>
          <button
            type="submit"
            name="category"
            value=""
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              !params.category
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-violet-300 hover:text-violet-700"
            }`}
          >
            All
          </button>
        </form>
        {listingCategories.map((cat) => {
          const active = params.category === cat;
          return (
            <form key={cat}>
              <button
                type="submit"
                name="category"
                value={active ? "" : cat}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                  active
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-violet-300 hover:text-violet-700"
                }`}
              >
                {categoryIcons[cat]} {cat}
              </button>
            </form>
          );
        })}
      </div>

      {/* Search + sort */}
      <form className="mt-4 flex flex-col gap-3 sm:flex-row">
        {params.category ? (
          <input type="hidden" name="category" value={params.category} />
        ) : null}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search listings…"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-300"
          />
        </div>
        <select
          name="sort"
          defaultValue={sort}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
        <Button type="submit" variant="outline">Filter</Button>
      </form>

      {/* Error */}
      {errorMessage ? (
        <Card className="mt-6">
          <CardContent className="p-5 text-sm text-red-700">{errorMessage}</CardContent>
        </Card>
      ) : null}

      {/* Grid */}
      {listings.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              seller={sellerMap.get(listing.seller_id)}
            />
          ))}
        </div>
      ) : !errorMessage ? (
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
            {params.category ? categoryIcons[params.category] ?? "🔍" : "🔍"}
          </div>
          <div>
            <p className="font-bold text-slate-800">No listings found</p>
            <p className="mt-1 text-sm text-slate-500">
              {params.q || params.category
                ? "Try a different search or category."
                : "Be the first to post something."}
            </p>
          </div>
          <Button asChild>
            <Link href="/listings/new">
              <Plus className="h-4 w-4" />
              Create listing
            </Link>
          </Button>
        </div>
      ) : null}
    </main>
  );
}
