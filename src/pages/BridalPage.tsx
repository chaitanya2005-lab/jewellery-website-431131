import { Sparkles, Calendar, Award, Phone, CheckCircle, Gift, Heart } from 'lucide-react';

interface BridalPageProps {
  onOpenAppointment: () => void;
}

const bridalCollections = [
  {
    title: 'The Royal Nizam Sangeet Set',
    desc: 'Extravagant layered necklace and matching jhumkas featuring authentic uncut Basra pearls and emerald beads set in heavy 22K yellow gold.',
    purity: '22K Antique Hallmark',
    weight: '118.5 grams',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Sublime Devangana Temple Choker',
    desc: 'Hand-chiseled Lord Lakshmi motifs surrounded by intricate filigree detailing and south-sea pearl drop strands.',
    purity: '22K Traditional Temple',
    weight: '84.2 grams',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Celestial Empress Diamond Tiara & Set',
    desc: 'Crafted in 18K white gold, suspending exquisite pear-cut diamonds creating a crown-like cascade.',
    purity: '18K White Gold, VVS Diamond',
    weight: '64.0 grams (4.80 CT)',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600'
  }
];

export default function BridalPage({ onOpenAppointment }: BridalPageProps) {
  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans" id="bridalpage-root">
      
      {/* 1. HERO BANNER */}
      <section className="relative py-24 bg-gold-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gold-950/90 to-gold-950 z-10" />

        <div className="relative z-20 max-w-4xl mx-auto px-4">
          <span className="text-xs tracking-[0.4em] text-gold-300 font-semibold uppercase block mb-3">THE BRIDAL ATELIER</span>
          <h1 className="font-serif text-4xl md:text-6xl font-extrabold tracking-widest text-gold-50 uppercase leading-none">
            Auspicious Trousseaus
          </h1>
          <p className="font-sans text-xs md:text-sm text-gold-100/70 mt-4 leading-relaxed max-w-2xl mx-auto font-light">
            Every Indian bride deserves to feel like a queen. Explore our handcarved, heavy wedding masterpieces designed to carry heritage blessings on your holy day.
          </p>
          <button
            onClick={onOpenAppointment}
            className="mt-8 px-8 py-3.5 bg-gold-900 hover:bg-gold-800 text-white font-serif text-xs tracking-widest uppercase transition-all shadow-xl border border-gold-600 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-gold-300 animate-spin" />
            <span>Book Private Trousseau Styling</span>
          </button>
        </div>
      </section>

      {/* 2. THE THREE STAGES OF THE BRIDAL CONSULTATION */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="font-sans text-[10px] text-gold-600 font-semibold tracking-widest uppercase block mb-1">PRIVÉ ATELIER ADVANTAGE</span>
          <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold uppercase tracking-wide">The Royal Styling Process</h2>
          <div className="h-0.5 w-16 bg-gold-400 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-gold-100 p-6 text-center bg-gold-50/20">
            <div className="w-10 h-10 rounded-full bg-gold-900 text-white flex items-center justify-center font-serif text-sm font-bold mx-auto mb-4 border border-gold-400">01</div>
            <h3 className="font-serif text-base font-bold text-gold-950 uppercase tracking-wider">Garment Silhouette Matching</h3>
            <p className="text-xs text-gray-500 mt-2 font-light leading-relaxed">
              Bring your bridal lehenga or saree fabrics. Our personal relationship managers study necklines, fabric weights, and thread works to match corresponding necklaces perfectly.
            </p>
          </div>

          <div className="border border-gold-100 p-6 text-center bg-gold-50/20">
            <div className="w-10 h-10 rounded-full bg-gold-900 text-white flex items-center justify-center font-serif text-sm font-bold mx-auto mb-4 border border-gold-400">02</div>
            <h3 className="font-serif text-base font-bold text-gold-950 uppercase tracking-wider">Metrological Customization</h3>
            <p className="text-xs text-gray-500 mt-2 font-light leading-relaxed">
              Modify drop-bead gem options, choose between antique red gold or bright yellow gold polishes, and custom size chokers or bangles for snug, comfortable wearing all day.
            </p>
          </div>

          <div className="border border-gold-100 p-6 text-center bg-gold-50/20">
            <div className="w-10 h-10 rounded-full bg-gold-900 text-white flex items-center justify-center font-serif text-sm font-bold mx-auto mb-4 border border-gold-400">03</div>
            <h3 className="font-serif text-base font-bold text-gold-950 uppercase tracking-wider">Secure Hand Delivery</h3>
            <p className="text-xs text-gray-500 mt-2 font-light leading-relaxed">
              We dispatch your finished wedding jewelry via a private courier, directly hand-delivered with specialized double signature verification, fully insured from our vault to yours.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE REELS */}
      <section className="py-16 bg-gold-50/30 border-y border-gold-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="font-sans text-[10px] text-gold-600 font-semibold tracking-widest uppercase block mb-1">SIGNATURE MASTERWORKS</span>
            <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold uppercase tracking-wide">Bridal Catalog Highlights</h2>
            <div className="h-0.5 w-16 bg-gold-400 mx-auto mt-3" />
          </div>

          <div className="space-y-12">
            {bridalCollections.map((set, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Image */}
                <div className={`md:col-span-6 relative ${idx % 2 === 1 ? 'md:order-last' : ''}`}>
                  <div className="absolute inset-0 border border-gold-400 translate-x-2 translate-y-2 -z-10" />
                  <img
                    src={set.image}
                    alt={set.title}
                    className="w-full h-[320px] object-cover border border-gold-200 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="md:col-span-6 space-y-4">
                  <span className="text-[10px] bg-gold-900 text-white px-2.5 py-0.5 uppercase tracking-widest font-semibold border border-gold-400 font-sans">
                    {set.purity}
                  </span>
                  <h3 className="font-serif text-2xl text-gold-950 font-bold tracking-wide">{set.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light">{set.desc}</p>
                  
                  <div className="p-3 bg-white border border-gold-100 flex justify-between text-xs text-gray-500 font-mono">
                    <span>Approx Metal Weight:</span>
                    <strong className="text-gold-900">{set.weight}</strong>
                  </div>

                  <button
                    onClick={onOpenAppointment}
                    className="px-5 py-2.5 bg-gold-950 text-white font-serif text-xs tracking-widest uppercase hover:bg-gold-800 transition-colors inline-flex items-center gap-2"
                  >
                    <span>Request Quotation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BRIDAL INCENTIVES BANNERS */}
      <section className="py-16 max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 md:p-12 bg-gold-950 text-white border border-gold-400 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <Sparkles className="w-8 h-8 text-gold-300 mx-auto mb-4 animate-spin" />
          <h3 className="font-serif text-2xl md:text-3xl text-gold-100 font-bold tracking-wide uppercase">The Heirloom Shield</h3>
          <p className="text-xs text-gold-200/70 max-w-xl mx-auto leading-relaxed mt-2 font-light">
            Every Bridal ornament booked before August 2026 includes complimentary premium lacquer packing, custom name engraving on velvet boxes, and zero waste-deduction charge policies on legacy gold exchange.
          </p>

          <div className="flex justify-center gap-4 mt-8 flex-col sm:flex-row">
            <button
              onClick={onOpenAppointment}
              className="px-6 py-3 bg-gold-900 text-white font-serif text-xs tracking-widest uppercase hover:bg-gold-800 border border-gold-400 font-bold transition-all"
            >
              Secure Styling Slot
            </button>
            <a
              href="https://wa.me/919876543210?text=Hello%20Uday%20Jewellers,%20I%20am%20interested%20in%20arranging%20a%20bridal%20trousseau%20appointment."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-gold-950 font-serif text-xs tracking-widest uppercase hover:bg-gold-50 font-bold transition-all border border-gold-300"
            >
              Consult via WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
