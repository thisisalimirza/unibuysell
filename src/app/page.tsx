import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Stethoscope,
  Laptop,
  Building2,
  CheckCircle2,
  Star,
  MessageSquare
} from "lucide-react";

import { Button } from "@/components/ui/button";

const categories = [
  {
    icon: BookOpen,
    label: "Textbooks",
    tagline: "The $200 book you used twice.",
    desc: "Ship it to a student across the country who actually needs it right now.",
    color: "bg-blue-50 text-blue-600",
    ring: "hover:ring-blue-200"
  },
  {
    icon: Stethoscope,
    label: "Medical Gear",
    tagline: "That Littmann you upgraded from?",
    desc: "An MS1 somewhere wants it. Meet on campus or just ship it.",
    color: "bg-rose-50 text-rose-600",
    ring: "hover:ring-rose-200"
  },
  {
    icon: Laptop,
    label: "Electronics",
    tagline: "Your old iPad is someone's new study tool.",
    desc: "Calculators, laptops, tablets — sell it here.",
    color: "bg-violet-50 text-violet-600",
    ring: "hover:ring-violet-200"
  },
  {
    icon: Building2,
    label: "Subleases",
    tagline: "Away rotation for 6 weeks?",
    desc: "List your room. Another student needs it.",
    color: "bg-emerald-50 text-emerald-600",
    ring: "hover:ring-emerald-200"
  }
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              University email required · No strangers
            </span>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Sell your stuff to students
              <span className="block text-yellow-300"> you can actually trust.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              No Facebook Marketplace randos. No eBay fees. No sketchy meetups with strangers.
              Just your fellow students — every single one verified by their university email.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white text-violet-700 shadow-xl hover:bg-slate-50 hover:text-violet-800"
              >
                <Link href="/auth/sign-up">
                  Get your free spot
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50"
              >
                <Link href="/auth/sign-in">Already have an account</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              {[
                "Free to join",
                "No listing fees",
                "Ship it or meet locally",
                "Real-time private chat"
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The honest pitch */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              Why we built this
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              Selling on Facebook Marketplace sucks.
              <span className="text-violet-600"> We fixed it.</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              You've got a $180 anatomy atlas taking up shelf space. You want to sell it. But
              Facebook Marketplace means meeting a stranger in a parking lot who might ghost you.
              eBay means fees, shipping, and 47 steps to list a textbook.
            </p>
            <p className="mt-4 text-lg text-slate-600">
              We wanted a place where you could just{" "}
              <strong className="text-slate-800">list your thing, trust the buyer, and get it done</strong>.
              So we built it — and made sure every person on the platform has a verified
              university email before they can do anything.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {[
                "Every buyer and seller has a confirmed .edu (or equivalent) email",
                "Your personal email and phone number are never shared",
                "All negotiation happens in private in-app chat",
                "Reviews are only unlocked after a completed sale"
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-500" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats / social proof panel */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: ShieldCheck,
                color: "bg-violet-100 text-violet-600",
                title: "Only .edu accounts",
                desc: "Every single person on here is a verified student. Not a maybe, not a probably — verified."
              },
              {
                icon: MessageSquare,
                color: "bg-blue-100 text-blue-600",
                title: "Private chat, always",
                desc: "You never have to share your number. Negotiate, agree, and coordinate all in-app."
              },
              {
                icon: Star,
                color: "bg-amber-100 text-amber-600",
                title: "Real reviews only",
                desc: "You can only leave a review after a real completed sale. No fake ratings."
              },
              {
                icon: CheckCircle2,
                color: "bg-emerald-100 text-emerald-600",
                title: "Meet up or ship — your call",
                desc: "Local? Meet on campus. Across the country? Just ship it. Both work great."
              }
            ].map((card) => (
              <div key={card.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.05]">
                <div className={`mb-3 inline-flex rounded-xl p-2.5 ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <p className="font-bold text-slate-900">{card.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulletin board / nationwide section */}
      <section className="border-t border-slate-100 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">Seriously though</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              Why did this not exist until now?
            </h2>
          </div>
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Bulletin board */}
            <div className="rounded-3xl bg-slate-50 p-8 ring-1 ring-slate-100">
              <div className="mb-4 text-4xl">📌</div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Remember that random bulletin board in the hallway?
              </h3>
              <p className="mt-4 text-slate-600 leading-7">
                That corkboard covered in five-year-old listings, still advertising a 2018 Toyota
                and a Nintendo DS with a phone number that&apos;s probably disconnected. The one you
                only remember exists when you&apos;re sitting at home, 30 minutes from campus.
              </p>
              <p className="mt-4 text-slate-600 leading-7">
                <strong className="text-slate-800">This is that bulletin board.</strong> Except it&apos;s
                on your phone, nothing is expired, and you can actually sell things on it. Browse
                from your couch at midnight, list in two minutes, done.
              </p>
            </div>

            {/* Ship it / nationwide */}
            <div className="rounded-3xl bg-slate-50 p-8 ring-1 ring-slate-100">
              <div className="mb-4 text-4xl">📦</div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Nobody at your school needs it? Someone in Ohio does.
              </h3>
              <p className="mt-4 text-slate-600 leading-7">
                You don&apos;t have to meet in person. Just ship it. Your Netter&apos;s Atlas that&apos;s
                been collecting dust since last spring can go to a student in Ohio who&apos;s
                freaking out about their anatomy practical in two weeks — even though your school
                finished that module months ago.
              </p>
              <p className="mt-4 text-slate-600 leading-7">
                Sell nationwide. Buy nationwide. Every person on the other end has a verified
                university email. <strong className="text-slate-800">It&apos;s just students, all the way down.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              What can you list?
            </h2>
            <p className="mt-1 text-slate-500">
              Pretty much anything a student buys, uses, and eventually needs to get rid of.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`/listings?category=${encodeURIComponent(cat.label)}`}
                className={`group block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.05] transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-2 ${cat.ring}`}
              >
                <div className={`mb-3 inline-flex rounded-xl p-3 ${cat.color}`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <p className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                  {cat.label}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600">{cat.tagline}</p>
                <p className="mt-0.5 text-xs text-slate-400">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Med student callout */}
      <section id="med-students" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-4 py-1.5 text-sm font-semibold text-rose-300 ring-1 ring-rose-500/30">
                <Stethoscope className="h-4 w-4" />
                Hey, med students — this one's for you
              </span>
              <h2 className="mt-5 text-3xl font-extrabold text-white">
                Away rotations are chaotic enough. Your housing situation shouldn't be.
              </h2>
              <p className="mt-4 text-slate-400">
                Right now, medical students sublease apartments and rooms through random
                GroupMes, Facebook groups, and word-of-mouth — which means dealing with
                people you don't really know, awkward negotiations over text, and zero
                accountability if something goes wrong.
              </p>
              <p className="mt-3 text-slate-400">
                Post your place here. Another verified medical student doing their rotation
                in your city finds it. You both have real profiles, real reviews, and
                real school emails. Done.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                {[
                  "List your room for the exact dates of your rotation",
                  "Incoming students search by location or school",
                  "Chat privately, agree on terms, done",
                  "Both parties are verified students — no randos"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start gap-5 lg:items-center">
              <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 lg:w-full">
                <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Real scenario
                </p>
                <p className="mt-3 text-white text-lg font-medium leading-7">
                  "I'm doing my internal medicine rotation in Chicago for 6 weeks starting
                  March 15th. My apartment is sitting empty. Another med student from a
                  different school is rotating into Chicago that exact week."
                </p>
                <p className="mt-4 text-emerald-400 font-semibold">
                  → Both verified. Both students. Easy sublease, no sketchy strangers.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl w-full lg:w-auto"
              >
                <Link href="/auth/sign-up">
                  Post your sublease
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section id="safety" className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Ready to clear some space?
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Takes about 2 minutes to sign up. Drop your university email, confirm it,
              and you're in. Your first listing takes another 2 minutes. That's it.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">
                  Let's go
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/listings">Browse first</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-400">
              Free to join. No listing fees. Your info stays private.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
