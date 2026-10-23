import type { ContentRow } from '@/lib/content';
import { clientLogo } from '@/lib/client-logos';
import { initials, pad, safeImage, safeUrl } from '@/lib/urls';
import { ChatIcon } from './icons';
import { Marquee } from './marquee';

export function Services({ rows }: { rows: ContentRow[] }) {
  return <section className="section site-container" id="services"><div className="section-heading"><div><p className="eyebrow">02 / WHAT WE DO</p><h2>Built around what<br />your business needs.</h2></div><p>Practical engineering for the things<br />your business needs to build, improve,<br />and grow.</p></div>
    <div className="services-grid">{rows.map((row, i) => <article className="service" key={row.id}>
      <span className="service-number">{pad(i + 1)}</span><div className="service-copy"><span className="service-kicker">{row.kicker}</span><h3>{row.title}</h3></div><p>{row.description}</p>
      <a className="service-link" href="#contact" aria-label={`Discuss ${row.title}`}>Discuss your project <span aria-hidden="true"><ChatIcon /></span></a>
    </article>)}</div>
  </section>;
}

export function Portfolio({ rows }: { rows: ContentRow[] }) {
  return <section className="portfolio-section" id="portfolio" aria-labelledby="portfolio-title"><div className="site-container portfolio-layout grid text-left">
    <div className="portfolio-heading"><p className="eyebrow">06 / PORTFOLIO</p><h2 id="portfolio-title">Selected <span className="serif">work.</span></h2><p>Real businesses.<br /> Software built around them.</p></div>
    <div className="portfolio-grid">{rows.map((row, i) => <article className="folio-item project-row" key={row.id} aria-labelledby={`folio-title-${row.id}`}>
      <span className="project-index" aria-hidden="true">{pad(i + 1)}</span>
      <div className="project-copy"><p className="project-category">{row.category}</p><h3 id={`folio-title-${row.id}`}>{row.title}</h3><p className="project-summary">{row.description}</p></div>
      <div className={`project-thumbnail${safeImage(row.image_url) ? '' : ' project-thumbnail-empty'}`}>{safeImage(row.image_url)
        ? <img src={safeImage(row.image_url)} alt={row.image_alt || ''} width={1536} height={1024} loading="lazy" decoding="async" />
        : <span aria-hidden="true">{initials(row.title)}</span>}</div>
    </article>)}</div>
  </div></section>;
}

export function Clients({ rows }: { rows: ContentRow[] }) {
  return <section className="clients-section" id="clients" aria-labelledby="clients-title"><div className="site-container">
    <div className="clients-heading"><div><p className="eyebrow">OUR CLIENTS</p><h2 id="clients-title">People we build with.</h2></div></div>
    <Marquee kind="client">{rows.length ? rows.map(row => {
      const logo = clientLogo(row.name, row.logo_url); const url = safeUrl(row.website_url);
      const content = logo ? <img src={logo} alt={row.name} loading="lazy" decoding="async" /> : <span>{row.name}</span>;
      return url ? <a className="client-logo" key={row.id} href={url} target="_blank" rel="noopener noreferrer">{content}</a> : <div className="client-logo" key={row.id}>{content}</div>;
    }) : null}</Marquee>
  </div></section>;
}

export function Testimonials({ rows }: { rows: ContentRow[] }) {
  return <section className="testimonials section" id="testimonials"><div className="site-container">
    <div className="section-heading"><div><p className="eyebrow">08 / WHAT OUR CLIENTS SAY</p><h2>Their experience.<br />In their own words.</h2></div>{!rows.length && <p>Client feedback will appear here<br />once it’s ready to share.</p>}</div>
    <Marquee kind="testimonial">{rows.length ? rows.map(row => <article className="testimonial-card" key={row.id}>
      <span className="quote-mark" aria-hidden="true">“</span><p className="whitespace-pre-line">{row.quote}</p>
      <div className="testimonial-person">{safeImage(row.avatar_url) ? <img className="testimonial-avatar" src={safeImage(row.avatar_url)} alt="" loading="lazy" decoding="async" /> : <span className="avatar-placeholder testimonial-initials" aria-hidden="true">{initials(row.author_name)}</span>}<div><span>{row.author_name}</span><small>{[row.author_role, row.company].filter(Boolean).join(', ')}</small></div></div>
    </article>) : [1, 2, 3].map(id => <article className="testimonial-card" key={id}><span className="quote-mark" aria-hidden="true">“</span><span className="section-status">TESTIMONIAL COMING SOON</span><p>This space is reserved for feedback from a Silicon Motives client.</p><div className="testimonial-person"><span className="avatar-placeholder" aria-hidden="true" /><div><span>Client name</span><small>Role &amp; company</small></div></div></article>)}</Marquee>
  </div></section>;
}

export function Faqs({ rows }: { rows: ContentRow[] }) {
  return <section className="section site-container faq-section" id="faq"><div><p className="eyebrow">08 / FREQUENTLY ASKED QUESTIONS</p><h2>Before we<br />get started.</h2></div><div className="faqs">{rows.map(row => <details key={row.id}><summary>{row.question}<span aria-hidden="true">+</span></summary><p className="whitespace-pre-line">{row.answer}</p></details>)}</div></section>;
}
