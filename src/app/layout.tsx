import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { signOutAction } from "@/app/auth/actions";
import { Footer } from "@/components/marketplace/footer";
import { MobileNav } from "@/components/marketplace/mobile-nav";
import { Button } from "@/components/ui/button";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { demoCurrentUserId } from "@/lib/demo-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "UniBuySell — Buy & Sell with Students You Can Actually Trust",
  description:
    "Tired of Facebook Marketplace randos and eBay fees? UniBuySell is a verified-only marketplace for college and med students. List your stuff in 2 minutes."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const demoMode = !hasSupabaseEnv();
  const user = !demoMode
    ? await createClient()
        .then((supabase) => supabase.auth.getUser())
        .then(({ data }) => data.user)
    : { id: demoCurrentUserId };
  const showInternalNav = Boolean(user);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}>
        <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white shadow-md shadow-violet-200 transition group-hover:bg-violet-500">
                UB
              </span>
              <span className="hidden font-bold text-slate-900 sm:block">
                Uni<span className="text-violet-600">BuySell</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {showInternalNav ? (
                <>
                  {[
                    { href: "/dashboard", label: "Dashboard" },
                    { href: "/listings", label: "Listings" },
                    { href: "/chats", label: "Messages" },
                    { href: `/profile/${user?.id}`, label: "My Profile" }
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  <Link href="/#trust" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                    Trust
                  </Link>
                  <Link href="/#safety" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                    Safety
                  </Link>
                </>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {showInternalNav ? (
                demoMode ? (
                  <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 md:inline-flex">
                    Demo mode
                  </span>
                ) : (
                  <form action={signOutAction} className="hidden md:block">
                    <Button variant="ghost" size="sm" type="submit">
                      Sign out
                    </Button>
                  </form>
                )
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                    <Link href="/auth/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild size="sm" className="hidden md:inline-flex">
                    <Link href="/auth/sign-up">Join free</Link>
                  </Button>
                </>
              )}

              <MobileNav
                showInternalNav={showInternalNav}
                demoMode={demoMode}
                userId={user?.id}
              />
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <Footer />
      </body>
    </html>
  );
}
