import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareCode, ShieldCheck, Award, HeartHandshake, CheckCircle } from 'lucide-react';

interface FooterProps {
  onNav: (page: string) => void;
  onOpenAppointment: () => void;
}

export default function Footer({ onNav, onOpenAppointment }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gold-950 text-gold-100/80 font-sans border-t-2 border-gold-400 relative" id="brand-footer">
      
      {/* 1. BRAND TRUST ASSURANCE BAR */}
      <div className="bg-gold-900 border-b border-gold-800 text-gold-100 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3.5">
            <ShieldCheck className="w-8 h-8 text-gold-300 flex-shrink-0" />
            <div>
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider">100% Secure & Certified</h4>
              <p className="text-xs text-gold-200/70 mt-0.5">Every ornament carries a hallmark certification (BIS 916 & GIA Solitaires).</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3.5 border-y md:border-y-0 md:border-x border-gold-800 py-4 md:py-0 md:px-6">
            <Award className="w-8 h-8 text-gold-300 flex-shrink-0" />
            <div>
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider">Artisanal Transparency</h4>
              <p className="text-xs text-gold-200/70 mt-0.5">Clear breakdown of gold weights, gemstone counts, and standard crafting costs.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3.5">
            <HeartHandshake className="w-8 h-8 text-gold-300 flex-shrink-0" />
            <div>
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider">Uday Privé Care</h4>
              <p className="text-xs text-gold-200/70 mt-0.5">Complimentary lifetime repair, gold polishing, and buyback valuation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER COLUMNS */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8">
        
        {/* Brand Legacy column */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="font-serif text-lg font-extrabold tracking-widest text-white uppercase">UDAY JEWELLERS</h3>
          <p className="text-xs leading-relaxed text-gold-100/70 max-w-sm">
            Estd 1989 in Majalgaon, Beed. Sculpting magnificent gold ornaments, certified flawless diamonds, and heritage temple masterpieces that serve as sacred heirlooms across generations.
          </p>
          <div className="space-y-3.5 text-xs pt-2">
            <div className="flex items-start gap-2 text-gold-100/90">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <span>
                Bajaj Complex, Samarth Nagar,<br />
                Shivaji Chowk, Majalgaon - 431131,<br />
                District Beed, Maharashtra, India
              </span>
            </div>
            <div className="flex items-start gap-2 text-gold-100/90">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <p>+91 75587 95959</p>
                <p>+91 73877 08866</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gold-100/90">
              <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>info@udayjewellers.com</span>
            </div>
          </div>
        </div>

        {/* Quick Nav links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-serif text-xs font-bold text-white uppercase tracking-widest border-b border-gold-900 pb-1.5">Collections</h4>
          <ul className="space-y-1.5 text-xs">
            <li><button onClick={() => onNav('products')} className="hover:text-gold-300 transition-colors">Gold Ornaments</button></li>
            <li><button onClick={() => onNav('products')} className="hover:text-gold-300 transition-colors">Solitaire Diamonds</button></li>
            <li><button onClick={() => onNav('bridal')} className="hover:text-gold-300 transition-colors">Bridal Wear</button></li>
            <li><button onClick={() => onNav('products')} className="hover:text-gold-300 transition-colors">Temple Heritage</button></li>
            <li><button onClick={() => onNav('products')} className="hover:text-gold-300 transition-colors">Modern Silverware</button></li>
          </ul>
        </div>

        {/* Quick Nav links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-serif text-xs font-bold text-white uppercase tracking-widest border-b border-gold-900 pb-1.5">The House</h4>
          <ul className="space-y-1.5 text-xs">
            <li><button onClick={() => onNav('about')} className="hover:text-gold-300 transition-colors">Our Heritage</button></li>
            <li><button onClick={() => onNav('custom')} className="hover:text-gold-300 transition-colors">Bespoke Design</button></li>
            <li><button onClick={() => onNav('stores')} className="hover:text-gold-300 transition-colors">Boutiques</button></li>
            <li><button onClick={onOpenAppointment} className="hover:text-gold-300 transition-colors text-gold-300 font-medium">Book VIP Viewing</button></li>
            <li><button onClick={() => onNav('contact')} className="hover:text-gold-300 transition-colors">Contact Curator</button></li>
          </ul>
        </div>

        {/* Newsletter Subscription column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-serif text-xs font-bold text-white uppercase tracking-widest border-b border-gold-900 pb-1.5">Newsletter Dispatch</h4>
          <p className="text-xs text-gold-100/70 leading-relaxed">
            Register your email to receive bespoke previews of private collections, high-fashion catalog releases, and private bullion rates.
          </p>

          {isSubscribed ? (
            <div className="p-3 bg-gold-900/40 border border-gold-500 flex items-center gap-2 text-xs text-gold-300">
              <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>Welcome to Uday Privé circular list.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex border border-gold-700 font-sans" id="newsletter-form">
              <input
                type="email"
                required
                placeholder="Enter email for private updates"
                className="bg-gold-950/20 px-3 py-2 text-xs text-white placeholder-gold-300/40 outline-none flex-1 font-light"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gold-800 hover:bg-gold-700 text-white p-2.5 px-4 transition-colors flex items-center justify-center border-l border-gold-700"
                id="newsletter-submit"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Luxury logos placeholder lines */}
          <div className="pt-2 flex items-center gap-3 opacity-60">
            <span className="text-[10px] font-serif border border-gold-800 px-2 py-0.5 tracking-widest">GIA</span>
            <span className="text-[10px] font-serif border border-gold-800 px-2 py-0.5 tracking-widest">BIS 916</span>
            <span className="text-[10px] font-serif border border-gold-800 px-2 py-0.5 tracking-widest">IGI</span>
          </div>
        </div>

      </div>

      {/* 3. BASE COPYRIGHT BAR */}
      <div className="border-t border-gold-900 bg-gold-950/80 py-6 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gold-300/50 font-sans">
          <p>© {new Date().getFullYear()} Uday Jewellers Private Limited. All Sacred Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-gold-300">Privacy Policy</a>
            <span>|</span>
            <a href="#terms" className="hover:text-gold-300">Terms of Service</a>
            <span>|</span>
            <a href="#sitemap" className="hover:text-gold-300">Sitemap</a>
          </div>
        </div>
      </div>

      {/* FLOATING WHATSAPP CHAT BUTTON */}
      <a
        href="https://wa.me/917558795959?text=Hello%20Uday%20Jewellers,%20I%20am%20exploring%20your%20luxury%20collections."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 text-white p-3.5 rounded-full hover:bg-emerald-600 shadow-2xl hover:scale-110 transition-all flex items-center justify-center border border-emerald-400 group"
        title="Chat on WhatsApp"
        id="floating-whatsapp"
      >
        <MessageSquareCode className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        <span className="absolute right-full mr-2 bg-white text-emerald-800 font-sans font-semibold text-xs py-1 px-3 border border-emerald-100 shadow-xl rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Live Assistant Online
        </span>
      </a>

    </footer>
  );
}
