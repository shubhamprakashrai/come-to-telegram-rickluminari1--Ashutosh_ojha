'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, CheckCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DisclaimerModal() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isManuallyOpened, setIsManuallyOpened] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Exclude admin pages
    if (pathname && pathname.startsWith('/admin')) {
      setShowDisclaimer(false);
      return;
    }

    // Show on every page load
    setShowDisclaimer(true);
    document.body.style.overflow = 'hidden';

    const handleOpen = () => {
      setIsManuallyOpened(true);
      setShowDisclaimer(true);
      document.body.style.overflow = 'hidden';
    };

    window.addEventListener('openDisclaimer', handleOpen);
    return () => window.removeEventListener('openDisclaimer', handleOpen);
  }, [pathname]);

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
    setIsManuallyOpened(false);
    document.body.style.overflow = 'auto';
  };

  const handleClose = () => {
    setShowDisclaimer(false);
    setIsManuallyOpened(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <AnimatePresence>
      {showDisclaimer && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col relative"
          >
            {/* Glowing Orb */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Header */}
            <div className="bg-slate-900/50 backdrop-blur-sm border-b border-white/5 px-6 py-5 flex items-center justify-between relative z-10">
              <div className="flex items-center">
                <Scale className="w-8 h-8 text-amber-500 mr-3 shrink-0" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">LEGAL DISCLAIMER</h2>
                  <p className="text-amber-400 text-xs uppercase tracking-widest mt-0.5">Bar Council of India Rules</p>
                </div>
              </div>

              {isManuallyOpened && (
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 text-gray-300 custom-scrollbar relative z-10">
              <p className="text-gray-300 leading-relaxed font-medium">
                As per the rules of the Bar Council of India, Advocates are not permitted to solicit work or advertise, either directly or indirectly. By accessing this website, the user acknowledges that:
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "No Advertisement or Solicitation",
                    desc: "The contents of this website are for informational and knowledge-sharing purposes only and do not constitute any form of advertisement, solicitation, or inducement of any nature whatsoever."
                  },
                  {
                    title: "No Legal Advice",
                    desc: "The information provided is not intended to be legal advice. Visitors are advised not to act or refrain from acting on the basis of any content without seeking appropriate legal advice from a qualified professional."
                  },
                  {
                    title: "No Attorney–Client Relationship",
                    desc: "Accessing, browsing, or using this website does not create an Advocate–Client relationship between the visitor and the Advocate."
                  },
                  {
                    title: "User-Initiated Access",
                    desc: "The user confirms that they are accessing this website on their own initiative for gaining knowledge and information about the law."
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-5 border-l-4 border-amber-500 hover:bg-white/10 transition-colors">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 shrink-0">{index + 1}</span>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 ml-9 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-slate-900/80 backdrop-blur-md px-6 py-5 border-t border-white/5 relative z-10">
              <p className="text-xs text-gray-400 text-center mb-4">
                By proceeding further, you acknowledge that you have read, understood, and agreed to this disclaimer.
              </p>
              <button
                onClick={handleAcceptDisclaimer}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-0.5 flex items-center justify-center group"
              >
                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                I Agree & Accept
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
