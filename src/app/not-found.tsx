import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
          <SearchX className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Hmm, nothing here</h1>
        <p className="mt-3 max-w-sm text-slate-500">
          This listing is either gone or never existed. It happens — things sell fast around here.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/listings">
              <ArrowLeft className="h-4 w-4" />
              Browse listings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
