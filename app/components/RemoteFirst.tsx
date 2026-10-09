const points = [
  "Direct communication with the engineers on your project",
  "Clear ownership, from architecture to operations",
  "Working hours that overlap with yours where needed",
];

/** The single remote-first section: an operating philosophy, not a service. */
export default function RemoteFirst() {
  return (
    <section id="remote" className="remote-section">
      <div className="section shell remote-grid">
        <div>
          <span className="eyebrow">06 / HOW WE’RE BUILT</span>
          <h2>
            Remote by design.
            <br />
            <span className="muted">Focused on engineering.</span>
          </h2>
        </div>
        <div className="remote-copy" data-reveal>
          <p className="remote-lead">
            We’re a distributed engineering team based in Kerala, India. Instead
            of spending on large offices and layers of management, we put the
            budget into engineering talent, infrastructure, tools, testing and
            product quality.
          </p>
          <ul>
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="remote-footprint">
            <strong>A lighter footprint, by design.</strong> Less daily commuting
            and less reliance on large offices means less unnecessary resource
            use.
          </p>
        </div>
      </div>
    </section>
  );
}
