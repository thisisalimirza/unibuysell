"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  User,
  LogOut,
  Plus
} from "lucide-react";

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

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <div className="relative md:hidden" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5">
          <div className="p-2">
            {showInternalNav ? (
              <>
                {/* Quick post CTA */}
                <Link
                  href="/listings/new"
                  onClick={() => setOpen(false)}
                  className="mb-1 flex items-center gap-3 rounded-xl bg-violet-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  <Plus className="h-4 w-4" />
                  Post a listing
                </Link>

                {[
                  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
                  { href: "/listings", label: "Browse listings", icon: ShoppingBag },
                  { href: "/chats", label: "Messages", icon: MessageSquare },
                  ...(userId ? [{ href: `/profile/${userId}`, label: "My Profile", icon: User }] : [])
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <link.icon className="h-4 w-4 text-slate-400" />
                    {link.label}
                  </Link>
                ))}

                <div className="mx-1 my-1.5 h-px bg-slate-100" />

                {demoMode ? (
                  <p className="px-3 py-2 text-xs text-slate-400">Demo mode — data is not persisted</p>
                ) : (
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
                  Why it's safer
                </Link>
                <Link
                  href="/#safety"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Safety features
                </Link>
                <div className="mx-1 my-1.5 h-px bg-slate-100" />
                <Link
                  href="/auth/sign-in"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-violet-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  Join free
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
