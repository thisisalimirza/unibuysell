import { createListingAction } from "@/app/listings/actions";
import { ListingForm } from "@/components/marketplace/listing-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireConfirmedUser } from "@/lib/auth";

export default async function NewListingPage() {
  await requireConfirmedUser();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>List your thing — takes about 2 minutes</CardTitle>
        </CardHeader>
        <CardContent>
          <ListingForm action={createListingAction} />
        </CardContent>
      </Card>
    </main>
  );
}
