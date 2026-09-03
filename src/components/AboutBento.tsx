'use client';
import { motion } from 'framer-motion';
import { Award, CheckCircle, GraduationCap, Briefcase, Scale } from 'lucide-react';
import Image from 'next/image';

const credentials = [
  "LLB from Banaras Hindu University",
  "Member of State Bar Council",
  "Real Estate Law Specialization",
  "Corporate Law Specialization"
];

export default function AboutBento() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium tracking-wider mb-4 uppercase">
            <Award className="w-4 h-4 mr-2" />
            Professional Profile
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Ashutosh Ojha
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A relentless pursuit of justice, combined with a modern, strategic approach to complex legal challenges.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Main Portrait Box (Spans 2 rows) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-1 md:row-span-2 relative rounded-3xl overflow-hidden group shadow-2xl border border-white/10 bg-slate-900"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
            <Image 
              src="/images/about-portrait.jpeg" 
              alt="Ashutosh Ojha" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <h3 className="text-2xl font-bold text-white mb-2">Dedicated Advocate</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Fighting for client rights with integrity, transparency, and unwavering dedication in every single case.
              </p>
            </div>
          </motion.div>

          {/* Philosophy Box */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-colors flex flex-col justify-center relative overflow-hidden"
          >
            <Scale className="absolute -right-10 -bottom-10 w-64 h-64 text-amber-500/5 rotate-12" />
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">My Philosophy</h3>
            <p className="text-lg text-gray-300 leading-relaxed relative z-10">
              With over 7 years of dedicated practice, I believe in building lasting relationships through transparent communication and personalized attention. My goal is to provide strategic guidance that helps clients achieve their objectives while fiercely protecting their interests.
            </p>
          </motion.div>

          {/* Credentials Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-white/10 flex flex-col justify-center shadow-inner"
          >
            <div className="flex items-center mb-6">
              <GraduationCap className="w-8 h-8 text-amber-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Credentials</h3>
            </div>
            <ul className="space-y-4">
              {credentials.map((cred, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-amber-500 mr-3 shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm font-medium">{cred}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact CTA Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-amber-600 rounded-3xl p-8 flex flex-col justify-center items-center text-center hover:bg-amber-500 transition-colors cursor-pointer group"
          >
            <Briefcase className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl font-bold text-white mb-2">Need Representation?</h3>
            <p className="text-amber-100 mb-6 text-sm">Let's discuss your legal options.</p>
            <a href="#contact" className="bg-white text-amber-600 px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all w-full">
              Book Consultation
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
