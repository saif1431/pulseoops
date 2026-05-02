"use client";

import React, { useState } from "react";
import { subscribeToStatusPage } from "@/lib/api/status-pages";
import { toast } from "sonner";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface SubscribeFormProps {
  slug: string;
}

type SubscribeState = "idle" | "subscribed" | "unsubscribe-confirm" | "unsubscribed";

export function SubscribeForm({ slug }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [unsubEmail, setUnsubEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<SubscribeState>("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await subscribeToStatusPage(slug, email);
      setState("subscribed");
      toast.success("You'll be notified of any incidents");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ""
      if (message.includes("already subscribed")) {
        setState("subscribed");
        toast.info("You're already subscribed");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unsubEmail) return;

    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/status-pages/${slug}/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unsubEmail }),
      });

      if (!res.ok) {
        throw new Error("Unsubscribe failed");
      }

      setState("unsubscribed");
      toast.success("You've been unsubscribed successfully");
    } catch {
      // Always show success to avoid email enumeration
      setState("unsubscribed");
      toast.success("If you were subscribed, you've been unsubscribed");
    } finally {
      setLoading(false);
    }
  };

  // Unsubscribed confirmation
  if (state === "unsubscribed") {
    return (
      <div className="bg-white border border-line-default/50 rounded-[32px] p-10 text-center space-y-6 shadow-sm max-w-2xl mx-auto">
        <div className="mx-auto w-16 h-16 bg-bg-base rounded-2xl flex items-center justify-center text-text-tertiary border border-line-default/50">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-text-primary">Unsubscribed</h3>
          <p className="text-sm font-medium text-text-secondary leading-relaxed">You will no longer receive incident notifications for this page. We hope to see you back soon.</p>
        </div>
        <button
          onClick={() => { setState("idle"); setEmail(""); setUnsubEmail(""); }}
          className="text-[11px] font-bold text-brand-default uppercase tracking-[0.2em] hover:opacity-70 transition-opacity pt-2"
        >
          Re-subscribe now
        </button>
      </div>
    );
  }

  // Unsubscribe form
  if (state === "unsubscribe-confirm") {
    return (
      <div className="bg-white border border-line-default/50 rounded-[32px] p-10 shadow-sm max-w-2xl mx-auto">
        <div className="space-y-3 mb-8">
          <h3 className="text-2xl font-extrabold text-text-primary">Unsubscribe</h3>
          <p className="text-sm font-medium text-text-secondary">Enter your email address to stop receiving updates.</p>
        </div>
        <form onSubmit={handleUnsubscribe} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="email"
              placeholder="Email address"
              required
              value={unsubEmail}
              onChange={(e) => setUnsubEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-bg-base border border-line-default/50 rounded-2xl text-sm font-bold placeholder:text-text-tertiary/50 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-text-primary text-white rounded-2xl text-sm font-bold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-black/10"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm
          </button>
        </form>
        <button
          onClick={() => setState("idle")}
          className="mt-6 text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em] hover:text-text-primary transition-colors"
        >
          &larr; Back to updates
        </button>
      </div>
    );
  }

  // Subscribed success state
  if (state === "subscribed") {
    return (
      <div className="bg-white border border-line-default/50 rounded-[32px] p-10 text-center space-y-6 shadow-sm max-w-2xl mx-auto">
        <div className="mx-auto w-16 h-16 bg-status-up/10 rounded-2xl flex items-center justify-center text-status-up border border-status-up/20 shadow-lg shadow-status-up/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-text-primary">Subscription active!</h3>
          <p className="text-sm font-medium text-text-secondary leading-relaxed">You will be notified via email of any future incidents or maintenance events on this page.</p>
        </div>
        <button 
          onClick={() => setState("unsubscribe-confirm")}
          className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em] hover:text-status-down transition-colors pt-2"
        >
          Unsubscribe from updates
        </button>
      </div>
    );
  }

  // Default subscribe form
  return (
    <div className="bg-white border border-line-default/50 rounded-[40px] p-10 sm:p-12 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_10%,rgba(216,180,254,0.1)_0,transparent_40%)] pointer-events-none" />
      <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="flex-grow space-y-4 text-center lg:text-left">
          <h3 className="text-3xl font-extrabold text-text-primary tracking-tight">Stay updated</h3>
          <p className="text-base font-medium text-text-secondary leading-relaxed max-w-md">Get instant email notifications whenever an incident is created, updated, or resolved.</p>
        </div>
        <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-72 pl-12 pr-4 py-4 bg-bg-base border border-line-default/50 rounded-2xl text-sm font-bold placeholder:text-text-tertiary/50 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-brand-default text-white rounded-2xl text-sm font-bold hover:bg-brand-default/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-lg shadow-brand-default/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Subscribe
          </button>
        </form>
      </div>
      <div className="mt-10 pt-6 border-t border-line-default/20 flex justify-center">
        <button
          onClick={() => setState("unsubscribe-confirm")}
          className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em] hover:text-text-primary transition-colors flex items-center gap-2"
        >
          <div className="h-1 w-1 rounded-full bg-border-default" />
          Already subscribed? Manage notification settings here
          <div className="h-1 w-1 rounded-full bg-border-default" />
        </button>
      </div>
    </div>
  );
}
