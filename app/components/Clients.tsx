import type { PortfolioProject } from "./Portfolio";
import type { TestimonialData } from "./Testimonials";
export default function Clients({
  projects,
  reviews,
}: {
  projects: PortfolioProject[] | null;
  reviews: TestimonialData[] | null;
}) {
  const names = Array.from(
    new Set(
      [
        ...(projects || []).map((p) => p.clientName?.trim()),
        ...(reviews || []).map((r) =>
          r.role.includes(",")
            ? r.role.split(",").slice(1).join(",").trim()
            : undefined,
        ),
      ].filter((name): name is string => !!name),
    ),
  );
  return (
    <section id="clients" className="clients-section">
      <div className="shell">
        <div className="clients-heading">
          <span className="eyebrow">OUR CLIENTS & COLLABORATORS</span>
          <h2>
            Different businesses.
            <br />
            The same commitment.
          </h2>
        </div>
        {names.length ? (
          <div className="client-wordmarks">
            {names.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        ) : (
          <div className="client-intro">
            <p>
              We partner with businesses around the world that want dependable
              software and real value for what they invest.
            </p>
            <div className="industry-list">
              <span>Retail & commerce</span>
              <span>Professional services</span>
              <span>Growing businesses</span>
            </div>
            <span className="client-note">
              Client highlights will be shared here with their permission.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
