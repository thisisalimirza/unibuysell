"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50">
          <AlertTriangle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Something went wrong</h1>
        <p className="mt-3 max-w-sm text-slate-500">{error.message}</p>
        <div className="mt-8">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </main>
  );
}
