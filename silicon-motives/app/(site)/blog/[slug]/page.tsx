import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MarketingPage } from '@/components/site/marketing-page';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowUpRight } from '@/components/ui/icons';
import { blogPath, blogPosts, formatPostDate, getBlogPost } from '@/content/blog-posts';
import { pageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site-url';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return blogPosts.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return { title: 'Article not found | SiliconMotives' };
  const base = pageMetadata(post.title, post.description, blogPath(post.slug));
  return { ...base, openGraph: { ...base.openGraph, type: 'article', publishedTime: post.date, modifiedTime: post.updated ?? post.date } as Metadata['openGraph'] };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const url = `${SITE_URL}${blogPath(post.slug)}`;
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'BlogPosting', '@id': `${url}#article`, headline: post.headline, description: post.description, url, mainEntityOfPage: url, datePublished: post.date, dateModified: post.updated ?? post.date, inLanguage: 'en', image: `${SITE_URL}/brand/social/siliconmotives-og-navy.png`, author: { '@id': `${SITE_URL}/#organization` }, publisher: { '@id': `${SITE_URL}/#organization` } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.headline, item: url },
      ] },
    ],
  };
  return <MarketingPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <div className="wrap"><nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate"><Link className="inline-flex min-h-11 items-center" href="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">{post.category}</span></nav></div>
    <header className="wrap pt-6 pb-10 sm:pb-12">
      <p className="label text-lagoon-ink">{post.category} · {formatPostDate(post.date)} · {post.readingMinutes} min read</p>
      <h1 className="display t-h1 mt-5 max-w-5xl">{post.headline}</h1>
      <p className="mt-7 max-w-3xl text-[1.1875rem] leading-[1.65] text-slate">{post.intro}</p>
    </header>
    <article>
      {post.sections.map(section => <section key={section.heading} className="wrap border-t border-ink/15 py-10 sm:py-14">
        <h2 className="display t-h3">{section.heading}</h2>
        <div className="mt-6 max-w-3xl space-y-5 text-[1.0625rem] leading-[1.7] text-slate">
          {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.list && <ul className="list-disc space-y-3 pl-5">{section.list.map(item => <li key={item}>{item}</li>)}</ul>}
        </div>
      </section>)}
    </article>
    <section className="wrap border-t border-ink/15 py-10 sm:py-14">
      <h2 className="display t-h3">Related pages.</h2>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1">{post.related.map(link => <Link key={link.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold" href={link.href}><span className="link-line">{link.label}</span><ArrowUpRight /></Link>)}</div>
    </section>
    <section data-header="light" className="bg-lagoon py-10 sm:py-14"><div className="wrap flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center"><div><p className="label">Next step</p><h2 className="display t-h2 mt-4">Talk to us.</h2><p className="mt-4 max-w-2xl text-base leading-7">{post.cta.text}</p></div><ButtonLink href={post.cta.href}>{post.cta.label}</ButtonLink></div></section>
  </MarketingPage>;
}
