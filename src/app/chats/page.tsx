import Link from "next/link";
import { MessageSquareLock, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import {
  demoMessages,
  getDemoListingMap,
  getDemoPublicProfileMap,
  getDemoRoomsForUser
} from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ChatRoom, Listing, Message, PublicProfile } from "@/types/database";

type RoomWithMeta = {
  room: ChatRoom;
  listing: Listing | undefined;
  other: PublicProfile | undefined;
  lastMessage: Message | undefined;
};

export default async function ChatsPage() {
  const user = await requireConfirmedUser();
  let rooms: ChatRoom[] = [];
  let listingMap = new Map<string, Listing>();
  let profileMap = new Map<string, PublicProfile>();
  let lastMessages = new Map<string, Message>();

  if (!hasSupabaseEnv()) {
    rooms = getDemoRoomsForUser(user.id);
    listingMap = getDemoListingMap();
    profileMap = getDemoPublicProfileMap();
    rooms.forEach((room) => {
      const msgs = demoMessages.filter((m) => m.chat_room_id === room.id);
      const last = msgs.at(-1);
      if (last) lastMessages.set(room.id, last);
    });
  } else {
    const supabase = await createClient();
    const { data: roomData } = await supabase
      .from("chat_rooms")
      .select("*")
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    rooms = roomData ?? [];

    const listingIds = Array.from(new Set(rooms.map((room) => room.listing_id)));
    const participantIds = Array.from(
      new Set(rooms.flatMap((room) => [room.buyer_id, room.seller_id]))
    );

    const [{ data: listings }, { data: profiles }] = await Promise.all([
      listingIds.length
        ? supabase.from("listings").select("*").in("id", listingIds)
        : Promise.resolve({ data: [] as Listing[] }),
      participantIds.length
        ? supabase.from("public_profiles").select("*").in("id", participantIds)
        : Promise.resolve({ data: [] as PublicProfile[] })
    ]);

    listingMap = new Map((listings ?? []).map((listing) => [listing.id, listing]));
    profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

    if (rooms.length > 0) {
      const { data: msgData } = await supabase
        .from("messages")
        .select("*")
        .in("chat_room_id", rooms.map((r) => r.id))
        .order("created_at", { ascending: false });

      (msgData ?? []).forEach((msg) => {
        if (!lastMessages.has(msg.chat_room_id)) {
          lastMessages.set(msg.chat_room_id, msg);
        }
      });
    }
  }

  const enriched: RoomWithMeta[] = rooms.map((room) => ({
    room,
    listing: listingMap.get(room.listing_id),
    other: profileMap.get(room.buyer_id === user.id ? room.seller_id : room.buyer_id),
    lastMessage: lastMessages.get(room.id)
  }));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Badge variant="verified" className="mb-3">
            <MessageSquareLock className="mr-1 h-3.5 w-3.5" />
            Private marketplace chat
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Messages</h1>
          <p className="mt-2 text-slate-600">
            Negotiate safely with verified buyers and sellers without exposing personal contact info.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/listings">
            <Plus className="mr-2 h-4 w-4" />
            Browse listings
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {enriched.map(({ room, listing, other, lastMessage }) => {
          const isSeller = room.seller_id === user.id;
          const statusSold = listing?.status === "sold";

          return (
            <Link key={room.id} href={`/chats/${room.id}`} className="block">
              <Card className="transition hover:border-primary/30 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base leading-tight">
                      {listing?.title ?? "Marketplace chat"}
                    </CardTitle>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant={statusSold ? "warning" : "secondary"}>
                        {listing?.status ?? "active"}
                      </Badge>
                      {listing ? (
                        <span className="text-xs font-semibold text-primary">
                          {formatCurrency(listing.price)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p className="text-slate-600">
                    {isSeller ? "Buyer" : "Seller"}: {other?.full_name ?? "Verified participant"} ·{" "}
                    {other?.university_name ?? "Verified institution"}
                  </p>
                  {lastMessage ? (
                    <p className="text-xs text-slate-400">
                      {lastMessage.sender_id === user.id ? "You: " : ""}
                      {lastMessage.text.slice(0, 80)}
                      {lastMessage.text.length > 80 ? "…" : ""} ·{" "}
                      {formatDate(lastMessage.created_at)}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">No messages yet — say hello!</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {!rooms.length ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-600">
            <MessageSquareLock className="mx-auto mb-4 h-10 w-10 text-slate-300" />
            <p className="font-semibold">No messages yet</p>
            <p className="mt-1 text-sm">Find a listing you want and click "Message seller" to start a private chat.</p>
            <Button asChild className="mt-4">
              <Link href="/listings">Browse listings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
