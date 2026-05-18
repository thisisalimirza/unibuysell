"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { MarketplaceActionState } from "@/app/listings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { listingCategories, listingConditions, listingStatuses } from "@/lib/marketplace";
import type { Listing } from "@/types/database";

type ListingFormProps = {
  listing?: Listing;
  action: (prevState: MarketplaceActionState, formData: FormData) => Promise<MarketplaceActionState>;
};

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? "Posting…" : editing ? "Save changes" : "Post listing"}
    </Button>
  );
}

function ImagePreview({ urls }: { urls: string[] }) {
  if (!urls.length) return null;
  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {urls.map((url) => (
        <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-black/[0.05]">
          <Image src={url} alt="preview" fill sizes="33vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

function parseUrls(raw: string) {
  return raw
    .split(/\r?\n|,/)
    .map((u) => u.trim())
    .filter(Boolean)
    .filter((u) => {
      try {
        return new URL(u).protocol === "https:";
      } catch {
        return false;
      }
    })
    .slice(0, 6);
}

const descriptionPlaceholders: Record<string, string> = {
  Textbooks:
    "E.g. \"Bought for Biochem 201, used it maybe 5 times. No highlighting except chapter 3. Online access code is unused. Will meet at the library.\"",
  "Medical Gear":
    "E.g. \"Littmann Classic III, navy. Used for MS1-2. Sanitized and in great shape. My name is engraved on the bell — just letting you know. Pickup near the sim center.\"",
  Electronics:
    "E.g. \"2022 iPad Air, 64GB, WiFi only. Battery health 91%. Comes with Apple Pencil Gen 2 and a folio case. Screen protector is cracked but screen itself is perfect.\"",
  Subleases:
    "E.g. \"Private furnished room in 2BR apartment, 10-min walk to the hospital. Available June 1 – July 31 (my away rotation in Seattle). Utilities included. Looking for another student.\""
};

export function ListingForm({ listing, action }: ListingFormProps) {
  const [state, formAction] = useActionState(action, {});
  const [imageText, setImageText] = useState(listing?.images.join("\n") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(listing?.category ?? "");
  const previews = parseUrls(imageText);

  const placeholder = selectedCategory
    ? descriptionPlaceholders[selectedCategory]
    : "Give people enough detail to say yes — condition, what's included, pickup details, why you're selling.";

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="title">What are you selling?</Label>
          <Input
            id="title"
            name="title"
            defaultValue={listing?.title}
            placeholder={`Be specific — "Netter's Atlas 8th Ed" beats "anatomy book"`}
            required
          />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <Label htmlFor="price">Asking price (USD)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="1"
            step="0.01"
            placeholder="0.00"
            defaultValue={listing ? (listing.price / 100).toFixed(2) : undefined}
            required
          />
          <p className="text-xs text-slate-400">
            Tip: check what it sells for used on Amazon. Price it 20–30% below that and it'll go fast.
          </p>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="" disabled>Pick one…</option>
            {listingCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        {/* Condition */}
        <div className="space-y-1.5">
          <Label htmlFor="condition">Condition</Label>
          <Select id="condition" name="condition" defaultValue={listing?.condition} required>
            <option value="" disabled>How's it holding up?</option>
            {listingConditions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        {/* Status (edit only) */}
        {listing ? (
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={listing.status} required>
              {listingStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
        ) : null}

        {/* Description */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="description">Tell them about it</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={listing?.description}
            placeholder={placeholder}
            className="min-h-[140px]"
            required
          />
          <p className="text-xs text-slate-400">
            Be honest about condition. Mention what's included. Say where you can meet.
            Listings with good descriptions sell faster.
          </p>
        </div>

        {/* Images */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="images">Photos (optional but highly recommended)</Label>
          <Textarea
            id="images"
            name="images"
            value={imageText}
            onChange={(e) => setImageText(e.target.value)}
            placeholder={"Paste image URLs, one per line:\nhttps://i.imgur.com/yourphoto.jpg\nhttps://i.imgur.com/anotherphoto.jpg"}
            className="min-h-[80px] font-mono text-xs"
          />
          <p className="text-xs text-slate-400">
            Upload photos to Imgur (free, no account needed) and paste the links here.
            Up to 6 photos. HTTPS only.
          </p>
          <ImagePreview urls={previews} />
        </div>
      </div>

      <SubmitButton editing={Boolean(listing)} />
    </form>
  );
}
