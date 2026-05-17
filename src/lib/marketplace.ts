import { z } from "zod";

import type { ListingCategory, ListingCondition, ListingStatus } from "@/types/database";

export const listingCategories: ListingCategory[] = [
  "Textbooks",
  "Medical Gear",
  "Electronics",
  "Subleases"
];

export const listingConditions: ListingCondition[] = ["New", "Like New", "Good", "Fair"];
export const listingStatuses: ListingStatus[] = ["available", "pending", "sold"];

export const listingSchema = z.object({
  title: z.string().min(4, "Use a clear title.").max(120),
  description: z.string().min(20, "Add enough detail for a safe transaction.").max(2000),
  price: z.coerce.number().min(1, "Price must be at least $1.").max(100000),
  category: z.enum(["Textbooks", "Medical Gear", "Electronics", "Subleases"]),
  condition: z.enum(["New", "Like New", "Good", "Fair"]),
  images: z.string().optional(),
  status: z.enum(["available", "pending", "sold"]).optional()
});

export function parseImageUrls(raw?: string | null) {
  if (!raw) {
    return [];
  }

  return raw
    .split(/\r?\n|,/)
    .map((url) => url.trim())
    .filter(Boolean)
    .filter((url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "https:";
      } catch {
        return false;
      }
    })
    .slice(0, 6);
}

export function dollarsToCents(amount: number) {
  return Math.round(amount * 100);
}
