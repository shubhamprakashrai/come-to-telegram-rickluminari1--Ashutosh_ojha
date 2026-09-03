'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchEncryptedJson } from '@/lib/apiCrypto';
import { 
  ArrowLeft, Calendar, Clock, Share2, Check, Scale, 
  MessageSquare, ChevronRight, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  image_url?: string;
  created_at: string;
};

const FALLBACK_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'Navigating Commercial Arbitration & Dispute Resolution in India',
    slug: 'navigating-commercial-arbitration',
    category: 'Arbitration & ADR',
    excerpt: 'Key strategies, statutory timelines, and recent High Court precedents governing modern corporate arbitration.',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
    content: `Commercial arbitration in India has undergone significant evolution following recent legislative amendments and progressive judicial interpretations. This analysis highlights key procedural milestones, enforcement mechanisms under the Arbitration and Conciliation Act, and crucial considerations for corporate contracts.\n\n## Key Considerations\n- Precise drafting of arbitration clauses\n- Selecting appropriate arbitral seats and governing laws\n- Interim relief measures under Section 9 and Section 17\n\n> Parties entering commercial agreements must ensure unambiguous dispute escalation protocols to mitigate protracted litigation delays.`,
    author: 'Adv. Ashutosh Ojha',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Corporate Governance & Director Liability: Practical Safeguards',
    slug: 'corporate-governance-director-liability',
    category: 'Corporate Law',
    excerpt: 'An overview of fiduciary responsibilities, statutory compliance, and protecting corporate leadership from undue exposure.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    content: `With increasing regulatory scrutiny from authorities, understanding the nuances of board responsibilities is paramount for business leaders.\n\n## Core Fiduciary Duties\n- Duty of care and diligence\n- Avoidance of conflict of interest\n- Statutory filings under the Companies Act\n\n> Adopting proactive governance frameworks shields leadership while promoting sustainable enterprise growth.`,
    author: 'Adv. Ashutosh Ojha',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'High Court Writ Jurisdictions: Fundamental Rights & Relief',
    slug: 'high-court-writ-jurisdictions',
    category: 'Constitutional Law',
    excerpt: 'A practitioner guide on invoking Article 226 for speedy and effective judicial review against administrative overreach.',
    image_url: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=1200',
    content: `Article 226 of the Constitution of India provides High Courts with broad powers to issue prerogative writs for the enforcement of fundamental and statutory rights.\n\n## Common Prerogative Writs\n- **Mandamus**: Compelling statutory authorities to discharge duties\n- **Certiorari**: Quashing orders passed without lawful jurisdiction\n- **Prohibition**: Preventing inferior tribunals from exceeding powers\n\nEffective presentation of writ petitions requires sharp legal grounds and timely filing.`,
    author: 'Adv. Ashutosh Ojha',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Contractual Indemnity & Limitation of Liability Clauses',
    slug: 'contractual-indemnity-clauses',
    category: 'Corporate Law',
    excerpt: 'Drafting robust risk allocation clauses under the Indian Contract Act to avoid costly future disputes.',
    image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200',
    content: `Indemnity clauses are among the most heavily negotiated provisions in commercial contracts. This guide examines the distinction between Section 124 indemnity and common law damages, outlining optimal drafting structures for enterprise risk management.`,
    author: 'Adv. Ashutosh Ojha',
    created_at: new Date().toISOString(),
  },
];

export default function ArticleDetailClient() {
  const params = useParams();
  const rawParamSlug = params?.slug as string;
  const [currentSlug, setCurrentSlug] = useState<string>(rawParamSlug || '');

  const [article, setArticle] = useState<BlogPost | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>(FALLBACK_BLOGS);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && lastPart !== 'blogs') {
        setCurrentSlug(lastPart);
      } else if (rawParamSlug) {
        setCurrentSlug(rawParamSlug);
      }
    }
  }, [rawParamSlug]);

  useEffect(() => {
    async function loadArticle() {
      try {
        const data = await fetchEncryptedJson<BlogPost[]>('https://ashutosh-api.toonshala.com/api/blogs');
        const list = (data && data.length > 0) ? data : FALLBACK_BLOGS;
        setAllBlogs(list);

        // Find article by slug or id
        const targetSlug = currentSlug || rawParamSlug;
        const found = list.find(b => b.slug === targetSlug || b.id === targetSlug);
        if (found) {
          setArticle(found);
        } else if (list.length > 0) {
          setArticle(list[0]);
        }
      } catch (err) {
        console.error(err);
        const targetSlug = currentSlug || rawParamSlug;
        const found = FALLBACK_BLOGS.find(b => b.slug === targetSlug || b.id === targetSlug);
        setArticle(found || FALLBACK_BLOGS[0]);
      } finally {
        setLoading(false);
      }
    }
    if (currentSlug || rawParamSlug) {
      loadArticle();
    }
  }, [currentSlug, rawParamSlug]);


  useEffect(() => {
    if (article && typeof window !== 'undefined') {

      document.title = `${article.title} | Adv. Ashutosh Ojha`;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', article.excerpt);
      }

      // Dynamic Schema.org BlogPosting Injection
      const existingScript = document.getElementById('article-schema-jsonld');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'article-schema-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt,
        image: article.image_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
        author: {
          '@type': 'Person',
          name: article.author || 'Adv. Ashutosh Ojha',
          url: 'https://ashutoshojha.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Ashutosh Law Chambers',
          url: 'https://ashutoshojha.com',
        },
        datePublished: article.created_at,
        dateModified: article.created_at,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://ashutoshojha.com/blogs/${article.slug}`,
        },
      });
      document.head.appendChild(script);
    }
  }, [article]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined' && article) {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Check out this legal insight: "${article.title}" by Adv. Ashutosh Ojha - `);
      window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
    }
  };

  const renderContentFormatted = (content: string) => {
    const isHtml = /<[a-z][\s\S]*>/i.test(content);
    if (isHtml) {
      return (
        <div 
          className="text-gray-200 text-base sm:text-lg leading-relaxed space-y-6 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-white [&_h1]:my-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:my-5 [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-amber-400 [&_h3]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:pl-6 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote]:bg-amber-500/10 [&_blockquote]:rounded-r-2xl [&_blockquote]:my-6 [&_ul]:list-disc [&_ul]:pl-8 [&_ol]:list-decimal [&_ol]:pl-8 [&_a]:text-amber-400 [&_a]:underline [&_figure]:my-8 [&_img]:rounded-3xl [&_img]:border [&_img]:border-white/10 [&_img]:shadow-2xl [&_hr]:border-white/10 [&_hr]:my-8"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      );
    }

    const lines = content.split('\n');
    return (
      <div className="space-y-6 text-gray-200 text-base sm:text-lg leading-relaxed">
        {lines.map((line, i) => {
          if (line.startsWith('### ')) {
            return <h3 key={i} className="text-xl font-bold text-amber-400 mt-8 mb-3">{line.replace('### ', '')}</h3>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={i} className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-3">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('# ')) {
            return <h1 key={i} className="text-3xl sm:text-4xl font-extrabold text-white mt-8 mb-4">{line.replace('# ', '')}</h1>;
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote key={i} className="border-l-4 border-amber-500 pl-6 py-3 italic text-amber-200/90 bg-amber-500/10 rounded-r-2xl my-6">
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <li key={i} className="ml-6 list-disc text-gray-300">
                {line.replace(/^[-*]\s+/, '')}
              </li>
            );
          }
          const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
          if (imgMatch) {
            return (
              <div key={i} className="my-8 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full max-h-[500px] object-cover" />
                {imgMatch[1] && <p className="p-3 text-center text-xs text-gray-400 italic bg-slate-900/80">{imgMatch[1]}</p>}
              </div>
            );
          }
          if (!line.trim()) return <div key={i} className="h-3" />;
          return <p key={i}>{line}</p>;
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gray-400 text-sm">
        Loading legal analysis...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Article Not Found</h1>
        <p className="text-gray-400 mb-6 text-sm">The legal publication you requested could not be located.</p>
        <Link href="/blogs" className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition-all">
          Browse All Articles
        </Link>
      </div>
    );
  }

  const relatedBlogs = allBlogs.filter(b => b.slug !== article.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30">
      {/* Navigation Header */}
      <header className="border-b border-white/10 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/blogs" className="flex items-center space-x-2 text-gray-400 hover:text-amber-400 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>All Articles</span>
          </Link>

          <Link href="/" className="flex items-center space-x-2 text-white">
            <Scale className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-sm">Adv. Ashutosh Ojha</span>
          </Link>

          <Link
            href="/#contact"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20"
          >
            Consult Advocate
          </Link>
        </div>
      </header>

      {/* Main Article Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Breadcrumb & Meta */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <Link href="/blogs" className="hover:text-white">Blogs</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-amber-400 truncate max-w-xs">{article.category}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/25">
              {article.category}
            </span>
            <span className="text-gray-400 text-xs flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-gray-500" />
              {new Date(article.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="text-gray-400 text-xs flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-gray-500" />
              4 min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight pt-2">
            {article.title}
          </h1>

          {/* Author Byline */}
          <div className="flex items-center justify-between pt-4 pb-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                AO
              </div>
              <div>
                <p className="text-sm font-bold text-white">{article.author}</p>
                <p className="text-xs text-gray-400">Advocate &amp; Legal Consultant, High Court of Delhi</p>
              </div>
            </div>

            {/* Share Tools */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-gray-300 hover:text-white rounded-xl border border-white/10 transition-colors text-xs flex items-center"
                title="Copy shareable link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span className="ml-1.5 hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="p-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-xl border border-emerald-500/30 transition-colors"
                title="Share to WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Cover Banner */}
        {article.image_url && (
          <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-h-[460px]">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Executive Excerpt */}
        {article.excerpt && (
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-200/90 text-base sm:text-lg leading-relaxed italic">
            &ldquo;{article.excerpt}&rdquo;
          </div>
        )}

        {/* Formatted Article Body */}
        <article className="prose-invert max-w-none pt-2">
          {renderContentFormatted(article.content)}
        </article>

        {/* Author Bio Box */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl relative overflow-hidden mt-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-lg shadow-xl shrink-0">
                AO
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center">
                  Advocate Ashutosh Ojha
                  <ShieldCheck className="w-4 h-4 text-amber-400 ml-1.5" />
                </h3>
                <p className="text-xs text-gray-400 mt-1 max-w-md">
                  Practicing Advocate specializing in Commercial Litigation, Arbitration, Corporate Advisory, and High Court writ matters.
                </p>
              </div>
            </div>

            <Link
              href="/#contact"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 transition-all whitespace-nowrap"
            >
              Book Legal Consultation
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="pt-12 border-t border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white">More Legal Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedBlogs.map((b) => (
                <Link
                  key={b.slug}
                  href={`/blogs/${b.slug}`}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-amber-500/40 hover:bg-slate-900 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{b.category}</span>
                    <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {b.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{b.excerpt}</p>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 pt-4 flex items-center group-hover:underline">
                    Read Analysis <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
