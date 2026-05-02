export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold text-text-primary">Cookie Policy</h1>
      <p className="mt-3 text-text-secondary">
        PulseOps uses essential cookies for authentication and optional cookies for analytics and marketing preferences.
      </p>

      <div className="mt-8 space-y-4 text-text-secondary">
        <p>Essential cookies are required for login, session security, and core dashboard behavior.</p>
        <p>Optional cookies are controlled using the cookie preferences banner.</p>
      </div>
    </div>
  )
}
