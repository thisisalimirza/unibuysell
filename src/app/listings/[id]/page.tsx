import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ShieldCheck, Tag } from "lucide-react";

import { createChatRoomAction, deleteListingAction } from "@/app/listings/actions";
import { ProfileSummary } from "@/components/marketplace/profile-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { getDemoListing, getDemoPublicProfile } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Listing, PublicProfile } from "@/types/database";

const conditionBadge: Record<string, string> = {
  New: "bg-emerald-100 text-emerald-700",
  "Like New": "bg-blue-100 text-blue-700",
  Good: "bg-amber-100 text-amber-700",
  Fair: "bg-slate-100 text-slate-600"
};

export default async function ListingDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireConfirmedUser();
  const { id } = await params;
  let listing: Listing | null = null;
  let seller: PublicProfile | null = null;

  if (!hasSupabaseEnv()) {
    listing = getDemoListing(id);
    seller = listing ? getDemoPublicProfile(listing.seller_id) : null;
  } else {
    const supabase = await createClient();
    const { data: listingData } = await supabase.from("listings").select("*").eq("id", id).single();
    listing = listingData;
    const { data: sellerData } = listing
      ? await supabase.from("public_profiles").select("*").eq("id", listing.seller_id).single()
      : { data: null };
    seller = sellerData;
  }

  if (!listing) notFound();

  const isOwner = user.id === listing.seller_id;
  const images = listing.images.length > 0 ? listing.images : ["/listing-placeholders/default.svg"];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
        <Link href="/listings">
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Images */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-black/[0.05]">
            <Image
              src={images[0]}
              alt={listing.title}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {images.slice(1).map((url) => (
                <div
                  key={url}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-black/[0.05]"
                >
                  <Image src={url} alt={listing.title} fill sizes="33vw" className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Main info card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.05]">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                <Tag className="h-3 w-3" />
                {listing.category}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${conditionBadge[listing.condition] ?? conditionBadge.Fair}`}>
                {listing.condition}
              </span>
              {listing.status !== "available" ? (
                <Badge variant={listing.status === "sold" ? "warning" : "secondary"} className="capitalize">
                  {listing.status}
                </Badge>
              ) : null}
            </div>

            {/* Title + price */}
            <h1 className="mt-3 text-2xl font-extrabold leading-tight text-slate-900">
              {listing.title}
            </h1>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-violet-700">
                {formatCurrency(listing.price)}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                Listed {formatDate(listing.created_at)}
              </span>
            </div>

            {/* Description */}
            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                {listing.description}
              </p>
            </div>

            {/* Sold notice */}
            {listing.status === "sold" ? (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                This one&apos;s gone. Check the listings page — something similar might be up.
              </div>
            ) : null}

            {/* Actions */}
            <div className="mt-5 flex flex-wrap gap-3">
              {isOwner ? (
                <>
                  <Button asChild variant="outline">
                    <Link href={`/listings/${listing.id}/edit`}>Edit listing</Link>
                  </Button>
                  <form action={deleteListingAction}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <Button variant="destructive" type="submit">Delete</Button>
                  </form>
                </>
              ) : (
                <form action={createChatRoomAction} className="w-full">
                  <input type="hidden" name="listingId" value={listing.id} />
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={listing.status === "sold"}
                  >
                    {listing.status === "sold" ? "Already sold — sorry!" : "Message them"}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Seller */}
          {seller ? <ProfileSummary profile={seller} /> : null}

          {/* Safety */}
          <Card className="border-amber-100 bg-amber-50">
            <CardContent className="flex items-start gap-3 p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Meet somewhere obvious</p>
                <p className="mt-0.5">
                  Student Union, library lobby, or residence hall front desk. Public, busy, zero stress.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
