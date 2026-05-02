import Link from "next/link"
import Image from "next/image"

export function MarketingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line-default bg-bg-base pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="group mb-6 flex w-fit items-center gap-4">
              <Image src="/logo-transparent.png" alt="PulseOps Logo" width={280} height={76} className="h-16 w-auto" priority />
            </Link>
            <p className="max-w-xs text-sm leading-6 text-text-secondary sm:text-base">
              Empowering engineering teams with high-performance monitoring and beautiful status pages. Build trust with every alert.
            </p>
          </div>
          
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-text-primary">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/#features" className="inline-block text-sm text-text-secondary transition-colors hover:text-brand-primary">Features</Link></li>
              <li><Link href="/pricing" className="inline-block text-sm text-text-secondary transition-colors hover:text-brand-primary">Pricing</Link></li>
              <li><Link href="/about" className="inline-block text-sm text-text-secondary transition-colors hover:text-brand-primary">About Us</Link></li>
              <li><Link href="/blog" className="inline-block text-sm text-text-secondary transition-colors hover:text-brand-primary">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-text-primary">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/style-guide" className="inline-block text-sm text-text-secondary transition-colors hover:text-brand-primary">Style Guide</Link></li>
              <li><Link href="/license" className="inline-block text-sm text-text-secondary transition-colors hover:text-brand-primary">License</Link></li>
              <li><Link href="/changelog" className="inline-block text-sm text-text-secondary transition-colors hover:text-brand-primary">Changelog</Link></li>
              <li><Link href="/docs" className="inline-block text-sm text-text-secondary transition-colors hover:text-brand-primary">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-text-primary">Support</h4>
            <ul className="space-y-3">
              <li className="cursor-pointer text-sm text-text-secondary transition-colors hover:text-brand-primary">support@pulseops.com</li>
              <li className="text-sm text-text-secondary">+1 (888) PULSE-OPS</li>
              <li className="text-sm leading-relaxed text-text-secondary">
                123 Monitor Way,<br />
                Cloud City, SF 94103
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line-default pt-8 md:flex-row">
          <p className="text-xs text-text-tertiary sm:text-sm">
            &copy; {new Date().getFullYear()} PulseOps Inc. All rights reserved. Built for high-stakes infrastructure.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 rounded-full border border-status-up/20 bg-status-up/5 px-3 py-1.5 text-[11px] font-semibold text-status-up">
              <div className="h-2 w-2 rounded-full bg-status-up animate-pulse" />
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
