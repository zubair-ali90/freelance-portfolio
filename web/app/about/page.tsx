export const metadata = { title: "About | Zubair" };

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">about</p>
          <h1>a one-person studio for pictures that have to move.</h1>
          <p>
            Zubair makes 3D and motion for product brands, apps, and small studios. The work on this
            site is dummy layout content so the design can be reviewed before real projects go in.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap reason-grid">
          <article className="reason">
            <h3>How jobs start</h3>
            <p>A short brief, two references, and the place the file will live. That is enough to price a first round.</p>
          </article>
          <article className="reason">
            <h3>How jobs finish</h3>
            <p>Preview stills, one revision pass on the approved frames, then final exports for web and a master file.</p>
          </article>
          <article className="reason">
            <h3>Where to hire</h3>
            <p>Upwork is the front door. Drop your profile URL into the footer when the account is ready.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
