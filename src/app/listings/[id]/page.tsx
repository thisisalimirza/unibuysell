import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createChatRoomAction, deleteListingAction } from "@/app/listings/actions";
import { ProfileSummary } from "@/components/marketplace/profile-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function ListingDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireConfirmedUser();
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase.from("listings").select("*").eq("id", id).single();

  if (!listing) {
    notFound();
  }

  const { data: seller } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("id", listing.seller_id)
    .single();
  const isOwner = user.id === listing.seller_id;
  const image = listing.images[0] ?? "/listing-placeholders/default.svg";

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
            <Image
              src={image}
              alt={listing.title}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          {listing.images.length > 1 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {listing.images.slice(1).map((url) => (
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
                <Badge variant="secondary">{listing.category}</Badge>
                <Badge variant={listing.status === "available" ? "verified" : "warning"}>
                  {listing.status}
                </Badge>
              </div>
              <CardTitle className="text-3xl leading-tight">{listing.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-3xl font-bold text-primary">{formatCurrency(listing.price)}</p>
              <p className="text-sm font-medium text-slate-500">Condition: {listing.condition}</p>
              <p className="whitespace-pre-line leading-7 text-slate-700">{listing.description}</p>
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
                  <form action={createChatRoomAction}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <Button type="submit" disabled={listing.status === "sold"}>
                      Message seller securely
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>

          {seller ? <ProfileSummary profile={seller} /> : null}
        </div>
      </div>
    </main>
  );
}
