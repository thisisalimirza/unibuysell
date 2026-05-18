import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Star } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import type { Listing, PublicProfile } from "@/types/database";

type ListingCardProps = {
  listing: Listing;
  seller?: PublicProfile | null;
};

const statusStyles: Record<string, string> = {
  available: "bg-emerald-500 text-white",
  pending: "bg-amber-500 text-white",
  sold: "bg-slate-400 text-white"
};

export function ListingCard({ listing, seller }: ListingCardProps) {
  const image = listing.images[0] ?? "/listing-placeholders/default.svg";
  const isSold = listing.status === "sold";

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.05] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${isSold ? "opacity-70" : ""}`}>
        {/* Image */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          <Image
            src={image}
            alt={listing.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {/* Price chip */}
          <div className="absolute bottom-3 left-3">
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-sm font-bold text-violet-700 shadow-sm backdrop-blur-sm">
              {formatCurrency(listing.price)}
            </span>
          </div>
          {/* Status chip */}
          {listing.status !== "available" ? (
            <div className="absolute right-3 top-3">
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${statusStyles[listing.status] ?? statusStyles.sold}`}>
                {listing.status}
              </span>
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="line-clamp-2 font-semibold text-slate-900 leading-snug group-hover:text-violet-700 transition-colors">
            {listing.title}
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wide">
            {listing.category} · {listing.condition}
          </p>

          {seller ? (
            <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="h-3 w-3" />
                {seller.university_name}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold">
                <Star className="h-3 w-3 fill-current" />
                {seller.rating.toFixed(1)}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
