"use client";

import { useState, type FormEvent } from "react";
import { contactEmail } from "@/lib/site";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea";
  required?: boolean;
  placeholder?: string;
};

type InquiryFormProps = {
  fields?: Field[];
  submitLabel?: string;
  /** "dark" sits on a deep surface; "light" on Paper. */
  tone?: "light" | "dark";
  /** Email subject line so submissions are easy to triage (e.g. "Speaking booking"). */
  subject?: string;
};

/**
 * Submissions are delivered to {@link contactEmail} through the site's own
 * /api/contact route, which relays via Resend with the sender as reply-to.
 */
const FORM_ENDPOINT = "/api/contact";

const defaultFields: Field[] = [
  { name: "name", label: "Your name", required: true, placeholder: "Jane Doe" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@company.com" },
  { name: "org", label: "Company / team", placeholder: "Acme Inc." },
  {
    name: "message",
    label: "What are you trying to solve?",
    type: "textarea",
    required: true,
    placeholder: "A sentence or two on the situation and the outcome you're after.",
  },
];

/**
 * Generic inquiry form. UI only, a clear seam for form submission
 * (Supabase / email / CRM) to be wired later. Validates and reflects state.
 */
export default function InquiryForm({
  fields = defaultFields,
  submitLabel = "Send inquiry",
  tone = "light",
  subject = "New inquiry from the website",
}: InquiryFormProps) {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const dark = tone === "dark";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(false);
    setSubmitting(true);

    const data = new FormData(e.currentTarget);
    const fields: Record<string, string> = {};
    let honeypot = "";
    data.forEach((value, key) => {
      if (typeof value !== "string") return;
      if (key === "_honey") honeypot = value;
      else fields[key] = value;
    });

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, fields, honeypot }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      setDone(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <p
        className={`text-body ${dark ? "text-amber" : "text-signature"}`}
        role="status"
      >
        Thank you, your note is in. I read these personally and will reply soon.
      </p>
    );
  }

  const labelCls = `block text-small font-medium ${dark ? "text-paper/80" : "text-ink"}`;
  const inputCls = `mt-2 w-full rounded-lg border px-4 py-3 text-body outline-none transition-colors duration-300 ease-calm ${
    dark
      ? "border-paper/20 bg-paper/5 text-paper placeholder:text-paper/35 focus:border-amber"
      : "border-ink/15 bg-paper text-ink placeholder:text-ink/35 focus:border-blue-lift"
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot, bots fill this; humans never see it. The API drops it. */}
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className={labelCls}>
            {field.label}
            {field.required ? <span className="text-amber"> *</span> : null}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              rows={5}
              className={inputCls}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              placeholder={field.placeholder}
              className={inputCls}
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className={`rounded-lg px-7 py-3.5 text-small font-medium transition-all duration-300 ease-calm disabled:cursor-not-allowed disabled:opacity-60 ${
          dark
            ? "bg-amber text-ink hover:brightness-[0.97]"
            : "bg-signature text-paper hover:bg-blue-lift"
        }`}
      >
        {submitting ? "Sending…" : submitLabel}
      </button>

      {error ? (
        <p
          className={`text-small ${dark ? "text-amber" : "text-signature"}`}
          role="alert"
        >
          Something went wrong sending that. Please try again, or email me directly
          at{" "}
          <a href={`mailto:${contactEmail}`} className="underline">
            {contactEmail}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
