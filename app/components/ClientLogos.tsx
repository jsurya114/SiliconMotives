import Image from "next/image";
import type { Client } from "../lib/content";

/** Companies cleared for public display. Hidden when there are none. */
export default function ClientLogos({ clients }: { clients: Client[] }) {
  if (!clients.length) return null;
  return (
    <section className="clients-strip" aria-labelledby="clients-heading">
      <div className="shell clients-inner">
        <h2 id="clients-heading" className="mono">
          COMPANIES WE’VE WORKED WITH
        </h2>
        <ul className="client-list">
          {clients.map((c) => {
            const content = c.logo ? (
              <Image src={c.logo} alt={c.name} width={160} height={48} className="client-logo" />
            ) : (
              <span className="client-name">{c.name}</span>
            );
            return (
              <li key={c.id}>
                {c.website ? (
                  <a href={c.website} target="_blank" rel="noopener noreferrer" title={c.name}>
                    {content}
                  </a>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
