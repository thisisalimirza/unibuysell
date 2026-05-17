import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Listing, PublicProfile } from "@/types/database";

type ListingCardProps = {
  listing: Listing;
  seller?: PublicProfile | null;
};

export function ListingCard({ listing, seller }: ListingCardProps) {
  const image = listing.images[0] ?? "/listing-placeholders/default.svg";

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] bg-slate-100">
          <Image
            src={image}
            alt={listing.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition group-hover:scale-105"
          />
          <Badge className="absolute left-3 top-3 capitalize" variant="secondary">
            {listing.status}
          </Badge>
        </div>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-2 font-semibold text-slate-950">{listing.title}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {listing.category} · {listing.condition}
              </p>
            </div>
            <p className="font-bold text-primary">{formatCurrency(listing.price)}</p>
          </div>
          {seller ? (
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {seller.university_name}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {seller.rating.toFixed(1)} ({seller.review_count})
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
