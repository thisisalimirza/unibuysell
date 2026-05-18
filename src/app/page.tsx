import Link from "next/link";
import {
  ShieldCheck,
  GraduationCap,
  MessageSquareLock,
  Star,
  ArrowRight,
  BookOpen,
  Stethoscope,
  Laptop,
  Building2,
  CheckCircle2,
  Lock,
  Zap
} from "lucide-react";

import { Button } from "@/components/ui/button";

const categories = [
  {
    icon: BookOpen,
    label: "Textbooks",
    desc: "Course books, study guides, lab manuals",
    color: "bg-blue-50 text-blue-600",
    hoverRing: "hover:ring-blue-200"
  },
  {
    icon: Stethoscope,
    label: "Medical Gear",
    desc: "Stethoscopes, otoscopes, scrubs",
    color: "bg-rose-50 text-rose-600",
    hoverRing: "hover:ring-rose-200"
  },
  {
    icon: Laptop,
    label: "Electronics",
    desc: "Laptops, tablets, calculators",
    color: "bg-violet-50 text-violet-600",
    hoverRing: "hover:ring-violet-200"
  },
  {
    icon: Building2,
    label: "Subleases",
    desc: "Short-term rooms near campus",
    color: "bg-emerald-50 text-emerald-600",
    hoverRing: "hover:ring-emerald-200"
  }
];

const features = [
  {
    icon: GraduationCap,
    title: "Verified students only",
    desc: "Every account is tied to a confirmed .edu, .ac.uk, or .edu.au address. No exceptions."
  },
  {
    icon: Lock,
    title: "Private negotiation",
    desc: "Chat stays inside the platform. Your personal email and number are never exposed."
  },
  {
    icon: Star,
    title: "Earned reviews only",
    desc: "Ratings are unlocked after a completed transaction. No fake or unverified reviews."
  },
  {
    icon: Zap,
    title: "Real-time messaging",
    desc: "Supabase Realtime keeps your negotiation instant without page refreshes."
  }
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              University emails only · No public providers
            </span>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              The safest way to buy & sell
              <span className="block text-yellow-300"> on campus.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Every seller is a verified student. Every deal happens through private in-app
              chat. Every rating is tied to a real completed transaction.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-violet-700 shadow-xl hover:bg-slate-50 hover:text-violet-800">
                <Link href="/auth/sign-up">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50">
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
              {["Free to join", "No spam ever", "University emails only", "Real-time messaging"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Browse by category</h2>
            <p className="mt-1 text-slate-500">Everything students need, sold by students.</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/listings">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={`/listings?category=${encodeURIComponent(cat.label)}`}
              className={`group block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.05] transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-2 ${cat.hoverRing}`}
            >
              <div className={`mb-4 inline-flex rounded-xl p-3 ${cat.color}`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <p className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">{cat.label}</p>
              <p className="mt-1 text-sm text-slate-500">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="trust" className="bg-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold text-white">
              Built different from Facebook Marketplace.
            </h2>
            <p className="mt-4 text-slate-400">
              No anonymous buyers. No public listings. No leaving campus to meet a stranger.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <div className="mb-4 inline-flex rounded-xl bg-violet-600/20 p-3">
                  <feature.icon className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                <MessageSquareLock className="h-4 w-4" />
                Safe meeting reminders
              </span>
              <h2 className="mt-4 text-3xl font-bold text-white">
                Every chat includes a safety reminder.
              </h2>
              <p className="mt-4 text-emerald-100">
                In-app messaging surfaces Safe Meeting Zone prompts before every exchange —
                Student Union, library lobby, residence hall front desk, or Campus Police lot.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  "Student Union exchange table",
                  "Library lobby or front desk",
                  "Residence hall front desk",
                  "Campus Police parking lot"
                ].map((zone) => (
                  <div key={zone} className="flex items-center gap-2 text-sm text-emerald-100">
                    <ShieldCheck className="h-4 w-4 flex-none text-emerald-300" />
                    {zone}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="text-center">
                <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl">
                  <Link href="/auth/sign-up">
                    Join verified students
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="mt-3 text-sm text-emerald-200">Free · No credit card · Instant access after email confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
