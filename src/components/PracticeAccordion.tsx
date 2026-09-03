'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Scale, Home, Landmark, Building2, Users, FileSignature, Wallet } from 'lucide-react';

const practices = [
  {
    title: "Civil & Commercial Litigation",
    icon: <Scale className="w-6 h-6" />,
    description: "Expert representation in complex civil disputes and commercial matters before all major courts and tribunals."
  },
  {
    title: "Corporate & Business Law",
    icon: <Building2 className="w-6 h-6" />,
    description: "Comprehensive legal advisory for businesses including formations, compliance, and corporate governance."
  },
  {
    title: "Property & Real Estate",
    icon: <Home className="w-6 h-6" />,
    description: "Diligent title verification, property disputes resolution, and real estate transaction structuring."
  },
  {
    title: "Contract Law & Agreements",
    icon: <FileSignature className="w-6 h-6" />,
    description: "Drafting, reviewing, and enforcing complex commercial agreements to protect your interests."
  },
  {
    title: "Family Law Matters",
    icon: <Users className="w-6 h-6" />,
    description: "Sensitive and confidential handling of matrimonial disputes, divorce, and custody proceedings."
  },
  {
    title: "Banking & Finance Law",
    icon: <Wallet className="w-6 h-6" />,
    description: "Navigating complex financial regulations, loan agreements, and debt recovery tribunals."
  }
];

export default function PracticeAccordion() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practices.map((practice, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden cursor-pointer group h-[200px]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-8 h-full flex flex-col justify-center relative z-10">
                <motion.div 
                  className="flex items-center space-x-4 mb-4"
                  animate={{ y: hoveredIndex === index ? -10 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                    {practice.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {practice.title}
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
                        {practice.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
