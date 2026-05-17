"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireConfirmedUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type ReviewActionState = {
  error?: string;
  success?: string;
};

const reviewSchema = z.object({
  transactionId: z.string().uuid(),
  revieweeId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(8, "Add a short review.").max(500)
});

export async function completeSaleAction(formData: FormData) {
  const user = await requireConfirmedUser();
  const chatRoomId = String(formData.get("chatRoomId") ?? "");

  if (!hasSupabaseEnv()) {
    redirect(`/chats/${chatRoomId}`);
  }

  const supabase = await createClient();

  const { data: room } = await supabase
    .from("chat_rooms")
    .select("*")
    .eq("id", chatRoomId)
    .eq("seller_id", user.id)
    .single();

  if (!room) {
    redirect("/chats");
  }

  await supabase
    .from("transactions")
    .insert({
      listing_id: room.listing_id,
      chat_room_id: room.id,
      buyer_id: room.buyer_id,
      seller_id: room.seller_id
    })
    .select("id")
    .maybeSingle();

  await supabase
    .from("listings")
    .update({ status: "sold", updated_at: new Date().toISOString() })
    .eq("id", room.listing_id)
    .eq("seller_id", user.id);

  revalidatePath(`/chats/${room.id}`);
  revalidatePath(`/listings/${room.listing_id}`);
}

export async function createReviewAction(
  _prevState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const user = await requireConfirmedUser();
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your review." };
  }

  if (!hasSupabaseEnv()) {
    return { success: "Demo review submitted. Connect Supabase to persist real reviews." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert({
    transaction_id: parsed.data.transactionId,
    reviewer_id: user.id,
    reviewee_id: parsed.data.revieweeId,
    rating: parsed.data.rating,
    comment: parsed.data.comment
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/chats");
  revalidatePath(`/profile/${parsed.data.revieweeId}`);
  return { success: "Review submitted. Thanks for keeping the marketplace trustworthy." };
}
