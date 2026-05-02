import React from "react";
import Link from "next/link";

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans">
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-12 border-t border-line-default/30 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-text-tertiary text-xs font-bold uppercase tracking-[0.2em]">
            Powered by <Link href="/" className="text-brand-default hover:opacity-80 transition-opacity">PulseOps</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
