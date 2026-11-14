import type { MetadataRoute } from 'next';
import { projectCases } from '@/content/project-cases';
import { SITE_URL } from '@/lib/site-url';
import { engineeringServices, servicePath } from '@/content/engineering-services';
import { websiteDesign } from '@/content/website-design';
import { blogPath, blogPosts, sortedBlogPosts } from '@/content/blog-posts';

const pages = ['/', '/blog', '/about', '/projects', '/services', '/agency-partners', '/contact', '/privacy', '/terms', websiteDesign.path];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls = pages.map((path) => ({ url: new URL(path, SITE_URL).toString() }));
  const projectUrls = projectCases.map((project) => ({ url: new URL(`/projects/${project.slug}`, SITE_URL).toString() }));
  const serviceUrls = engineeringServices.map(service => ({ url: new URL(servicePath(service.slug), SITE_URL).toString() }));
  const blogUrls = blogPosts.map(post => ({ url: new URL(blogPath(post.slug), SITE_URL).toString(), lastModified: post.updated ?? post.date }));
  // Only pages with a known edit date carry lastModified; Google ignores dates that are not reliable.
  const dated = new Map([['/blog', sortedBlogPosts()[0].updated ?? sortedBlogPosts()[0].date], ['/contact', '2026-11-14']]);
  const withDates = staticUrls.map(entry => { const path = new URL(entry.url).pathname; const lastModified = dated.get(path); return lastModified ? { ...entry, lastModified } : entry; });
  return [...withDates, ...projectUrls, ...serviceUrls, ...blogUrls];
}
