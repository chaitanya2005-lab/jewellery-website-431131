import { Award, ShieldCheck, HeartHandshake, History, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans" id="aboutpage-root">
      
      {/* 1. HERO HERITAGE HEADER */}
      <section className="relative py-20 bg-gold-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gold-950 via-gold-950/90 to-gold-950 z-10" />
        
        <div className="relative z-20 max-w-3xl mx-auto px-4">
          <span className="text-[10px] tracking-[0.4em] text-gold-300 font-semibold uppercase block mb-2">SINCE 1989</span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-widest text-gold-50 uppercase">
            Our Legacy
          </h1>
          <p className="font-sans text-xs md:text-sm text-gold-100/70 mt-4 leading-relaxed max-w-xl mx-auto font-light">
            Sculpting fine 22 Karat gold, certified GIA diamonds, and heritage temple masterpieces for royalty and modern families alike.
          </p>
        </div>
      </section>

      {/* 2. THE BRAND STORY */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-6 relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-gold-300 -z-10 translate-x-2 translate-y-2" />
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
              alt="Heritage Jewelry Crafting"
              className="w-full h-[400px] object-cover shadow-xl border border-gold-200"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gold-600" />
              <span className="font-sans text-[10px] text-gold-600 font-semibold tracking-widest uppercase">The Sovereign Chronicle</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold tracking-wide">
              Moulded with Dedication, Worn with Sovereignty
            </h2>
            <div className="h-0.5 w-16 bg-gold-400" />
            
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light">
              Founded in the historic town of Majalgaon, District Beed, Maharashtra, Uday Jewellers began as an elite boutique atelier dedicated to recreating traditional Maratha and South-Indian temple ornaments. Under the visionary guidance of our founder, Mr. Uday Shivaji Narwade, the house combined pure metallurgy with intricate gemstone setting techniques to establish a legacy of handcrafted divinity.
            </p>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light">
              Today, Uday Jewellers operates a magnificent flagship showroom in Majalgaon, Beed. We remain deeply rooted in our values—every product features an absolute weight and purity declaration, our diamonds are certified, and we offer complimentary lifetime refurbishing so your precious heirlooms never lose their initial divine radiance.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="border-l-2 border-gold-500 pl-4">
                <p className="font-serif text-2xl font-bold text-gold-950">35+</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Years of Divine Craft</p>
              </div>
              <div className="border-l-2 border-gold-500 pl-4">
                <p className="font-serif text-2xl font-bold text-gold-950">40,000+</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Verified Patrons Served</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. ARTISAN VALUES & ETHICS */}
      <section className="py-16 bg-gold-50/30 border-y border-gold-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="font-sans text-[10px] text-gold-600 font-semibold tracking-widest uppercase block mb-1">OUR THREE PILLARS</span>
            <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold uppercase tracking-wide">House Commitments</h2>
            <div className="h-0.5 w-16 bg-gold-400 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 border border-gold-100 flex flex-col items-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-gold-950 uppercase tracking-wide">Pure Karat Assurance</h3>
              <p className="text-xs text-gray-500 leading-relaxed mt-2.5 font-light">
                We only craft in certified 22 Karat (91.6% purity) or 18 Karat gold. Each ornament carries the Bureau of Indian Standards (BIS) Hallmarked stamp, verified by state testing facilities.
              </p>
            </div>

            <div className="bg-white p-8 border border-gold-100 flex flex-col items-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-gold-950 uppercase tracking-wide">Ethical Gem Sourcing</h3>
              <p className="text-xs text-gray-500 leading-relaxed mt-2.5 font-light">
                Our diamonds undergo double-stage quality certification by the Gemological Institute of America (GIA) and IGI. We strictly practice the Kimberley Process to ensure conflict-free diamonds.
              </p>
            </div>

            <div className="bg-white p-8 border border-gold-100 flex flex-col items-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-gold-950 uppercase tracking-wide">Refurbishing For Life</h3>
              <p className="text-xs text-gray-500 leading-relaxed mt-2.5 font-light">
                As a legacy brand, we stand by our creations. Return any Uday ornament to our Majalgaon flagship showroom for complimentary polishing, microscopic prong inspection, or direct exchange valuation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE CRAFTSMAN WORKSHOP */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span className="text-[10px] text-gold-600 font-semibold tracking-widest uppercase">THE ATELIER MANIFESTO</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold uppercase tracking-wide">The Hands That Shape Divinity</h2>
            <div className="h-0.5 w-16 bg-gold-400" />
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light mt-4">
              Behind every filigree loop, peacock carving, and bezel setting is a master artisan (Karigar). In our private workshop, these families practice generations-old metal smithing techniques, bringing antique sketches to life.
            </p>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light">
              We ensure our master Karigars operate in comfortable, safe, high-light environments and receive full medical coverage. Craftsmanship flourishes when the hands that shape beauty are respected and cherished.
            </p>
          </div>

          <div className="md:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
              alt="Hands of a Master Craftsman"
              className="w-full h-[320px] object-cover border border-gold-200 shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </section>

    </div>
  );
}
