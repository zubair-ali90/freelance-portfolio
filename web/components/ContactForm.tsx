"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="success" role="status">
        Message saved in this browser only. Hook this form to your Upwork invite or email when you
        are ready to take real jobs.
      </p>
    );
  }

  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
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
