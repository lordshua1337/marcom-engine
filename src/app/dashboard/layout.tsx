"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Connections", href: "/dashboard/connections" },
  { label: "Email", href: "/dashboard/email" },
  { label: "Social", href: "/dashboard/social" },
  { label: "Creative", href: "/dashboard/creative" },
  { label: "Contacts", href: "/dashboard/contacts" },
  { label: "Approvals", href: "/dashboard/approvals" },
] as const;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Top navigation */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "0 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-nav)",
          height: 48,
          overflowX: "auto",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--accent)",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 1,
            textDecoration: "none",
            marginRight: 16,
            flexShrink: 0,
          }}
        >
          MARCOM
        </Link>

        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                textDecoration: "none",
                fontSize: 13,
                padding: "12px 12px",
                borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                fontWeight: isActive ? 600 : 400,
                flexShrink: 0,
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Page content */}
      {children}
    </div>
  );
}
