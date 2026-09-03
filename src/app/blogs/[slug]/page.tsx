import ArticleDetailClient from './ArticleDetailClient';

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
