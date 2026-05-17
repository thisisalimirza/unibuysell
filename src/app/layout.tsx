import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { signOutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "UniBuySell | Verified Student Marketplace",
  description:
    "A closed, trusted buy-and-sell marketplace for verified college and medical school students."
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
    : { id: "demo" };
  const showInternalNav = Boolean(user);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                UB
              </span>
              <span>UniBuySell</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              {showInternalNav ? (
                <>
                  <Link href="/dashboard" className="hover:text-primary">
                    Dashboard
                  </Link>
                  <Link href="/listings" className="hover:text-primary">
                    Listings
                  </Link>
                  <Link href="/chats" className="hover:text-primary">
                    Messages
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/#trust" className="hover:text-primary">
                    Trust
                  </Link>
                  <Link href="/#safety" className="hover:text-primary">
                    Safety
                  </Link>
                </>
              )}
            </nav>
            <div className="flex items-center gap-2">
              {showInternalNav ? (
                demoMode ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard">Demo mode</Link>
                  </Button>
                ) : (
                  <form action={signOutAction}>
                    <Button variant="outline" size="sm" type="submit">
                      Sign out
                    </Button>
                  </form>
                )
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/auth/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/auth/sign-up">Join verified</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
