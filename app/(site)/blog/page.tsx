import Link from 'next/link';
import { MarketingPage, PageIntro } from '@/components/site/marketing-page';
import { ArrowUpRight } from '@/components/ui/icons';
import { blogPath, formatPostDate, sortedBlogPosts } from '@/content/blog-posts';
import { pageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site-url';

export const metadata = pageMetadata(
  'Blog: Web, Software & DevOps Guides | SiliconMotives',
  'Practical guides on website design, custom software, AWS and working with a remote engineering partner, written by the SiliconMotives team in Kochi, Kerala.',
  '/blog',
);

export default function BlogIndexPage() {
  const posts = sortedBlogPosts();
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Blog', '@id': `${SITE_URL}/blog#blog`, name: 'SiliconMotives Blog', url: `${SITE_URL}/blog`, publisher: { '@id': `${SITE_URL}/#organization` }, blogPost: posts.map(post => ({ '@type': 'BlogPosting', headline: post.headline, url: `${SITE_URL}${blogPath(post.slug)}`, datePublished: post.date })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      ] },
    ],
  };
  return <MarketingPage>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <PageIntro eyebrow="Blog" title="Practical guides for businesses and agencies.">
      <p>Plain-language notes on website design, custom software, cloud infrastructure and working with a remote engineering partner.</p>
    </PageIntro>
    <section className="wrap border-t border-ink/15 py-10 sm:py-14">
      <ul className="divide-y divide-ink/15 border-y border-ink/15">
        {posts.map(post => <li key={post.slug}>
          <article className="grid gap-4 py-8 lg:grid-cols-[1fr_2fr] lg:gap-10">
            <p className="label text-lagoon-ink">{post.category}<span className="block pt-2 normal-case text-slate">{formatPostDate(post.date)} · {post.readingMinutes} min read</span></p>
            <div>
              <h2 className="display t-h3"><Link href={blogPath(post.slug)}>{post.headline}</Link></h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate">{post.description}</p>
              <Link href={blogPath(post.slug)} className="mt-4 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold">Read the guide <ArrowUpRight /></Link>
            </div>
          </article>
        </li>)}
      </ul>
    </section>
  </MarketingPage>;
}
