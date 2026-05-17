import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { completeSaleAction } from "@/app/chats/actions";
import { ChatRoom } from "@/components/marketplace/chat-room";
import { ProfileSummary } from "@/components/marketplace/profile-summary";
import { ReviewForm } from "@/components/marketplace/review-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function ChatPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireConfirmedUser();
  const { id } = await params;
  const supabase = await createClient();

  const { data: room } = await supabase.from("chat_rooms").select("*").eq("id", id).single();

  if (!room) {
    notFound();
  }

  if (room.buyer_id !== user.id && room.seller_id !== user.id) {
    redirect("/chats");
  }

  const [{ data: listing }, { data: messages }, { data: profiles }, { data: transaction }] =
    await Promise.all([
      supabase.from("listings").select("*").eq("id", room.listing_id).single(),
      supabase
        .from("messages")
        .select("*")
        .eq("chat_room_id", room.id)
        .order("created_at", { ascending: true }),
      supabase.from("public_profiles").select("*").in("id", [room.buyer_id, room.seller_id]),
      supabase.from("transactions").select("*").eq("chat_room_id", room.id).maybeSingle()
    ]);

  const otherId = room.buyer_id === user.id ? room.seller_id : room.buyer_id;
  const otherProfile = profiles?.find((profile) => profile.id === otherId);
  const isSeller = room.seller_id === user.id;
  const { data: existingReview } = transaction
    ? await supabase
        .from("reviews")
        .select("id")
        .eq("transaction_id", transaction.id)
        .eq("reviewer_id", user.id)
        .maybeSingle()
    : { data: null };

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <section>
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">{listing?.title ?? "Secure chat"}</h1>
            {listing ? (
              <p className="mt-1 text-sm text-slate-500">
                {formatCurrency(listing.price)} · {listing.category} · {listing.condition}
              </p>
            ) : null}
          </div>
          <Button asChild variant="outline">
            <Link href={listing ? `/listings/${listing.id}` : "/listings"}>View listing</Link>
          </Button>
        </div>
        <ChatRoom roomId={room.id} currentUserId={user.id} initialMessages={messages ?? []} />
      </section>

      <aside className="space-y-5">
        {otherProfile ? <ProfileSummary profile={otherProfile} /> : null}
        <Card>
          <CardHeader>
            <CardTitle>Transaction status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge variant={transaction ? "verified" : "secondary"}>
              {transaction ? "Completed sale" : "Negotiating"}
            </Badge>
            {isSeller && !transaction ? (
              <form action={completeSaleAction}>
                <input type="hidden" name="chatRoomId" value={room.id} />
                <Button type="submit" className="w-full">
                  Mark sold to this buyer
                </Button>
              </form>
            ) : null}
            {transaction && otherProfile && !existingReview ? (
              <ReviewForm
                transactionId={transaction.id}
                revieweeId={otherProfile.id}
                revieweeName={otherProfile.full_name}
              />
            ) : null}
            {transaction && existingReview ? (
              <p className="text-sm text-slate-600">You already reviewed this transaction.</p>
            ) : null}
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
