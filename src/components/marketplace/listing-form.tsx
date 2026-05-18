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
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : editing ? "Update listing" : "Create listing"}
    </Button>
  );
}

function ImagePreview({ urls }: { urls: string[] }) {
  if (!urls.length) return null;

  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {urls.map((url) => (
        <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
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
        const p = new URL(u);
        return p.protocol === "https:";
      } catch {
        return false;
      }
    })
    .slice(0, 6);
}

export function ListingForm({ listing, action }: ListingFormProps) {
  const [state, formAction] = useActionState(action, {});
  const [imageText, setImageText] = useState(listing?.images.join("\n") ?? "");
  const previews = parseUrls(imageText);

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={listing?.title}
            placeholder="e.g. Netter's Atlas of Human Anatomy, 8th Edition"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" defaultValue={listing?.category} required>
            <option value="" disabled>
              Select category
            </option>
            {listingCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select id="condition" name="condition" defaultValue={listing?.condition} required>
            <option value="" disabled>
              Select condition
            </option>
            {listingConditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </Select>
        </div>

        {listing ? (
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={listing.status} required>
              {listingStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
        ) : null}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={listing?.description}
            placeholder="Describe the item's condition, included accessories, pickup logistics, etc."
            className="min-h-[120px]"
            required
          />
          <p className="text-xs text-slate-500">
            Minimum 20 characters. Include details that help buyers transact safely.
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="images">Image URLs</Label>
          <Textarea
            id="images"
            name="images"
            value={imageText}
            onChange={(e) => setImageText(e.target.value)}
            placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
            className="min-h-[80px] font-mono text-xs"
          />
          <p className="text-xs text-slate-500">
            Paste up to 6 public HTTPS image URLs, one per line or comma-separated. Use Imgur, Google Drive (public), or Supabase Storage.
          </p>
          <ImagePreview urls={previews} />
        </div>
      </div>

      <SubmitButton editing={Boolean(listing)} />
    </form>
  );
}
