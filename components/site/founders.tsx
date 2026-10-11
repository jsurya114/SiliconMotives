import type { ContentRow } from '@/lib/content';
import { initials, safeImage, pad } from '@/lib/urls';
export function Founders({rows}: {rows: ContentRow[]}) { return (<section className="about section" id="about" aria-labelledby="founders-title"><div className="site-container about-grid"><div className="about-copy"><p className="eyebrow">09 / THE PEOPLE BEHIND THE PURPOSE</p><h2 id="founders-title">Built by people.<br /> Driven by a shared <span className="serif">motive.</span></h2><p>Silicon Motives was founded by Jayasoorya S and Jasil M in Kochi, Kerala, with a simple idea: build an efficient engineering company where location doesn’t determine quality.</p><p>We’re shaping a team that values ownership, honest conversations, and pride in the product. A company where clients pay for engineering value, and where good people have the space to do meaningful work.</p><div className="about-signoff"><span className="eyebrow">INDEPENDENT BY DESIGN</span><span className="about-signoff-rule" aria-hidden="true"></span></div></div>
<div className="founders" aria-label="Founders">{rows.map((row, i) => {
 const founder = /^jasil m$/i.test(row.name.trim()) ? 'jasil' : /^jayasoorya s$/i.test(row.name.trim()) ? 'jayasoorya' : '';
 const defaultPhoto = founder ? `/images/${founder}.jpg` : '';
 const photo = safeImage(row.photo_url || defaultPhoto);
 const profile = /jasil/i.test(row.name) ? 'https://www.linkedin.com/in/jasilmeledath/' : /jayasoorya/i.test(row.name) ? 'https://www.linkedin.com/in/jayasoorya-suryadas/' : '';
 return <article key={row.id} className={`founder ${i === 0 ? 'founder-featured' : 'founder-secondary'}`}>
  <div className={`initials ${i % 2 ? 'initials-jayasoorya' : ''}${photo ? ' founder-portrait' : ''}${photo && photo === defaultPhoto ? ` founder-portrait-${founder}` : ''}`} aria-hidden="true">{photo ? <img src={photo} alt="" loading="lazy" decoding="async" /> : initials(row.name)}</div>
  <div className="founder-meta"><span className="founder-kicker">{row.kicker || `TEAM ${pad(i + 1)}`}</span><h3>{row.name}</h3><p>{row.role}</p>{profile && <a className="founder-linkedin" href={profile} target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a>}</div><span className="founder-index" aria-hidden="true">{pad(i + 1)}</span>
 </article>;
})}<p className="founder-note"><span className="location-dot" aria-hidden="true">◎</span> From Kochi, with a shared ambition.</p></div></div></section>); }
