"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!response.ok) {
      setError("Invalid username or password.");
      return;
    }
    const next = searchParams.get("next") || "/admin/dashboard";
    window.location.assign(next);
  }

  return (
    <form className="admin-login" onSubmit={onSubmit}>
      <h1>Admin sign in</h1>
      <p className="meta">Manage which projects appear on the public site.</p>
      <label>
        Username
        <input
          type="text"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <p className="admin-error">{error}</p>}
      <button type="submit" className="pill solid" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
