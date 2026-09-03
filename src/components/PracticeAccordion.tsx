'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Scale, Home, Landmark, Building2, Users, FileSignature, Wallet, Shield, Award, BookOpen } from 'lucide-react';
import { fetchEncryptedJson } from '@/lib/apiCrypto';

type CategoryItem = {
  id: string;
  name: string;
  description?: string;
};

const DEFAULT_PRACTICES = [
  {
    name: "Civil & Commercial Litigation",
    description: "Expert representation in complex civil disputes and commercial matters before all major courts and tribunals."
  },
  {
    name: "Corporate & Business Law",
    description: "Comprehensive legal advisory for businesses including formations, compliance, and corporate governance."
  },
  {
    name: "Arbitration & ADR",
    description: "Strategic alternative dispute resolution, mediation, and domestic & international commercial arbitration."
  },
  {
    name: "Constitutional Law",
    description: "High Court and Supreme Court writ petitions, fundamental rights protection, and public interest litigation."
  },
  {
    name: "Property & Real Estate",
    description: "Diligent title verification, property disputes resolution, and real estate transaction structuring."
  },
  {
    name: "Banking & Insolvency (IBC)",
    description: "Insolvency and Bankruptcy Code proceedings, NCLT representation, and debt restructuring."
  }
];

const ICONS = [Scale, Building2, Gavel, Landmark, Shield, FileSignature, Wallet, Users, Award, BookOpen];

export default function PracticeAccordion() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchEncryptedJson<CategoryItem[]>('https://ashutosh-api.toonshala.com/api/categories');
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(DEFAULT_PRACTICES.map((p, i) => ({ id: `${i}`, ...p })));
        }
      } catch (e) {
        console.error('Failed to load categories', e);
        setCategories(DEFAULT_PRACTICES.map((p, i) => ({ id: `${i}`, ...p })));
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <section id="practice" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium tracking-wider mb-4 uppercase">
            <Gavel className="w-4 h-4 mr-2" />
            Areas of Expertise
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Practice Areas
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Specialized knowledge across multiple domains of law to serve diverse client needs with precision.
          </p>
        </motion.div>

        {loading ? (
          <div className="p-16 text-center text-gray-500 text-sm">Loading practice areas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((practice, index) => {
              const IconComponent = ICONS[index % ICONS.length];
              return (
                <motion.div
                  key={practice.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden cursor-pointer group min-h-[200px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="p-8 h-full flex flex-col justify-center relative z-10">
                    <motion.div 
                      className="flex items-center space-x-4 mb-3"
                      animate={{ y: hoveredIndex === index ? -6 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shrink-0">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {practice.name}
                      </h3>
                    </motion.div>

                    <AnimatePresence>
                      {hoveredIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: 10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-4 mt-2">
                            {practice.description || 'Specialized advisory and representation across this legal domain.'}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
