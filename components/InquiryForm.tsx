"use client";

import { useState, type FormEvent } from "react";

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
};

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
 * Generic inquiry form. UI only — a clear seam for form submission
 * (Supabase / email / CRM) to be wired later. Validates and reflects state.
 */
export default function InquiryForm({
  fields = defaultFields,
  submitLabel = "Send inquiry",
  tone = "light",
}: InquiryFormProps) {
  const [done, setDone] = useState(false);
  const dark = tone === "dark";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO(integration): POST form payload to your submission endpoint.
    setDone(true);
  }

  if (done) {
    return (
      <p
        className={`text-body ${dark ? "text-amber" : "text-signature"}`}
        role="status"
      >
        Thank you — your note is in. I read these personally and will reply soon.
      </p>
    );
  }

  const labelCls = `block text-small font-medium ${dark ? "text-paper/80" : "text-ink/75"}`;
  const inputCls = `mt-2 w-full rounded-lg border px-4 py-3 text-body outline-none transition-colors duration-300 ease-calm ${
    dark
      ? "border-paper/20 bg-paper/5 text-paper placeholder:text-paper/35 focus:border-amber"
      : "border-ink/15 bg-paper text-ink placeholder:text-ink/35 focus:border-blue-lift"
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        className={`rounded-lg px-7 py-3.5 text-small font-medium transition-all duration-300 ease-calm ${
          dark
            ? "bg-amber text-ink hover:brightness-[0.97]"
            : "bg-signature text-paper hover:bg-blue-lift"
        }`}
      >
        {submitLabel}
      </button>
    </form>
  );
}
