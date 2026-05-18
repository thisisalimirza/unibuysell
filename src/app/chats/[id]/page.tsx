import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { completeSaleAction } from "@/app/chats/actions";
import { ChatRoom } from "@/components/marketplace/chat-room";
import { ProfileSummary } from "@/components/marketplace/profile-summary";
import { ReviewForm } from "@/components/marketplace/review-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import {
  demoMessages,
  demoReviews,
  demoTransactions,
  getDemoChatRoom,
  getDemoListing,
  getDemoPublicProfile
} from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import type {
  ChatRoom as ChatRoomRecord,
  Listing,
  Message,
  PublicProfile,
  Transaction
} from "@/types/database";

export default async function ChatPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireConfirmedUser();
  const { id } = await params;
  const demoMode = !hasSupabaseEnv();
  let room: ChatRoomRecord | null = null;
  let listing: Listing | null = null;
  let messages: Message[] = [];
  let otherProfile: PublicProfile | null = null;
  let transaction: Transaction | null = null;
  let existingReview: { id: string } | null = null;

  if (demoMode) {
    room = getDemoChatRoom(id);
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("chat_rooms").select("*").eq("id", id).single();
    room = data;
  }

  if (!room) notFound();
  if (room.buyer_id !== user.id && room.seller_id !== user.id) redirect("/chats");

  const otherId = room.buyer_id === user.id ? room.seller_id : room.buyer_id;
  const isSeller = room.seller_id === user.id;

  if (demoMode) {
    listing = getDemoListing(room.listing_id);
    messages = demoMessages.filter((m) => m.chat_room_id === room.id);
    otherProfile = getDemoPublicProfile(otherId);
    transaction = demoTransactions.find((t) => t.chat_room_id === room.id) ?? null;
    existingReview =
      transaction &&
      demoReviews.some(
        (r) => r.transaction_id === transaction?.id && r.reviewer_id === user.id
      )
        ? { id: "demo-existing-review" }
        : null;
  } else {
    const supabase = await createClient();
    const [
      { data: listingData },
      { data: messageData },
      { data: profiles },
      { data: transactionData }
    ] = await Promise.all([
      supabase.from("listings").select("*").eq("id", room.listing_id).single(),
      supabase
        .from("messages")
        .select("*")
        .eq("chat_room_id", room.id)
        .order("created_at", { ascending: true }),
      supabase.from("public_profiles").select("*").in("id", [room.buyer_id, room.seller_id]),
      supabase.from("transactions").select("*").eq("chat_room_id", room.id).maybeSingle()
    ]);

    listing = listingData;
    messages = messageData ?? [];
    otherProfile = profiles?.find((p) => p.id === otherId) ?? null;
    transaction = transactionData;

    const { data: reviewData } = transaction
      ? await supabase
          .from("reviews")
          .select("id")
          .eq("transaction_id", transaction.id)
          .eq("reviewer_id", user.id)
          .maybeSingle()
      : { data: null };
    existingReview = reviewData;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
        <Link href="/chats">
          <ArrowLeft className="h-4 w-4" />
          All messages
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Chat */}
        <section>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {listing?.title ?? "Secure chat"}
              </h1>
              {listing ? (
                <p className="mt-0.5 text-sm text-slate-500">
                  <span className="font-semibold text-violet-700">{formatCurrency(listing.price)}</span>
                  {" · "}{listing.category} · {listing.condition}
                </p>
              ) : null}
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={listing ? `/listings/${listing.id}` : "/listings"}>
                View listing
              </Link>
            </Button>
          </div>

          <ChatRoom
            roomId={room.id}
            currentUserId={user.id}
            initialMessages={messages}
            demoMode={demoMode}
          />
        </section>

        {/* Sidebar */}
        <aside className="space-y-4">
          {otherProfile ? <ProfileSummary profile={otherProfile} /> : null}

          {/* Transaction */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>How&apos;s it going?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant={transaction ? "verified" : "secondary"}>
                {transaction ? (
                  <><CheckCircle2 className="mr-1 h-3 w-3" />Done — nice one!</>
                ) : (
                  "Still chatting"
                )}
              </Badge>

              {isSeller && !transaction ? (
                <form action={completeSaleAction}>
                  <input type="hidden" name="chatRoomId" value={room.id} />
                  <Button type="submit" className="w-full" size="sm">
                    Sold it to this person ✓
                  </Button>
                </form>
              ) : null}

              {transaction && !existingReview && otherProfile ? (
                <div className="border-t border-slate-100 pt-4">
                  <p className="mb-3 text-sm font-semibold text-slate-800">
                    How was {otherProfile.full_name.split(" ")[0]} to deal with?
                  </p>
                  <ReviewForm
                    transactionId={transaction.id}
                    revieweeId={otherProfile.id}
                    revieweeName={otherProfile.full_name}
                  />
                </div>
              ) : null}

              {transaction && existingReview ? (
                <p className="flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Review left — thanks for keeping it real
                </p>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
