'use client';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Calendar, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query_type: '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://ashutosh-api.toonshala.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', query_type: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium tracking-wider mb-4 uppercase">
            <Phone className="w-4 h-4 mr-2" />
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contact Me
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Info (Left Side) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <div className="flex items-start">
                <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0 mr-6">
                  <Phone className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Phone</h4>
                  <p className="text-gray-300">+91 9415128663</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <div className="flex items-start">
                <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0 mr-6">
                  <Mail className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Email</h4>
                  <p className="text-gray-300">ashutosh.adv@outlook.com</p>
                  <p className="text-gray-300 mt-1">solicitiorsworkshop@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <div className="flex items-start">
                <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0 mr-6">
                  <MapPin className="w-7 h-7 text-amber-500" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Noida Office</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">Office No. 1610, Tower A, 16th Floor, Spectrum Metro Mall, Phase-1, Sector 75, Noida - 201301.</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Kolkata Office</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">10, Kiran Shankar Roy Road, B.B.D Bagh, Kolkata - 700001.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form (Right Side) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-7"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <h3 className="text-3xl font-bold mb-8 text-white">Do you have any legal query?</h3>
              
              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder=" "
                      className="block w-full px-4 pt-6 pb-2 text-white bg-white/5 border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-amber-500 peer transition-colors"
                    />
                    <label htmlFor="name" className="pointer-events-none absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-amber-500">Your Name</label>
                  </div>
                  
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=" "
                      className="block w-full px-4 pt-6 pb-2 text-white bg-white/5 border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-amber-500 peer transition-colors"
                    />
                    <label htmlFor="email" className="pointer-events-none absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-amber-500">Your Email</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder=" "
                      className="block w-full px-4 pt-6 pb-2 text-white bg-white/5 border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-amber-500 peer transition-colors"
                    />
                    <label htmlFor="phone" className="pointer-events-none absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-amber-500">Your Phone</label>
                  </div>
                  
                  <div className="relative group">
                    <select 
                      id="query_type"
                      required
                      value={formData.query_type}
                      onChange={handleChange}
                      className="block w-full px-4 pt-6 pb-2 text-white bg-white/5 border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-amber-500 transition-colors"
                    >
                      <option value="" className="bg-slate-900 text-gray-400">Select Query Type</option>
                      <option value="civil" className="bg-slate-900">Get Support</option>
                      <option value="corporate" className="bg-slate-900">Guidance</option>
                      <option value="documentation" className="bg-slate-900">Find Solutions</option>
                      <option value="consultation" className="bg-slate-900">Discuss Options</option>
                    </select>
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder=" "
                    className="block w-full px-4 pt-6 pb-2 text-white bg-white/5 border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-amber-500 peer transition-colors resize-none"
                  ></textarea>
                  <label htmlFor="message" className="pointer-events-none absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-amber-500">Describe your legal query in detail</label>
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-sm">Failed to send message. Please try again later.</p>
                )}
                
                {status === 'success' && (
                  <p className="text-emerald-400 text-sm flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Your message has been sent successfully. We will get back to you soon!
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-500/20 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Sent Successfully
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Send Message
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center">
                  <Clock className="w-3 h-3 mr-1" />
                  All consultations are confidential and protected by attorney-client privilege.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
