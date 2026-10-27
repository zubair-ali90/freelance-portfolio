"use client";

import { useState } from "react";

export function ContactForm({
  successMessage = "Message saved in this browser only. Hook this form to your Upwork invite or email when you are ready to take real jobs.",
  errorMessage = "Could not save your message. Please try again.",
}: {
  successMessage?: string;
  errorMessage?: string;
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (sent) {
    return (
      <p className="success" role="status">
        {successMessage}
      </p>
    );
  }

  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
        try {
          setError("");
          setSent(true);
        } catch {
          setError(errorMessage);
        }
      }}
    >
      {error && <p className="admin-error">{error}</p>}
      <label>
        Name
        <input name="name" required placeholder="Your name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required placeholder="you@company.com" />
      </label>
      <label>
        What do you need?
        <select name="need" defaultValue="Product film">
          <option>Product film</option>
          <option>Character or mascot</option>
          <option>Interior or environment</option>
          <option>Explainer</option>
          <option>Not sure yet</option>
        </select>
      </label>
      <label>
        Project note
        <textarea name="note" rows={5} required placeholder="Timeline, references, and where it will be used." />
      </label>
      <button className="pill solid" type="submit">
        send note
      </button>
    </form>
  );
}
