import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldCheck, Sparkles, MessageCircleCode } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'Bespoke Diamond Inquiries',
    message: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'Bespoke Diamond Inquiries',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans" id="contactpage-root">
      
      {/* 1. HERO DESCRIPTION */}
      <section className="relative py-20 bg-gold-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gold-950 via-gold-950/95 to-gold-950 z-10" />

        <div className="relative z-20 max-w-3xl mx-auto px-4">
          <span className="text-[10px] tracking-[0.4em] text-gold-300 font-semibold uppercase block mb-2">CONCIERGE SERVICES</span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-widest text-gold-50 uppercase">
            Contact Curator
          </h1>
          <p className="font-sans text-xs md:text-sm text-gold-100/70 mt-4 leading-relaxed max-w-xl mx-auto font-light">
            Do you require assistance matching diamond weight tiers or validating custom temple sketches? Speak directly with our lead curator or boutique support.
          </p>
        </div>
      </section>

      {/* 2. CONTACT FORM AND DETAIL LAYOUT */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Panel: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-gold-200 p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif text-lg md:text-xl text-gold-950 font-bold uppercase tracking-wide">Write Private Dispatch</h2>
            </div>
            
            {isSuccess ? (
              <div className="p-8 text-center bg-gold-50 border border-gold-300">
                <Sparkles className="w-8 h-8 text-gold-600 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-gold-900 uppercase">Dispatch Received</h3>
                <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  Your private inquiry has been logged securely. A customer representative from Uday Jewellers will connect within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gaekwad"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Patron Email</label>
                    <input
                      type="email"
                      required
                      placeholder="patron@gmail.com"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 99999 88888"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Inquiry Subject</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:border-gold-500"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="Bespoke Diamond Inquiries">Bespoke Diamond Inquiries</option>
                    <option value="Gold Bullion Exchange rate">Gold Bullion Exchange rates</option>
                    <option value="Store Appointment VIP Access">Store Appointment VIP Access</option>
                    <option value="Heirloom Repair Status">Heirloom Repair & Refurbishing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Your Message</label>
                  <textarea
                    required
                    placeholder="Share specific details about weights, sizes, gemstone counts, or legacy design styles..."
                    className="w-full px-3 py-2 border border-gray-300 h-28 resize-none focus:outline-none focus:border-gold-500"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold-950 text-white font-serif tracking-widest text-xs uppercase hover:bg-gold-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Curator Dispatch</span>
                </button>

              </form>
            )}
          </div>

          {/* Right Panel: Concierge Coordinates */}
          <div className="lg:col-span-5 space-y-6 text-xs text-gray-600">
            <div className="bg-gold-50/50 border border-gold-300 p-6 md:p-8 space-y-6">
              <h3 className="font-serif text-base font-bold text-gold-950 uppercase tracking-wide">Privé Coordinates</h3>
              <div className="h-px w-12 bg-gold-400" />

              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-gold-700 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 uppercase tracking-wider text-[10px]">Flagship Showroom</p>
                    <p className="mt-1 leading-relaxed">
                      Bajaj Complex, Samarth Nagar,<br />
                      Shivaji Chowk, Majalgaon - 431131,<br />
                      District Beed, Maharashtra, India.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-gold-700 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 uppercase tracking-wider text-[10px]">Showroom Helplines</p>
                    <p className="mt-1">+91 75587 95959</p>
                    <p className="mt-0.5">+91 73877 08866</p>
                    <p className="text-gray-400 mt-1">Daily: 10:00 AM - 09:00 PM</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-gold-700 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 uppercase tracking-wider text-[10px]">Business Email</p>
                    <p className="mt-1">info@udayjewellers.com</p>
                    <p className="text-gray-400 mt-0.5">Replies within 2 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
              <MessageCircleCode className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold uppercase tracking-wider text-[10px]">24/7 WhatsApp concierge</h4>
                <p className="mt-0.5 leading-relaxed">
                  Need rapid pricing on current gold rates or bridal consultation? Chat directly with a support agent at <strong>+91 75587 95959</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SHOWROOM MAP & OWNER DETAILS */}
      <section className="py-12 bg-neutral-50 border-t border-gold-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase">PATRON TRUST & LEADERSHIP</span>
            <h3 className="font-serif text-2xl text-gold-950 font-bold uppercase tracking-wide">Uday Jewellers</h3>
            <div className="h-0.5 w-12 bg-gold-400" />
            
            <div className="space-y-2 text-xs text-gray-600 font-light">
              <p><strong className="text-gray-900 font-semibold">Owner & Founder:</strong></p>
              <p className="text-sm text-gold-900 font-serif font-semibold">Mr. Uday Shivaji Narwade</p>
              <p className="pt-2 leading-relaxed">Under the active leadership of Mr. Uday Shivaji Narwade, our Majalgaon flagship ensures certified gold purity, premium artisan craftsmanship, and completely transparent business ethics across all legacy designs.</p>
            </div>
            
            <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
              <p><strong>Store Timings:</strong> 10:00 AM - 09:00 PM (Daily)</p>
              <p><strong>Direct Helplines:</strong> +91 75587 95959 / +91 73877 08866</p>
            </div>
          </div>
          
          <div className="lg:col-span-8 bg-white p-2 border border-gold-300 shadow-lg h-[350px] relative overflow-hidden" id="google-maps-section">
            <iframe
              src="https://maps.google.com/maps?q=Uday%20Jewellers,%20Bajaj%20Complex,%20Samarth%20Nagar,%20Shivaji%20Chowk,%20Majalgaon%20Maharashtra&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen={true}
              aria-hidden="false"
              tabIndex={0}
              title="Uday Jewellers Majalgaon Showroom Map"
              id="google-maps-iframe"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
