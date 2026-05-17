"use client";

import { useActionState } from "react";
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

export function ListingForm({ listing, action }: ListingFormProps) {
  const [state, formAction] = useActionState(action, {});

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
          <Input id="title" name="title" defaultValue={listing?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="1"
            step="0.01"
            defaultValue={listing ? (listing.price / 100).toFixed(2) : undefined}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" defaultValue={listing?.category} required>
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
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="images">Image URLs</Label>
          <Textarea
            id="images"
            name="images"
            placeholder="Paste up to 6 HTTPS image URLs, separated by commas or new lines."
            defaultValue={listing?.images.join("\n")}
          />
          <p className="text-xs text-slate-500">
            Images are stored as URL references. Use Supabase Storage or trusted HTTPS image URLs.
          </p>
        </div>
      </div>
      <SubmitButton editing={Boolean(listing)} />
    </form>
  );
}
