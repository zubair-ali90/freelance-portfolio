export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .site-header,
        .site-footer {
          display: none !important;
        }
      `}</style>
      {children}
    </>
  );
}
