import type { MetadataRoute } from 'next';
import { fetchEncryptedJson } from '@/lib/apiCrypto';

export const dynamic = 'force-static';

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  created_at: string;
  published?: boolean;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ashutoshojha.com';
  
  // Base static routes that always exist
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

  // Fetch only REAL published blogs from live database
  try {
    const blogs = await fetchEncryptedJson<BlogPostItem[]>('https://ashutosh-api.toonshala.com/api/blogs');
    
    if (Array.isArray(blogs) && blogs.length > 0) {
      blogs.forEach((b) => {
        if (b.slug && (b.published !== false)) {
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
    console.error('Error fetching dynamic blogs for sitemap:', err);
  }

  return routes;
}
