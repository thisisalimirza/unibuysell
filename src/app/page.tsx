import Link from "next/link";
import {
  BookOpen,
  Stethoscope,
  Laptop,
  Building2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  Star,
} from "lucide-react";

const categories = [
  {
    icon: BookOpen,
    label: "Textbooks",
    tagline: "The $200 book you used twice.",
    desc: "Ship it to a student who actually needs it right now.",
  },
  {
    icon: Stethoscope,
    label: "Medical Gear",
    tagline: "That Littmann you upgraded from?",
    desc: "An MS1 somewhere wants it. Meet on campus or just ship it.",
  },
  {
    icon: Laptop,
    label: "Electronics",
    tagline: "Your old iPad is someone's new study tool.",
    desc: "Calculators, laptops, tablets — sell it here.",
  },
  {
    icon: Building2,
    label: "Subleases",
    tagline: "Away rotation for 6 weeks?",
    desc: "List your room. Another student needs it.",
  },
];

const trustCards = [
  {
    num: "01",
    icon: ShieldCheck,
    title: "Only .edu accounts",
    desc: "Every single person is a verified student. Not a maybe — verified.",
  },
  {
    num: "02",
    icon: MessageSquare,
    title: "Private chat, always",
    desc: "You never share your number. Negotiate and coordinate fully in-app.",
  },
  {
    num: "03",
    icon: Star,
    title: "Real reviews only",
    desc: "You can only leave a review after a real completed sale.",
  },
  {
    num: "04",
    icon: CheckCircle2,
    title: "Meet up or ship",
    desc: "Local? Meet on campus. Across the country? Just ship it.",
  },
];

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 10% 50%, #92400e 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
          <div className="max-w-4xl">
            {/* Badge */}
            <div
              className="animate-fade-up mb-8 inline-flex items-center gap-2.5"
              style={{ animationDelay: "0ms" }}
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                University-verified marketplace
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif">
              <span
                className="animate-fade-up block text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl lg:text-8xl"
                style={{ animationDelay: "80ms" }}
              >
                Sell your stuff
              </span>
              <span
                className="animate-fade-up block text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl lg:text-8xl"
                style={{ animationDelay: "180ms" }}
              >
                to students
              </span>
              <span
                className="animate-fade-up block text-5xl font-bold leading-none tracking-tight text-amber-400 sm:text-6xl lg:text-8xl"
                style={{ animationDelay: "280ms" }}
              >
                you can trust.
              </span>
            </h1>

            {/* Subtext */}
            <p
              className="animate-fade-up mt-8 max-w-xl text-lg leading-relaxed text-slate-400"
              style={{ animationDelay: "380ms" }}
            >
              No Facebook Marketplace randos. No eBay fees. No sketchy meetups.
              Every person on UniBuySell has a verified university email — that&apos;s
              the whole deal.
            </p>

            {/* CTAs */}
            <div
              className="animate-fade-up mt-10 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "460ms" }}
            >
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-4 text-sm font-bold text-slate-900 transition-all hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/25 active:scale-95"
              >
                Get your free spot
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white/80 transition-all hover:border-white/40 hover:text-white hover:bg-white/5"
              >
                Already have an account
              </Link>
            </div>

            {/* Trust row */}
            <div
              className="animate-fade-up mt-12 flex flex-wrap gap-x-6 gap-y-2"
              style={{ animationDelay: "540ms" }}
            >
              {[
                "Free to join",
                "No listing fees",
                ".edu verified only",
                "Ships nationwide",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="text-amber-500">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The honest pitch ── */}
      <section className="bg-[#faf8f2] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            {/* Left: editorial text */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Why we built this
              </p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
                Selling on Facebook
                Marketplace sucks.{" "}
                <span className="text-amber-500">We fixed it.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-stone-600">
                You&apos;ve got a $180 anatomy atlas taking up shelf space. But Facebook
                Marketplace means meeting a stranger in a parking lot. eBay means fees,
                47 steps, and no one to hold accountable.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-stone-600">
                We wanted a place where you could{" "}
                <strong className="font-bold text-slate-800">
                  list your thing, trust the buyer, and get it done.
                </strong>{" "}
                So we built it — and made sure every person has a verified university
                email before they can do anything.
              </p>
              <Link
                href="/auth/sign-up"
                className="mt-8 inline-flex items-center gap-2 font-semibold text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-4 hover:text-amber-600 transition-colors"
              >
                Join for free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right: numbered trust cards */}
            <div className="grid gap-6 sm:grid-cols-2">
              {trustCards.map((card) => (
                <div
                  key={card.num}
                  className="border-t-2 border-amber-400 bg-white p-6 shadow-sm"
                >
                  <span className="text-xs font-bold tracking-widest text-amber-500">
                    {card.num}
                  </span>
                  <div className="mt-3 inline-flex rounded-lg bg-amber-50 p-2.5">
                    <card.icon className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="mt-2 font-bold text-slate-900">{card.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-stone-500">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bulletin board / nationwide ── */}
      <section className="border-t border-stone-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Seriously though
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-slate-900 lg:text-5xl">
              Why did this not exist until now?
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Bulletin board card */}
            <div className="overflow-hidden rounded-2xl ring-1 ring-stone-200">
              <div className="bg-slate-900 px-6 py-3.5">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  📌 The Old Way
                </span>
              </div>
              <div className="bg-white p-8">
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  Remember that bulletin board in the hallway?
                </h3>
                <p className="mt-4 leading-7 text-stone-600">
                  That corkboard covered in five-year-old listings, still advertising a
                  2018 Toyota and a Nintendo DS with a disconnected phone number. The one
                  you only remember exists when you&apos;re sitting at home, 30 minutes from
                  campus.
                </p>
                <p className="mt-4 leading-7 text-stone-600">
                  <strong className="text-slate-800">This is that bulletin board.</strong>{" "}
                  Except it&apos;s on your phone, nothing is expired, and you can actually
                  sell things on it. Browse from your couch at midnight, list in two
                  minutes, done.
                </p>
              </div>
            </div>

            {/* Ship it card */}
            <div className="overflow-hidden rounded-2xl ring-1 ring-stone-200">
              <div className="bg-amber-400 px-6 py-3.5">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-900">
                  📦 The New Way
                </span>
              </div>
              <div className="bg-white p-8">
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  Nobody at your school needs it? Someone in Ohio does.
                </h3>
                <p className="mt-4 leading-7 text-stone-600">
                  You don&apos;t have to meet in person. Just ship it. Your Netter&apos;s Atlas
                  collecting dust since last spring can go to a student in Ohio who&apos;s
                  freaking out about their anatomy practical in two weeks.
                </p>
                <p className="mt-4 leading-7 text-stone-600">
                  Sell nationwide. Buy nationwide. Every person on the other end has a
                  verified university email.{" "}
                  <strong className="text-slate-800">It&apos;s just students, all the way down.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              What can you list?
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-white lg:text-4xl">
              Pretty much anything a student buys,
              <br className="hidden sm:block" /> uses, and eventually needs to get rid of.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`/listings?category=${encodeURIComponent(cat.label)}`}
                className="group block rounded-2xl bg-slate-800 p-6 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-400/20 hover:ring-0"
              >
                <div className="mb-5 inline-flex rounded-xl bg-white/5 p-3 text-amber-400 transition-colors duration-300 group-hover:bg-slate-900/15 group-hover:text-slate-900">
                  <cat.icon className="h-6 w-6" />
                </div>
                <p className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-slate-900">
                  {cat.label}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-400 transition-colors duration-300 group-hover:text-slate-800">
                  {cat.tagline}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 transition-colors duration-300 group-hover:text-slate-700">
                  {cat.desc}
                </p>
                <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors duration-300 group-hover:text-slate-800">
                  Browse listings
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Med student callout ── */}
      <section id="med-students" className="bg-amber-400 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Stethoscope className="h-3.5 w-3.5" />
                Hey, med students — this one&apos;s for you
              </span>
              <h2 className="mt-6 font-serif text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
                Away rotations are chaotic enough. Your housing
                situation shouldn&apos;t be.
              </h2>
              <p className="mt-5 leading-7 text-amber-900">
                Right now, med students sublease through random GroupMes and Facebook
                groups — dealing with people you don&apos;t really know, awkward negotiations,
                and zero accountability. Post your place here instead.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                {[
                  "List your room for the exact dates of your rotation",
                  "Incoming students search by location or school",
                  "Chat privately, agree on terms, done",
                  "Both parties are verified students — no randos",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm font-medium text-slate-900">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-slate-900" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-2xl bg-white/70 p-7 ring-1 ring-amber-300/50 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Real scenario
                </p>
                <p className="mt-4 text-lg font-medium leading-7 text-slate-900">
                  &ldquo;I&apos;m doing my internal medicine rotation in Chicago for 6 weeks starting
                  March 15th. My apartment is sitting empty. Another med student from a
                  different school is rotating into Chicago that exact week.&rdquo;
                </p>
                <p className="mt-5 font-bold text-slate-900">
                  → Both verified. Both students. Easy sublease, no sketchy strangers.
                </p>
              </div>

              <Link
                href="/auth/sign-up"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 font-bold text-white transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:scale-95 lg:w-auto"
              >
                Post your sublease
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="safety" className="bg-slate-900 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              That&apos;s it. That&apos;s the whole pitch.
            </p>
            <h2 className="mt-5 font-serif text-5xl font-bold text-white lg:text-7xl">
              Ready to clear
              <span className="text-amber-400"> some space?</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Takes about 2 minutes to sign up. Drop your university email, confirm it,
              and you&apos;re in. Your first listing takes another 2 minutes.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-10 py-4 font-bold text-slate-900 transition-all hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/25 active:scale-95"
              >
                Let&apos;s go
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/listings"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-10 py-4 font-semibold text-white/70 transition-all hover:border-white/40 hover:text-white hover:bg-white/5"
              >
                Browse first
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-600">
              Free to join · No listing fees · Your info stays private
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
