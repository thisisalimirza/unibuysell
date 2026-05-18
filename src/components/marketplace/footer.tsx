import Link from "next/link";
import { ShieldCheck, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/70">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                UB
              </span>
              UniBuySell
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              A closed marketplace for verified college and medical school students.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Marketplace</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/listings" className="hover:text-primary">
                  Browse listings
                </Link>
              </li>
              <li>
                <Link href="/listings/new" className="hover:text-primary">
                  Post a listing
                </Link>
              </li>
              <li>
                <Link href="/chats" className="hover:text-primary">
                  My messages
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Categories</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              {["Textbooks", "Medical Gear", "Electronics", "Subleases"].map((cat) => (
                <li key={cat}>
                  <Link href={`/listings?category=${encodeURIComponent(cat)}`} className="hover:text-primary">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Safe meeting tips
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              {[
                "Student Union exchange table",
                "Library lobby or front desk",
                "Residence hall front desk",
                "Campus Police parking lot",
              ].map((zone) => (
                <li key={zone} className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 flex-none text-emerald-600" />
                  {zone}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} UniBuySell · Verified student marketplace · Emails never shared
        </div>
      </div>
    </footer>
  );
}
