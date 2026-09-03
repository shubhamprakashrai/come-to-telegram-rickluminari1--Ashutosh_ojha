import ArticleDetailClient from './ArticleDetailClient';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

const ARTICLES_META: Record<string, { title: string; desc: string; image: string }> = {
  'navigating-commercial-arbitration': {
    title: 'Navigating Commercial Arbitration & Dispute Resolution in India',
    desc: 'Key strategies, statutory timelines, and recent High Court precedents governing modern corporate arbitration.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
  },
  'corporate-governance-director-liability': {
    title: 'Corporate Governance & Director Liability: Practical Safeguards',
    desc: 'An overview of fiduciary responsibilities, statutory compliance, and protecting corporate leadership from undue exposure.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
  },
  'high-court-writ-jurisdictions': {
    title: 'High Court Writ Jurisdictions: Fundamental Rights & Relief',
    desc: 'A practitioner guide on invoking Article 226 for speedy and effective judicial review against administrative overreach.',
    image: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=1200',
  },
  'contractual-indemnity-clauses': {
    title: 'Contractual Indemnity & Limitation of Liability Clauses',
    desc: 'Drafting robust risk allocation clauses under the Indian Contract Act to avoid costly future disputes.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = ARTICLES_META[slug] || {
    title: 'Legal Analysis & Practice Guide',
    desc: 'In-depth legal commentary and practice guide by Advocate Ashutosh Ojha.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
  };

  const cleanTitle = `${meta.title} | Adv. Ashutosh Ojha`;

  return {
    title: cleanTitle,
    description: meta.desc,
    openGraph: {
      title: cleanTitle,
      description: meta.desc,
      url: `https://ashutoshojha.com/blogs/${slug}`,
      siteName: 'Advocate Ashutosh Ojha',
      type: 'article',
      images: [
        {
          url: meta.image,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: meta.desc,
      images: [meta.image],
    },
    alternates: {
      canonical: `https://ashutoshojha.com/blogs/${slug}`,
    },
  };
}

export function generateStaticParams() {
  return [
    { slug: 'navigating-commercial-arbitration' },
    { slug: 'corporate-governance-director-liability' },
    { slug: 'high-court-writ-jurisdictions' },
    { slug: 'contractual-indemnity-clauses' },
  ];
}

export default function ArticleDetailPage() {
  return <ArticleDetailClient />;
}
