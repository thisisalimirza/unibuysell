import { notFound, redirect } from "next/navigation";

import { updateListingAction } from "@/app/listings/actions";
import { ListingForm } from "@/components/marketplace/listing-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function EditListingPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireConfirmedUser();
  const { id } = await params;
  const supabase = await createClient();
  const { data: listing } = await supabase.from("listings").select("*").eq("id", id).single();

  if (!listing) {
    notFound();
  }

  if (listing.seller_id !== user.id) {
    redirect(`/listings/${listing.id}`);
  }

  const action = updateListingAction.bind(null, listing.id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit listing</CardTitle>
        </CardHeader>
        <CardContent>
          <ListingForm listing={listing} action={action} />
        </CardContent>
      </Card>
    </main>
  );
}
