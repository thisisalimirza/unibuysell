"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireConfirmedUser } from "@/lib/auth";
import { dollarsToCents, listingSchema, parseImageUrls } from "@/lib/marketplace";
import { createClient } from "@/lib/supabase/server";

export type MarketplaceActionState = {
  error?: string;
};

export async function createListingAction(
  _prevState: MarketplaceActionState,
  formData: FormData
): Promise<MarketplaceActionState> {
  const user = await requireConfirmedUser();
  const parsed = listingSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your listing details." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .insert({
      seller_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      price: dollarsToCents(parsed.data.price),
      category: parsed.data.category,
      condition: parsed.data.condition,
      images: parseImageUrls(parsed.data.images),
      status: "available"
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/listings");
  revalidatePath("/dashboard");
  redirect(`/listings/${data.id}`);
}

export async function updateListingAction(
  listingId: string,
  _prevState: MarketplaceActionState,
  formData: FormData
): Promise<MarketplaceActionState> {
  await requireConfirmedUser();
  const parsed = listingSchema
    .extend({
      status: z.enum(["available", "pending", "sold"])
    })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your listing details." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      price: dollarsToCents(parsed.data.price),
      category: parsed.data.category,
      condition: parsed.data.condition,
      images: parseImageUrls(parsed.data.images),
      status: parsed.data.status,
      updated_at: new Date().toISOString()
    })
    .eq("id", listingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/listings");
  revalidatePath(`/listings/${listingId}`);
  redirect(`/listings/${listingId}`);
}

export async function deleteListingAction(formData: FormData) {
  await requireConfirmedUser();
  const listingId = String(formData.get("listingId") ?? "");

  if (!listingId) {
    redirect("/listings");
  }

  const supabase = await createClient();
  await supabase.from("listings").delete().eq("id", listingId);
  revalidatePath("/listings");
  revalidatePath("/dashboard");
  redirect("/listings");
}

export async function createChatRoomAction(formData: FormData) {
  const user = await requireConfirmedUser();
  const listingId = String(formData.get("listingId") ?? "");
  const supabase = await createClient();

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("id, seller_id, status")
    .eq("id", listingId)
    .single();

  if (listingError || !listing || listing.seller_id === user.id || listing.status === "sold") {
    redirect(`/listings/${listingId}`);
  }

  const { data: existing } = await supabase
    .from("chat_rooms")
    .select("id")
    .eq("listing_id", listing.id)
    .eq("buyer_id", user.id)
    .eq("seller_id", listing.seller_id)
    .maybeSingle();

  if (existing) {
    redirect(`/chats/${existing.id}`);
  }

  const { data: room, error } = await supabase
    .from("chat_rooms")
    .insert({
      buyer_id: user.id,
      seller_id: listing.seller_id,
      listing_id: listing.id
    })
    .select("id")
    .single();

  if (error || !room) {
    redirect(`/listings/${listingId}`);
  }

  redirect(`/chats/${room.id}`);
}
