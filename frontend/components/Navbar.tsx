"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Product",  href: "#product"  },
  { label: "Features", href: "#features" },
  { label: "Pricing",  href: "#pricing"  },
  { label: "Docs",     href: "#docs"     },
  { label: "Blog",     href: "#blog"     },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [mounted,     setMounted]     = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerCls = cn(
    "fixed inset-x-0 top-0 z-50 transition-all duration-300",
    mounted && scrolled
      ? "bg-bg-base/80 backdrop-blur-md border-b border-line-default/50 shadow-sm"
      : "bg-transparent"
  );

  return (
    <>
      {/* ── Header bar ── */}
      <header className={headerCls} role="banner">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[68px] items-center gap-8">

            {/* Logo */}
            <Link
              href="/"
              aria-label="PulseOps home"
              className="flex shrink-0 items-center"
            >
              <Image
                src="/logo-transparent.png"
                alt="PulseOps"
                width={260}
                height={72}
                priority
                className="h-16 w-auto object-contain"
              />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1 mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-brand-default transition-all duration-200 rounded-xl hover:bg-brand-default/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-bold text-text-primary rounded-xl hover:bg-bg-subtle transition-all"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-brand-default shadow-[0_4px_12px_rgba(216,180,254,0.4)] hover:shadow-[0_6px_16px_rgba(216,180,254,0.6)] hover:-translate-y-0.5 transition-all"
              >
                Start free &rarr;
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden ml-auto flex flex-col justify-center gap-[5px] w-9 h-9 p-2
                         rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span
                className={`block h-0.5 w-full bg-gray-700 rounded-full transition-all duration-250
                            ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-full bg-gray-700 rounded-full transition-all duration-250
                            ${mobileOpen ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-full bg-gray-700 rounded-full transition-all duration-250
                            ${mobileOpen ? "translate-y-[-7px] -rotate-45" : ""}`}
              />
            </button>

          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        className={`md:hidden fixed inset-x-0 top-[68px] z-40 bg-white border-b border-gray-100
                    overflow-hidden transition-[max-height] duration-350 ease-in-out
                    ${mobileOpen ? "max-h-96" : "max-h-0"}`}
        aria-hidden={!mobileOpen}
      >
        <nav
          className="flex flex-col px-4 pb-5 pt-3 gap-1"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-3 text-base font-medium text-gray-700 rounded-lg
                         hover:text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-2 mt-3 pt-4 border-t border-gray-100">
            <Link
              href="/login"
              className="flex items-center justify-center py-2.5 text-sm font-medium
                         text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex items-center justify-center py-2.5 text-sm font-semibold text-white
                         rounded-lg bg-linear-to-r from-blue-500 to-teal-400
                         shadow-[0_2px_12px_rgba(59,130,246,0.3)] transition-all"
              onClick={() => setMobileOpen(false)}
            >
              Get started →
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
