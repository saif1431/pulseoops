"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Activity, Mail, Phone, MapPin } from "lucide-react"

import { premiumFadeIn } from "@/lib/animations"

export default function ContactPage() {
  const [loading, setLoading] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [company, setCompany] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [newsletter, setNewsletter] = React.useState(true)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, message, newsletter }),
      })

      if (!res.ok) throw new Error()
      
      setSubmitted(true)
    } catch {
      setError("Unable to submit right now. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-bg-base min-h-screen">
      {/* Header Section */}
      <section className="relative pt-48 pb-24 overflow-hidden bg-dot-pattern border-b border-line-default">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
          <motion.div {...premiumFadeIn}>
            <div className="inline-flex items-center rounded-full border border-line-default bg-white px-4 py-1.5 text-sm font-bold text-brand-primary shadow-premium mb-8">
              👋 Get in Touch
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-text-primary mb-8 leading-[0.95]">
              Let's build a <span className="text-gradient">more reliable</span> future
            </h1>
            <p className="mt-8 text-xl md:text-2xl font-medium text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Whether you have a technical question, need a custom demo, or just want to say hi, our team is here for you.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05)_0,transparent_70%)] -z-10" />
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-12"
            >
              <div>
                <h2 className="text-3xl font-bold text-text-primary mb-6">Contact Information</h2>
                <p className="text-lg text-text-secondary font-medium leading-relaxed mb-10">
                  Prefer a direct channel? Reach out to us through any of these platforms and we'll get back to you within 24 hours.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="h-12 w-12 rounded-xl bg-brand-subtle flex items-center justify-center text-brand-primary shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary mb-1">Email</h3>
                      <p className="text-text-secondary font-medium">hello@pulseops.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="h-12 w-12 rounded-xl bg-brand-subtle flex items-center justify-center text-brand-primary shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary mb-1">Phone</h3>
                      <p className="text-text-secondary font-medium">+1 (888) PULSE-OPS</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="h-12 w-12 rounded-xl bg-brand-subtle flex items-center justify-center text-brand-primary shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary mb-1">Office</h3>
                      <p className="text-text-secondary font-medium leading-relaxed">
                        123 Monitor Way,<br />
                        Cloud City, SF 94103
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-bg-elevated rounded-[32px] border border-line-default shadow-premium">
                <h3 className="text-xl font-bold text-text-primary mb-4">Trusted by modern teams</h3>
                <div className="flex flex-wrap gap-4 opacity-50 grayscale">
                   <span className="font-bold">Acme</span>
                   <span className="font-bold">Globex</span>
                   <span className="font-bold">Initech</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <div className="bg-white rounded-[48px] p-10 md:p-16 border border-line-default shadow-premium-hover">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="h-20 w-20 rounded-full bg-status-up/10 text-status-up flex items-center justify-center mx-auto mb-8">
                      <Activity className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary mb-4">Message Sent!</h2>
                    <p className="text-lg text-text-secondary font-medium mb-10">We've received your request and our team will be in touch shortly.</p>
                    <Button onClick={() => setSubmitted(false)} className="btn-secondary h-14 px-10">Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-text-primary ml-1">Your Name</label>
                        <input 
                          required 
                          placeholder="Jane Doe" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="w-full h-14 rounded-2xl border border-line-default bg-bg-subtle/30 px-6 text-sm text-text-primary focus:border-brand-primary focus:ring-0 transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-text-primary ml-1">Work Email</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="jane@company.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-14 rounded-2xl border border-line-default bg-bg-subtle/30 px-6 text-sm text-text-primary focus:border-brand-primary focus:ring-0 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-text-primary ml-1">Company (Optional)</label>
                      <input 
                        placeholder="Acme Inc." 
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full h-14 rounded-2xl border border-line-default bg-bg-subtle/30 px-6 text-sm text-text-primary focus:border-brand-primary focus:ring-0 transition-all"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-text-primary ml-1">How can we help?</label>
                      <textarea
                        required
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-[32px] border border-line-default bg-bg-subtle/30 px-6 py-5 text-sm text-text-primary focus:border-brand-primary focus:ring-0 transition-all"
                        placeholder="Tell us about your requirements..."
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={newsletter}
                        onChange={(e) => setNewsletter(e.target.checked)}
                        className="h-5 w-5 rounded-md border-line-default text-brand-primary focus:ring-brand-primary"
                      />
                      <label className="text-sm font-medium text-text-secondary">
                        Subscribe to our reliability insights newsletter.
                      </label>
                    </div>

                    {error && <p className="text-sm text-status-down font-bold">{error}</p>}

                    <Button type="submit" loading={loading} className="btn-primary w-full h-16 text-xl">
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
