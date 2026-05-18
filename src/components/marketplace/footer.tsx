import Link from "next/link";
import { ShieldCheck, MapPin, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-white">
                Uni<span className="text-amber-400">Buy</span>Sell
              </span>
            </div>
            <p className="mt-3 text-sm leading-6">
              Sell your stuff to students you can actually trust. No Facebook randos,
              no eBay fees, no sketchy meetups. Just verified students.
            </p>
            <Link
              href="/auth/sign-up"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Join free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="text-sm font-semibold text-white">Marketplace</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/listings", label: "Browse listings" },
                { href: "/listings/new", label: "Post a listing" },
                { href: "/chats", label: "Messages" },
                { href: "/dashboard", label: "Dashboard" }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white">Categories</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {["Textbooks", "Medical Gear", "Electronics", "Subleases"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/listings?category=${encodeURIComponent(cat)}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety */}
          <div>
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Safe meeting zones
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                "Student Union",
                "Library lobby",
                "Residence hall front desk",
                "Campus Police lot"
              ].map((zone) => (
                <li key={zone} className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 flex-none text-emerald-500" />
                  {zone}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} UniBuySell · Verified student marketplace</p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Personal emails are never shared or displayed publicly
          </p>
        </div>
      </div>
    </footer>
  );
}
