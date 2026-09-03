'use client';
import { Scale, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900/50 backdrop-blur-xl border-t border-white/10 text-white py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-amber-500 mr-2" />
              <span className="text-xl font-bold text-white tracking-wide">Ashutosh Ojha</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Professional legal services with integrity, expertise, and dedication to client success. Operating from Noida and Kolkata.
            </p>
            <div className="flex space-x-4">
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-amber-400 transition-colors">About</a></li>
              <li><a href="#practice" className="hover:text-amber-400 transition-colors">Practice Areas</a></li>
              <li><a href="#knowledge" className="hover:text-amber-400 transition-colors">Knowledge Corner</a></li>
              <li><a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <Phone className="w-4 h-4 text-amber-500 mr-3 mt-0.5" />
                <span>+91 9415128663</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 text-amber-500 mr-3 mt-0.5" />
                <span>ashutosh.adv@outlook.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-amber-500 mr-3 mt-0.5" />
                <span>Noida & Kolkata</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Ashutosh Ojha. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed with precision.</p>
        </div>
      </div>
    </footer>
  );
}
