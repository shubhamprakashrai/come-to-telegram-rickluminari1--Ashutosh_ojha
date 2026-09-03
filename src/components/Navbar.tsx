'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Menu, X } from 'lucide-react';
import LinkedInIcon from '@/components/LinkedInIcon';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Practice Areas', href: '#practice' },
    { name: 'Knowledge Corner', href: '#knowledge' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center group cursor-pointer">
            <motion.div 
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Scale className="w-8 h-8 text-amber-500 mr-2" />
            </motion.div>
            <span className="text-xl font-bold text-white tracking-wide">Ashutosh Ojha</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="relative text-gray-300 hover:text-white text-sm font-medium transition-colors group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <a
              href="https://www.linkedin.com/in/ashutoshojha15/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-amber-400 p-2 rounded-full hover:bg-white/5 transition-colors"
              title="Connect on LinkedIn"
            >
              <LinkedInIcon className="w-5 h-5 text-[#0A66C2] hover:brightness-125" />
            </a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact" 
              className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(217,119,6,0.5)]"
            >
              Contact Me
            </motion.a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        initial={false}
        animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10"
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-300 hover:text-amber-400 px-3 py-2 text-base font-medium"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact" 
            onClick={() => setIsMenuOpen(false)}
            className="block text-amber-500 font-semibold px-3 py-2 text-base"
          >
            Contact
          </a>
        </div>
      </motion.div>
    </motion.nav>
  );
}
