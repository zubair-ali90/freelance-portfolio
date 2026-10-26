export default function AdminSecureLoading() {
  return (
    <div className="admin-panel" aria-busy="true" aria-live="polite">
      <p className="meta">Loading…</p>
    </div>
  );
}
