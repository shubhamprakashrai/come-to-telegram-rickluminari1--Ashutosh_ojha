'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchEncryptedJson } from '@/lib/apiCrypto';
import { Search, BookOpen, Clock, Calendar, ArrowRight, X, User, Share2, Check, ArrowLeft, ChevronLeft, ChevronRight, Scale, PenTool } from 'lucide-react';
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

type CategoryItem = {
  id: string;
  name: string;
  description?: string;
};

const PAGE_SIZE = 6;

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [blogData, catData] = await Promise.all([
          fetchEncryptedJson<BlogPost[]>('https://ashutosh-api.toonshala.com/api/blogs'),
          fetchEncryptedJson<CategoryItem[]>('https://ashutosh-api.toonshala.com/api/categories')
        ]);
        setBlogs(blogData || []);
        if (catData && catData.length > 0) {
          setCategories(['All', ...catData.map(c => c.name)]);
        }
      } catch (err) {
        console.error('Failed to load data from API', err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);



  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory = selectedCategory === 'All' || blog.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.category.toLowerCase().includes(q) ||
        blog.content.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBlogs.slice(start, start + PAGE_SIZE);
  }, [filteredBlogs, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

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
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group">
            <Scale className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-lg text-white">Ashutosh Ojha</span>
            <span className="text-xs text-amber-400/80 font-mono hidden sm:inline">| Legal Insights</span>
          </Link>

          <Link
            href="/#contact"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20"
          >
            Consult Advocate
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge Library</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Legal Articles & Insights
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Comprehensive legal analysis, case law commentaries, and practical guidelines authored by Advocate Ashutosh Ojha.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by topic, ruling, case keyword, or category..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xl transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-none">
          {categories.map((cat) => (
            <button

              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-900 text-gray-400 hover:text-white hover:bg-slate-850 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading publications...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-xl font-bold text-white">No matching articles found</h3>
            <p className="text-gray-400 text-sm">Try modifying your search keywords or switching category filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2 bg-slate-900 border border-white/10 text-amber-400 rounded-xl text-xs font-bold hover:bg-white/5 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedBlogs.map((blog, idx) => (
                <motion.article
                  key={blog.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/40 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-xl relative h-full"
                  >
                    <div>
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
                        <div className="w-full h-24 bg-gradient-to-br from-amber-500/10 to-transparent p-6 flex items-center justify-between border-b border-white/5">
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

                        <h2 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-3 leading-snug">
                          {blog.title}
                        </h2>

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
                        Read Full Article <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-8 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  Showing {((currentPage - 1) * PAGE_SIZE) + 1}-
                  {Math.min(currentPage * PAGE_SIZE, filteredBlogs.length)} of {filteredBlogs.length} articles
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-xl bg-slate-900 border border-white/10 text-gray-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        currentPage === page
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                          : 'bg-slate-900 text-gray-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-xl bg-slate-900 border border-white/10 text-gray-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Article Reader Modal */}
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
    </div>
  );
}
