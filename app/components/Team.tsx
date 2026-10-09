import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { TeamMember } from "../lib/content";

export default function Team({ members }: { members: TeamMember[] }) {
  if (!members.length) return null;
  return (
    <section id="team" className="section shell team-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">07 / TEAM</span>
          <h2>
            Small enough that every project matters.
            <br />
            <span className="muted">Experienced enough to own production systems.</span>
          </h2>
        </div>
        <p>These are the people who will actually work on your product.</p>
      </div>
      <ul className="founder-list">
        {members.map((m) => (
          <li className="founder-card" key={m.id} data-reveal>
            {m.photo ? (
              <Image src={m.photo} alt="" width={56} height={56} className="avatar avatar-photo" />
            ) : (
              <span className="avatar" aria-hidden="true">
                {m.initials || m.name.charAt(0)}
              </span>
            )}
            <div>
              <strong>{m.name}</strong>
              {m.role && <span>{m.role}</span>}
              {m.focus && <em>{m.focus}</em>}
            </div>
            {m.linkedin && (
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${m.name} on LinkedIn`}
                className="founder-link"
              >
                LinkedIn <ArrowUpRight size={14} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
