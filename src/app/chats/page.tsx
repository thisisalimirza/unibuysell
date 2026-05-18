import Link from "next/link";
import { MessageSquare, Plus, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

    const listingIds = Array.from(new Set(rooms.map((r) => r.listing_id)));
    const participantIds = Array.from(
      new Set(rooms.flatMap((r) => [r.buyer_id, r.seller_id]))
    );

    const [{ data: listings }, { data: profiles }] = await Promise.all([
      listingIds.length
        ? supabase.from("listings").select("*").in("id", listingIds)
        : Promise.resolve({ data: [] as Listing[] }),
      participantIds.length
        ? supabase.from("public_profiles").select("*").in("id", participantIds)
        : Promise.resolve({ data: [] as PublicProfile[] })
    ]);

    listingMap = new Map((listings ?? []).map((l) => [l.id, l]));
    profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

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

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Your chats</h1>
          <p className="mt-1.5 text-slate-500">
            {rooms.length > 0
              ? `${rooms.length} conversation${rooms.length !== 1 ? "s" : ""} going`
              : "All private. Your email is never shared with anyone."}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/listings">
            <Plus className="h-4 w-4" />
            Find listing
          </Link>
        </Button>
      </div>

      {/* Rooms list */}
      {rooms.length > 0 ? (
        <div className="space-y-3">
          {rooms.map((room) => {
            const listing = listingMap.get(room.listing_id);
            const otherId = room.buyer_id === user.id ? room.seller_id : room.buyer_id;
            const other = profileMap.get(otherId);
            const lastMsg = lastMessages.get(room.id);
            const isSold = listing?.status === "sold";

            return (
              <Link key={room.id} href={`/chats/${room.id}`} className="group block">
                <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.05] transition-all hover:shadow-md hover:-translate-y-0.5">
                  {/* Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
                    {other?.full_name?.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() ?? "?"}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
                        {listing?.title ?? "Marketplace chat"}
                      </p>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <Badge variant={isSold ? "warning" : "secondary"} className="capitalize">
                          {listing?.status ?? "active"}
                        </Badge>
                        {listing ? (
                          <span className="text-xs font-bold text-violet-600">
                            {formatCurrency(listing.price)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {room.seller_id === user.id ? "Buyer" : "Seller"}: {other?.full_name ?? "Verified student"} · {other?.university_name ?? "Verified institution"}
                    </p>
                    {lastMsg ? (
                      <p className="mt-1 truncate text-xs text-slate-400">
                        {lastMsg.sender_id === user.id ? "You: " : ""}
                        {lastMsg.text.slice(0, 70)}{lastMsg.text.length > 70 ? "…" : ""}
                        {" · "}{formatDate(lastMsg.created_at)}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs italic text-slate-400">Say hi first 👋</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
            <MessageSquare className="h-8 w-8 text-violet-400" />
          </div>
          <div>
            <p className="font-bold text-slate-800">No chats yet</p>
            <p className="mt-1.5 text-sm text-slate-500">
              See something you want? Hit "Message them" on the listing and you&apos;re in.
            </p>
          </div>
          <Button asChild>
            <Link href="/listings">
              <ShoppingBag className="h-4 w-4" />
              Browse listings
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
}
