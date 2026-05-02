"use client"

import { motion } from "framer-motion"
import { Activity, ShieldCheck, Scale, FileText } from "lucide-react"

import { premiumFadeIn } from "@/lib/animations"

export default function TermsPage() {
  const sections = [
    {
      id: "1",
      title: "Acceptance of Terms",
      icon: ShieldCheck,
      content: "By accessing or using PulseOps (\"the Service\"), you agree to be bound by these Terms of Service. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these terms."
    },
    {
      id: "2",
      title: "Description of Service",
      icon: Activity,
      content: "PulseOps provides uptime monitoring, incident management, and public status page hosting. The Service includes URL health checks, alert notifications (email, Slack, webhook), incident lifecycle tracking, and customer-facing status pages."
    },
    {
      id: "3",
      title: "Accounts & Registration",
      icon: Scale,
      content: "You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use."
    },
    {
      id: "4",
      title: "Acceptable Use",
      icon: FileText,
      content: "You agree to use PulseOps in compliance with all applicable laws. You may not: (a) use the Service to monitor targets you do not own or have authorization to monitor; (b) attempt to overwhelm target endpoints through excessive check frequency; (c) reverse engineer, decompile, or disassemble any part of the Service."
    }
  ]

  return (
    <div className="bg-bg-base min-h-screen pb-32">
      {/* Header Section */}
      <section className="relative pt-48 pb-24 overflow-hidden bg-dot-pattern border-b border-line-default">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
          <motion.div {...premiumFadeIn}>
            <div className="inline-flex items-center rounded-full border border-line-default bg-white px-4 py-1.5 text-sm font-bold text-brand-primary shadow-premium mb-8">
              ⚖️ Legal Agreement
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-text-primary mb-8 leading-[0.95]">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl font-medium text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Last updated: April 27, 2026. Please read these terms carefully before using the PulseOps platform.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05)_0,transparent_70%)] -z-10" />
      </section>

      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="grid gap-12">
          {sections.map((section, idx) => (
            <motion.section 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-10 bg-white rounded-[32px] border border-line-default shadow-premium hover:shadow-premium-hover transition-all duration-500"
            >
              <div className="flex items-start gap-8">
                <div className="h-14 w-14 rounded-2xl bg-brand-subtle flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                  <section.icon className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
                    <span className="text-brand-primary opacity-30 font-black">0{section.id}</span>
                    {section.title}
                  </h2>
                  <p className="text-lg text-text-secondary leading-relaxed font-medium">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.section>
          ))}

          <section className="mt-12 p-10 bg-bg-elevated rounded-[32px] border border-line-default">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Need more details?</h2>
            <p className="text-lg text-text-secondary mb-8 font-medium">
              If you have any questions about our Terms of Service or Privacy Policy, please don't hesitate to reach out to our legal team.
            </p>
            <a 
              href="mailto:legal@pulseops.io" 
              className="inline-flex items-center gap-3 text-brand-primary font-black text-xl hover:translate-x-2 transition-transform"
            >
              legal@pulseops.io
              <Activity className="h-5 w-5" />
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
