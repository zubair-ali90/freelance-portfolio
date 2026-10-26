import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "Contact | Zubair" };

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">contact</p>
          <h1>tell me the frame you need.</h1>
          <p>Use this while the site is local. It does not email anyone yet.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
