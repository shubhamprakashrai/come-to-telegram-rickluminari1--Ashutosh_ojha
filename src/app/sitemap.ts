import type { MetadataRoute } from 'next';
import { fetchEncryptedJson } from '@/lib/apiCrypto';

export const dynamic = 'force-static';

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  created_at: string;
}

const DEFAULT_SLUGS = [
  'navigating-commercial-arbitration',
  'corporate-governance-director-liability',
  'high-court-writ-jurisdictions',
  'contractual-indemnity-clauses',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ashutoshojha.com';
  
  // Base static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const addedSlugs = new Set<string>();

  // Add default core publication routes
  DEFAULT_SLUGS.forEach((slug) => {
    addedSlugs.add(slug);
    routes.push({
      url: `${baseUrl}/blogs/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  // Fetch all dynamically published blogs from backend database
  try {
    const blogs = await fetchEncryptedJson<BlogPostItem[]>('https://ashutosh-api.toonshala.com/api/blogs');
    
    if (Array.isArray(blogs)) {
      blogs.forEach((b) => {
        if (b.slug && !addedSlugs.has(b.slug)) {
          addedSlugs.add(b.slug);
          routes.push({
            url: `${baseUrl}/blogs/${b.slug}`,
            lastModified: b.created_at ? new Date(b.created_at) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
          });
        }
      });
    }
  } catch (err) {
    console.error('Error fetching blogs for sitemap generation:', err);
  }

  return routes;
}
