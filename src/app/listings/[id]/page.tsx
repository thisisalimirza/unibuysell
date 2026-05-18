import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

import { createChatRoomAction, deleteListingAction } from "@/app/listings/actions";
import { ProfileSummary } from "@/components/marketplace/profile-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { getDemoListing, getDemoPublicProfile } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Listing, PublicProfile } from "@/types/database";

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

  if (!listing) {
    notFound();
  }

  const isOwner = user.id === listing.seller_id;
  const images = listing.images.length > 0 ? listing.images : ["/listing-placeholders/default.svg"];

  const conditionColor: Record<string, string> = {
    New: "text-emerald-700 bg-emerald-50 border-emerald-200",
    "Like New": "text-blue-700 bg-blue-50 border-blue-200",
    Good: "text-amber-700 bg-amber-50 border-amber-200",
    Fair: "text-slate-700 bg-slate-50 border-slate-200"
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/listings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listings
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
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
            <div className="mt-4 grid grid-cols-3 gap-3">
              {images.slice(1).map((url) => (
                <div
                  key={url}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                >
                  <Image src={url} alt={listing.title} fill sizes="33vw" className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Tag className="mr-1 h-3 w-3" />
                  {listing.category}
                </Badge>
                <Badge variant={listing.status === "available" ? "verified" : "warning"}>
                  {listing.status}
                </Badge>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${conditionColor[listing.condition] ?? conditionColor["Fair"]}`}
                >
                  {listing.condition}
                </span>
              </div>
              <CardTitle className="mt-2 text-2xl leading-tight">{listing.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-3xl font-bold text-primary">{formatCurrency(listing.price)}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  Listed {formatDate(listing.created_at)}
                </p>
              </div>

              <p className="whitespace-pre-line leading-7 text-slate-700">{listing.description}</p>

              {listing.status === "sold" ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  This listing has been sold. Check out other listings below.
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                {isOwner ? (
                  <>
                    <Button asChild>
                      <Link href={`/listings/${listing.id}/edit`}>Edit listing</Link>
                    </Button>
                    <form action={deleteListingAction}>
                      <input type="hidden" name="listingId" value={listing.id} />
                      <Button variant="destructive" type="submit">
                        Delete
                      </Button>
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
                      {listing.status === "sold" ? "Listing closed" : "Message seller securely"}
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>

          {seller ? <ProfileSummary profile={seller} /> : null}

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4 text-sm text-amber-900">
              <p className="font-semibold">Safety reminder</p>
              <p className="mt-1">
                Meet in a campus Safe Meeting Zone — Student Union, library lobby, residence hall
                front desk, or Campus Police parking lot.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
