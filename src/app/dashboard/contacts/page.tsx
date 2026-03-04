"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactsPage() {
  const [search, setSearch] = useState("");

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Contacts
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Contact database with search, filter, CSV import, and Apollo
            enrichment.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href="/dashboard/contacts/import"
            style={{
              padding: "8px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border-hover)",
              borderRadius: 6,
              color: "var(--text-secondary)",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Import CSV
          </Link>
          <Link
            href="/dashboard/contacts/enrich"
            style={{
              padding: "8px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border-hover)",
              borderRadius: 6,
              color: "var(--text-secondary)",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Enrich
          </Link>
          <Link
            href="/dashboard/contacts/lists"
            style={{
              padding: "8px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border-hover)",
              borderRadius: 6,
              color: "var(--text-secondary)",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Lists
          </Link>
        </div>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search contacts by name, email, company..."
        style={{
          width: "100%",
          padding: "10px 16px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          color: "var(--text-primary)",
          fontSize: 14,
          marginBottom: 16,
          boxSizing: "border-box",
          fontFamily: "var(--font-sans)",
        }}
      />

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 40,
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: 14,
            fontFamily: "var(--font-mono)",
          }}
        >
          No contacts yet. Import a CSV or add contacts manually.
        </p>
      </div>
    </div>
  );
}
