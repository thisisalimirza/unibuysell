import Link from "next/link";
import { ShieldCheck, GraduationCap, MessageSquareLock, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const trustCards = [
  {
    icon: GraduationCap,
    title: "Institution-only access",
    body: "Registration accepts university and medical-school domains only, then requires email confirmation before marketplace access."
  },
  {
    icon: ShieldCheck,
    title: "RLS-protected marketplace",
    body: "Supabase policies keep listing edits, chat rooms, messages, and reviews scoped to verified participants."
  },
  {
    icon: MessageSquareLock,
    title: "Private negotiation",
    body: "Realtime chat lets buyers and sellers coordinate safely without sharing phone numbers or social handles."
  },
  {
    icon: Star,
    title: "Transaction-tied reviews",
    body: "Ratings can only be left by participants after a listing is marked sold through a completed marketplace chat."
  }
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <div className="flex flex-col justify-center">
          <p className="mb-4 inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            Verified students only
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            A safer campus marketplace for books, gear, electronics, and subleases.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            UniBuySell is a closed peer-to-peer marketplace where every account is tied to a
            confirmed institutional email, every profile displays verified school context, and
            every transaction can build trust through reviews.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Create verified account</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
        <Card className="overflow-hidden border-primary/10">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl">Marketplace guardrails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            {[
              "Rejects Gmail, Yahoo, Outlook, Hotmail, and other public providers.",
              "Blocks dashboard, listing, profile, and chat routes until email confirmation.",
              "Hides personal email addresses from marketplace profile views.",
              "Keeps negotiations inside Supabase Realtime chat with Safe Meeting Zone prompts."
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="trust" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {trustCards.map((card) => (
            <Card key={card.title}>
              <CardHeader>
                <card.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600">{card.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="safety" className="border-y border-slate-200 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Safety is built in.</h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            Chat surfaces persistent reminders to meet in on-campus Safe Meeting Zones like the
            Student Union, library lobby, residence hall front desk, or campus police parking lot.
          </p>
        </div>
      </section>
    </main>
  );
}
