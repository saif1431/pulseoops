export const colors = {
  brand: {
    primary: "#2563eb", // Vibrant Blue
    hover: "#1d4ed8",
    light: "#dbeafe",
    glow: "rgba(37,99,235,0.3)",
    subtle: "rgba(37,99,235,0.1)",
    default: "#2563eb",
    muted: "rgba(37,99,235,0.1)",
  },
  accent: {
    blue: "#3b82f6",
    indigo: "#6366f1",
    violet: "#8b5cf6",
    cyan: "#06b6d4",
    emerald: "#10b981",
  },
  bg: {
    base: "#ffffff", // Pure White
    surface: "#ffffff",
    elevated: "#f8fafc",
    subtle: "#f1f5f9",
    border: "#e2e8f0",
    borderHover: "#cbd5e1",
  },
  text: {
    primary: "#0f172a", // Slate 900
    secondary: "#475569", // Slate 600
    tertiary: "#64748b", // Slate 500
    muted: "#94a3b8",
    inverse: "#ffffff",
  },
  border: {
    default: "#e2e8f0",
    hover: "#cbd5e1",
    focus: "rgba(37,99,235,0.6)",
  },
  status: {
    up: "#10b981",
    degraded: "#f59e0b",
    down: "#ef4444",
    pending: "#94a3b8",
  },
  gradient: {
    brand: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    vibrant: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    cool: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    hero: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37,99,235,0.1) 0%, transparent 70%)",
  },
};

export const typography = {
  fontFamily: {
    display: ['"Inter"', 'system-ui', 'sans-serif'],
    sans: ['"Inter"', 'system-ui', 'sans-serif'],
    body: ['"Inter"', 'system-ui', 'sans-serif'],
    mono: ['"Fragment Mono"', '"JetBrains Mono"', 'monospace'],
  },
  fontSize: {
    hero: ["112px", { lineHeight: "0.95", letterSpacing: "-0.05em", fontWeight: "900" }],
    h2: ["72px", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "800" }],
    h3: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
    h4: ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
    base: ["18px", { lineHeight: "1.6", fontWeight: "400" }],
    sm: ["15px", { lineHeight: "1.5", fontWeight: "400" }],
    label: ["12px", { lineHeight: "1.2", letterSpacing: "0.1em", fontWeight: "900" }],
    xs: "0.75rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "1.875rem",
    "3xl": "2.25rem",
    "4xl": "3rem",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
  lineHeight: {
    tight: "1.1",
    normal: "1.6",
    relaxed: "1.75",
  },
};

export const spacing = {
  "1": "4px",
  "2": "8px",
  "3": "12px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "8": "32px",
  "10": "40px",
  "12": "48px",
  "16": "64px",
  "20": "80px",
  "24": "96px",
  "32": "128px",
  "48": "192px",
  "64": "256px",
};

export const borderRadius = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
  full: "9999px",
};

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  premium: "0 20px 80px -20px rgba(0, 0, 0, 0.08)",
  "glow-brand": "0 0 20px rgba(37,99,235,0.2)",
};

export const animations = {
  shimmer: "shimmer 2s linear infinite",
  float: "float 6s ease-in-out infinite",
  "pulse-glow": "pulse-glow 3s ease-in-out infinite",
  "fade-in": "fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  "slide-up": "slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
};

export const transitions = {
  fast: "150ms cubic-bezier(0.16, 1, 0.3, 1)",
  base: "300ms cubic-bezier(0.16, 1, 0.3, 1)",
  slow: "600ms cubic-bezier(0.16, 1, 0.3, 1)",
  premium: "1000ms cubic-bezier(0.16, 1, 0.3, 1)",
};

export const variants = {
  button: {
    variant: ["primary", "secondary", "ghost", "danger", "outline"],
    size: ["sm", "md", "lg"],
  },
  badge: {
    variant: ["success", "warning", "danger", "neutral", "brand"],
  },
  input: {
    state: ["default", "focus", "error", "disabled"],
  },
  card: {
    variant: ["default", "elevated", "bordered"],
  },
};
