"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, ShoppingBag, MessageSquare, User, LogOut } from "lucide-react";

import { signOutAction } from "@/app/auth/actions";

type MobileNavProps = {
  showInternalNav: boolean;
  demoMode: boolean;
  userId?: string;
};

export function MobileNav({ showInternalNav, demoMode, userId }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative md:hidden" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <nav className="p-2">
            {showInternalNav ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  Dashboard
                </Link>
                <Link
                  href="/listings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  Listings
                </Link>
                <Link
                  href="/chats"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Messages
                </Link>
                {userId ? (
                  <Link
                    href={`/profile/${userId}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <User className="h-4 w-4 text-primary" />
                    My Profile
                  </Link>
                ) : null}
                <div className="mx-2 my-1 border-t border-slate-100" />
                {demoMode ? (
                  <p className="px-3 py-2 text-xs text-slate-400">Demo mode — no real data</p>
                ) : (
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </form>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/#trust"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Trust
                </Link>
                <Link
                  href="/#safety"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Safety
                </Link>
                <div className="mx-2 my-1 border-t border-slate-100" />
                <Link
                  href="/auth/sign-in"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
                >
                  Join verified
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
