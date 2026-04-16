import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../UI/Logo';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0b1221] text-gray-400 py-16 px-6 lg:px-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Column 1: Logo & About */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Logo variant="footer" className="scale-[0.6] origin-left" containerClassName="items-start" />
              <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
              <img src="/saylani_logo.webp" alt="Saylani Logo" className="h-6 md:h-7 object-contain" />
            </div>
            <p className="text-[13px] md:text-sm leading-relaxed max-w-sm">
              Saylani Mass IT Training (SMIT) is dedicated to providing free, high-quality technology education to the youth of Pakistan. Build your future today.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/saylani.smit" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-[#1877F2] p-2.5 rounded-xl transition-all duration-300 group">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.linkedin.com/company/saylanimassit/" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-[#0A66C2] p-2.5 rounded-xl transition-all duration-300 group">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://www.instagram.com/saylani.smit/" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-[#E4405F] p-2.5 rounded-xl transition-all duration-300 group">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Popular Courses */}
          <div className="space-y-6">
            <h3 className="text-[#8DC63F] text-lg font-bold">Popular Courses</h3>
            <ul className="space-y-4">
              <li><Link to="/courses" className="hover:text-white transition-colors flex items-center group"><span className="w-0 group-hover:w-2 h-0.5 bg-brand-500 mr-0 group-hover:mr-2 transition-all"></span>Web & Mobile Development</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors flex items-center group"><span className="w-0 group-hover:w-2 h-0.5 bg-brand-500 mr-0 group-hover:mr-2 transition-all"></span>Artificial Intelligence</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors flex items-center group"><span className="w-0 group-hover:w-2 h-0.5 bg-brand-500 mr-0 group-hover:mr-2 transition-all"></span>Graphic Designing</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors flex items-center group"><span className="w-0 group-hover:w-2 h-0.5 bg-brand-500 mr-0 group-hover:mr-2 transition-all"></span>Blockchain</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors flex items-center group"><span className="w-0 group-hover:w-2 h-0.5 bg-brand-500 mr-0 group-hover:mr-2 transition-all"></span>Cloud Computing</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-[#8DC63F] text-lg font-bold">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="hover:text-white transition-colors flex items-center group"><span className="w-0 group-hover:w-2 h-0.5 bg-brand-500 mr-0 group-hover:mr-2 transition-all"></span>Home</Link></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center group"><span className="w-0 group-hover:w-2 h-0.5 bg-brand-500 mr-0 group-hover:mr-2 transition-all"></span>About Saylani</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center group"><span className="w-0 group-hover:w-2 h-0.5 bg-brand-500 mr-0 group-hover:mr-2 transition-all"></span>Campuses</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center group"><span className="w-0 group-hover:w-2 h-0.5 bg-brand-500 mr-0 group-hover:mr-2 transition-all"></span>Check Result</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center group"><span className="w-0 group-hover:w-2 h-0.5 bg-brand-500 mr-0 group-hover:mr-2 transition-all"></span>Contact Support</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-6">
            <h3 className="text-[#8DC63F] text-lg font-bold">Contact Info</h3>
            <ul className="space-y-5">
              <li className="flex items-start space-x-4">
                <div className="bg-white/5 p-2 rounded-lg mt-0.5">
                  <MapPin size={18} className="text-[#8DC63F]" />
                </div>
                <span className="text-sm md:text-base">Head Office: A-25, Bahadurabad Chowrangi, Karachi</span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="bg-white/5 p-2 rounded-lg">
                  <Phone size={18} className="text-[#8DC63F]" />
                </div>
                <span className="text-sm md:text-base">UAN: 111-729-5264</span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="bg-white/5 p-2 rounded-lg">
                  <Mail size={18} className="text-[#8DC63F]" />
                </div>
                <span className="text-sm md:text-base">support@saylanimit.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-500">
          <p>© 2026 Saylani Mass IT Training. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
