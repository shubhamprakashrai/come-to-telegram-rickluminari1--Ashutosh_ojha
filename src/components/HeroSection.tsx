'use client';
import { motion, Variants } from 'framer-motion';
import { FileText, Calendar, Award, BookOpen, Shield, Gavel } from 'lucide-react';

const achievements = [
  { icon: <Award className="w-8 h-8 text-amber-500" />, number: "7+", label: "Years Experience" },
  { icon: <Shield className="w-8 h-8 text-amber-500" />, number: "High", label: "Professional Standard" },
  { icon: <BookOpen className="w-8 h-8 text-amber-500" />, number: "Multiple", label: "Areas of Expertise" },
  { icon: <Gavel className="w-8 h-8 text-amber-500" />, number: "Ethics", label: "First" },
];

export default function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="pr-0 lg:pr-10"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block py-1 px-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium tracking-wider mb-6">
                LEGAL EXCELLENCE
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-white leading-tight tracking-tight">
                Ashutosh <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Ojha</span>
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-gray-300 font-light tracking-wide">
                Advocate & Legal Consultant
              </p>
              <div className="w-20 h-1 bg-amber-500 mb-8 rounded-full"></div>
              <p className="text-lg md:text-xl leading-relaxed text-gray-400 font-light max-w-xl">
                Providing comprehensive legal solutions with over seven years of experience in civil, real estate, and corporate litigation. Dedicated to a practical, solution-oriented approach.
              </p>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className="relative group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex justify-center mb-3 transform group-hover:-translate-y-1 transition-transform duration-300">
                    {achievement.icon}
                  </div>
                  <div className="text-center relative z-10">
                    <div className="text-2xl font-bold text-white mb-1">{achievement.number}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{achievement.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors flex items-center justify-center shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)]"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Get Legal Advice
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#practice"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors flex items-center justify-center group"
              >
                <FileText className="w-5 h-5 mr-3 text-amber-500 group-hover:text-amber-400 transition-colors" />
                Practice Areas
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right side is intentionally empty or contains a subtle glass card overlaying the 3D model */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="hidden lg:block relative"
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-sm ml-auto shadow-2xl">
              <div className="text-amber-400 mb-4">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Commitment to Justice</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every case is handled with utmost priority, ensuring that your rights are protected and justice is served. Ethical practice and client confidentiality are the cornerstones of my firm.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
