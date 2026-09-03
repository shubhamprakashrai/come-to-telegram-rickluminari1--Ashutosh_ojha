'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchEncryptedJson } from '@/lib/apiCrypto';
import { BookOpen, Clock, Calendar, ArrowRight, X, User, Share2, Check, PenTool } from 'lucide-react';
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
];

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>(FALLBACK_BLOGS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await fetchEncryptedJson<BlogPost[]>('https://ashutosh-api.toonshala.com/api/blogs');
        if (data && data.length > 0) {
          setBlogs(data);
        }
      } catch (err) {
        console.log('Using curated legal articles fallback', err);
      }
    }
    loadBlogs();
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderContentFormatted = (content: string) => {
    // Check if content is HTML from the visual editor
    const isHtml = /<[a-z][\s\S]*>/i.test(content);
    if (isHtml) {
      return (
        <div 
          className="text-gray-200 text-sm sm:text-base leading-relaxed space-y-4 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-white [&_h1]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:my-3 [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-amber-400 [&_h3]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:bg-amber-500/10 [&_blockquote]:rounded-r-xl [&_blockquote]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-amber-400 [&_a]:underline [&_figure]:my-6 [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10 [&_img]:shadow-xl [&_hr]:border-white/10 [&_hr]:my-6"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      );
    }

    const lines = content.split('\n');
    return (
      <div className="space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed">
        {lines.map((line, i) => {
          if (line.startsWith('### ')) {
            return <h3 key={i} className="text-lg font-bold text-amber-400 mt-6 mb-2">{line.replace('### ', '')}</h3>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={i} className="text-xl sm:text-2xl font-bold text-white mt-6 mb-3 border-b border-white/10 pb-2">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('# ')) {
            return <h1 key={i} className="text-2xl sm:text-3xl font-bold text-white mt-6 mb-3">{line.replace('# ', '')}</h1>;
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote key={i} className="border-l-4 border-amber-500 pl-4 py-2 italic text-amber-200/90 bg-amber-500/10 rounded-r-xl my-4">
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <li key={i} className="ml-5 list-disc text-gray-300">
                {line.replace(/^[-*]\s+/, '')}
              </li>
            );
          }
          const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
          if (imgMatch) {
            return (
              <div key={i} className="my-6 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-slate-950">
                <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full max-h-[420px] object-cover" />
                {imgMatch[1] && <p className="p-2.5 text-center text-xs text-gray-400 italic bg-slate-900/80">{imgMatch[1]}</p>}
              </div>
            );
          }
          if (!line.trim()) return <div key={i} className="h-2" />;
          return <p key={i}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <section id="knowledge" className="py-24 relative overflow-hidden bg-slate-950/60 border-t border-white/5">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Knowledge Corner</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Legal Insights &amp; Perspectives
            </h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl">
              Thought leadership, legal commentary, and practical breakdowns on Indian law and court rulings.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 md:mt-0"
          >
            <Link
              href="/blogs"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/40 text-white text-sm font-semibold hover:bg-amber-500/10 transition-all group shadow-lg"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4 ml-2 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog, index) => (
            <motion.div
              key={blog.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedPost(blog)}
              className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/40 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-xl relative"
            >
              <div>
                {/* Card Cover Image */}
                {blog.image_url ? (
                  <div className="w-full h-48 overflow-hidden relative border-b border-white/10">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                    <span className="absolute bottom-3 left-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-400 text-xs font-semibold border border-amber-500/30">
                      {blog.category}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-28 bg-gradient-to-br from-amber-500/10 to-transparent p-6 flex items-center justify-between border-b border-white/5">
                    <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                      {blog.category}
                    </span>
                    <PenTool className="w-5 h-5 text-amber-400/40" />
                  </div>
                )}

                <div className="p-7">
                  <div className="flex items-center text-xs text-gray-400 mb-3 space-x-3">
                    <span className="flex items-center text-gray-500">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      3 min read
                    </span>
                    <span>•</span>
                    <span className="text-gray-500">
                      {new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-3 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-7 pt-0 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                    AO
                  </div>
                  <span>{blog.author}</span>
                </div>

                <span className="text-amber-400 font-semibold flex items-center group-hover:underline">
                  Read Article <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Article Reader Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-3xl max-h-[88vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-5">
                <div className="flex items-center space-x-3 text-xs">
                  <span className="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/20">
                    {selectedPost.category}
                  </span>
                  <span className="text-gray-400 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(selectedPost.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-gray-400 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1" />
                    {selectedPost.author}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {selectedPost.title}
                </h1>

                {selectedPost.image_url && (
                  <div className="rounded-2xl overflow-hidden border border-white/10 max-h-80 my-4 shadow-xl">
                    <img src={selectedPost.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-amber-200/90 text-sm italic">
                  {selectedPost.excerpt}
                </div>

                <div className="pt-4 border-t border-white/5">
                  {renderContentFormatted(selectedPost.content)}
                </div>

                <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={handleShare}
                    className="flex items-center text-xs font-medium text-amber-400 hover:underline"
                  >
                    {copied ? <Check className="w-4 h-4 mr-1 text-emerald-400" /> : <Share2 className="w-4 h-4 mr-1" />}
                    {copied ? 'Link Copied!' : 'Share Article'}
                  </button>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors"
                  >
                    Close Reader
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
