import Link from "next/link";
import { MessageSquareLock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Listing, PublicProfile } from "@/types/database";

export default async function ChatsPage() {
  const user = await requireConfirmedUser();
  const supabase = await createClient();
  const { data: rooms } = await supabase
    .from("chat_rooms")
    .select("*")
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const listingIds = Array.from(new Set((rooms ?? []).map((room) => room.listing_id)));
  const participantIds = Array.from(
    new Set((rooms ?? []).flatMap((room) => [room.buyer_id, room.seller_id]))
  );

  const [{ data: listings }, { data: profiles }] = await Promise.all([
    listingIds.length
      ? supabase.from("listings").select("*").in("id", listingIds)
      : Promise.resolve({ data: [] as Listing[] }),
    participantIds.length
      ? supabase.from("public_profiles").select("*").in("id", participantIds)
      : Promise.resolve({ data: [] as PublicProfile[] })
  ]);

  const listingMap = new Map((listings ?? []).map((listing) => [listing.id, listing]));
  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="verified" className="mb-3">
          <MessageSquareLock className="mr-1 h-3.5 w-3.5" />
          Private marketplace chat
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Messages</h1>
        <p className="mt-2 text-slate-600">
          Negotiate safely with verified buyers and sellers without exposing personal contact info.
        </p>
      </div>

      <div className="space-y-4">
        {(rooms ?? []).map((room) => {
          const listing = listingMap.get(room.listing_id);
          const otherId = room.buyer_id === user.id ? room.seller_id : room.buyer_id;
          const other = profileMap.get(otherId);

          return (
            <Link key={room.id} href={`/chats/${room.id}`} className="block">
              <Card className="transition hover:border-primary/30 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex flex-col justify-between gap-2 text-lg sm:flex-row">
                    <span>{listing?.title ?? "Marketplace chat"}</span>
                    <Badge variant={listing?.status === "sold" ? "warning" : "secondary"}>
                      {listing?.status ?? "active"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  With {other?.full_name ?? "Verified participant"} ·{" "}
                  {other?.university_name ?? "Verified institution"}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {!rooms?.length ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-600">
            No secure chats yet. Start from a listing to contact a seller.
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
