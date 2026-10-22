import type { MetadataRoute } from 'next';
import { projectCases } from '@/content/project-cases';
import { SITE_URL } from '@/lib/site-url';

const pages = ['/', '/about', '/projects', '/agency-partners', '/contact', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls = pages.map((path) => ({ url: new URL(path, SITE_URL).toString() }));
  const projectUrls = projectCases.map((project) => ({ url: new URL(`/projects/${project.slug}`, SITE_URL).toString() }));
  return [...staticUrls, ...projectUrls];
}
