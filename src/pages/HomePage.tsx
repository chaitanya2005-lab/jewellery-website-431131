import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Quote, Instagram, Sparkles, ChevronLeft, ChevronRight, Gift, Percent, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { categoriesList, collectionsList } from '../data/products';
import ProductCard from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  wishlist: Product[];
  onWishlistToggle: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onOpenAppointment: () => void;
  onNav: (page: string) => void;
}

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600',
    subtitle: 'THE BRIDAL SAGA',
    title: 'Divine Temple Trousseaus',
    desc: 'Intricately handcrafted masterpieces in 22 Karat gold, embedded with authentic Kundan and uncut gemstones.'
  },
  {
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1600',
    subtitle: 'THE DIAMOND STANDARD',
    title: 'Celestial Brilliance Solitaires',
    desc: 'Flawless certified diamonds shaped with mathematical precision into magnificent, timeless halo ring settings.'
  },
  {
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1600',
    subtitle: 'THE MODERN LUXE',
    title: 'Sleek Sovereign Bracelets',
    desc: 'Clean geometric lines in pure Platinum and Rose Gold for the cosmopolitan jewelry connoisseur.'
  }
];

const testimonials = [
  {
    name: 'Princess Radhika Gaekwad',
    city: 'Baroda',
    rating: 5,
    quote: "Uday Jewellers has crafted my family's wedding ornaments for two decades. The absolute detail on our custom Peacock chokers was a marvel that left the entire ceremony mesmerized. Standard beyond compare."
  },
  {
    name: 'Meera Rajput Sen',
    city: 'Majalgaon',
    rating: 5,
    quote: "Purchasing certified solitaire diamonds online can be daunting, but Uday's secure hand-delivered courier and GIA certificate integrations made it completely flawless. The sparkle is breathtaking."
  },
  {
    name: 'Anjali Hegde',
    city: 'Beed',
    rating: 5,
    quote: "I visited the Majalgaon Flagship Showroom for a private bridal styling consultation. The personal attention, luxury environment, and bespoke sketches we created left me feeling like absolute royalty."
  }
];

const instagramGrid = [
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1611085583191-a3b1a111c1fc?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400'
];

export default function HomePage({
  products,
  wishlist,
  onWishlistToggle,
  onAddToCart,
  onViewDetails,
  onOpenAppointment,
  onNav
}: HomePageProps) {
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setSlideIdx((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setSlideIdx((prev) => (prev + 1) % heroSlides.length);
  };

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const trending = products.filter(p => p.isTrending).slice(0, 4);

  return (
    <div className="bg-white min-h-screen text-gray-800" id="homepage-root">
      
      {/* 1. HERO BANNER SLIDESHOW */}
      <section className="relative h-[65vh] md:h-[80vh] overflow-hidden" id="hero-slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background image */}
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={heroSlides[slideIdx].image}
              alt="Luxury Jewellery Slide"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Content text */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto text-white">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-sans text-[11px] md:text-xs font-semibold tracking-[0.4em] text-gold-300 uppercase mb-3"
              >
                {heroSlides[slideIdx].subtitle}
              </motion.span>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide text-gold-50 mb-4"
              >
                {heroSlides[slideIdx].title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="font-sans text-xs md:text-sm text-gray-200/90 max-w-xl leading-relaxed mb-8"
              >
                {heroSlides[slideIdx].desc}
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => onNav('products')}
                  className="px-8 py-3 bg-gold-900 hover:bg-gold-800 text-white font-serif text-xs tracking-widest uppercase transition-all shadow-lg border border-gold-600 flex items-center justify-center gap-2"
                >
                  <span>Explore Masterpieces</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenAppointment}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white font-serif text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 backdrop-blur-xs"
                >
                  <Sparkles className="w-4 h-4 text-gold-300" />
                  <span>Reserve VIP Styling</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 border border-white/20 bg-black/25 hover:bg-gold-900/40 text-white hover:border-gold-300 transition-colors"
          id="prev-slide-btn"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 border border-white/20 bg-black/25 hover:bg-gold-900/40 text-white hover:border-gold-300 transition-colors"
          id="next-slide-btn"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="py-16 max-w-7xl mx-auto px-4 text-center" id="shop-by-category">
        <div className="mb-10">
          <span className="font-sans text-[10px] md:text-xs text-gold-600 font-semibold tracking-[0.3em] uppercase block mb-1">DIVINE PROFILES</span>
          <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold tracking-wide uppercase">Shop by Category</h2>
          <div className="h-0.5 w-16 bg-gold-400 mx-auto mt-3" />
        </div>

        {/* Horizontal Category List */}
        <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-thin scrollbar-thumb-gold-400 scroll-smooth pr-4 text-center">
          {categoriesList.slice(1).map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                // Navigate to products and pre-filter
                localStorage.setItem('uday_filter_category', cat.name);
                onNav('products');
              }}
              className="flex-shrink-0 flex flex-col items-center group cursor-pointer w-24 md:w-28"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-gray-100 p-1 group-hover:border-gold-400 transition-all duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-gold-950/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-sans text-[11px] md:text-xs font-semibold text-gold-950 mt-3 group-hover:text-gold-600 transition-colors tracking-wide truncate max-w-full">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS (BENTO ASYMMETRIC GRID) */}
      <section className="py-16 bg-gold-50/30 border-y border-gold-100" id="featured-collections">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="font-sans text-[10px] md:text-xs text-gold-600 font-semibold tracking-[0.3em] uppercase block mb-1">CURATED EMBELLISHMENTS</span>
            <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold tracking-wide uppercase">Featured Collections</h2>
            <div className="h-0.5 w-16 bg-gold-400 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Big Feature (Bridal) */}
            <div className="md:col-span-7 relative group overflow-hidden border border-gold-200/50 flex flex-col justify-between h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-10" />
              <img
                src={collectionsList[0].image}
                alt="Bridal Collection"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 z-20 bg-gold-900 text-white font-sans text-[9px] uppercase tracking-widest px-3 py-1 font-semibold border border-gold-400 shadow-sm">
                Crown Jewel of the Atelier
              </div>
              <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                <span className="text-[10px] tracking-[0.25em] text-gold-300 font-semibold uppercase">{collectionsList[0].name}</span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-gold-100 mt-1">{collectionsList[0].name}</h3>
                <p className="text-xs text-gray-200/80 max-w-md mt-2 font-sans font-light leading-relaxed">
                  {collectionsList[0].desc} Handcarved marriage sets embedded with precious gems.
                </p>
                <button
                  onClick={() => onNav('bridal')}
                  className="mt-4 px-6 py-2 bg-white text-gold-950 hover:bg-gold-900 hover:text-white font-serif text-[10px] tracking-widest uppercase transition-colors flex items-center gap-1.5 font-bold"
                >
                  <span>Explore Bridal Saga</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Small Stack */}
            <div className="md:col-span-5 grid grid-rows-2 gap-8">
              {/* Temple */}
              <div className="relative group overflow-hidden border border-gold-200/50 h-[210px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
                <img
                  src={collectionsList[1].image}
                  alt="Temple Collection"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                  <span className="text-[9px] tracking-widest text-gold-300 font-semibold uppercase">THE DEVOTIONAL ATELIER</span>
                  <h3 className="font-serif text-lg font-bold text-gold-50 mt-0.5">{collectionsList[1].name}</h3>
                  <button
                    onClick={() => {
                      localStorage.setItem('uday_filter_collection', 'Temple');
                      onNav('products');
                    }}
                    className="text-[10px] text-gold-300 group-hover:text-white transition-colors flex items-center gap-1 mt-2 tracking-widest uppercase"
                  >
                    <span>View Heritage</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Modern Minimalist */}
              <div className="relative group overflow-hidden border border-gold-200/50 h-[210px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
                <img
                  src={collectionsList[3].image}
                  alt="Modern Collection"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                  <span className="text-[9px] tracking-widest text-gold-300 font-semibold uppercase">CONTEMPORARY SHIMMER</span>
                  <h3 className="font-serif text-lg font-bold text-gold-50 mt-0.5">{collectionsList[3].name}</h3>
                  <button
                    onClick={() => {
                      localStorage.setItem('uday_filter_collection', 'Modern');
                      onNav('products');
                    }}
                    className="text-[10px] text-gold-300 group-hover:text-white transition-colors flex items-center gap-1 mt-2 tracking-widest uppercase"
                  >
                    <span>View Modern Minimalist</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS */}
      <section className="py-16 max-w-7xl mx-auto px-4" id="best-sellers">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 text-center md:text-left">
          <div>
            <span className="font-sans text-[10px] md:text-xs text-gold-600 font-semibold tracking-[0.3em] uppercase block mb-1">PATRON SAVOURS</span>
            <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold tracking-wide uppercase">Best Sellers</h2>
          </div>
          <button
            onClick={() => onNav('products')}
            className="text-xs font-semibold text-gold-700 hover:text-gold-900 uppercase tracking-widest flex items-center gap-1 border-b border-gold-600 pb-0.5 transition-all"
          >
            <span>View Complete Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.some(p => p.id === product.id)}
              onWishlistToggle={onWishlistToggle}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </section>

      {/* 5. ROYAL OFFER & DISCOUNT VOUCHERS */}
      <section className="py-12 bg-gold-900 text-white relative overflow-hidden" id="royal-offers-banner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,141,58,0.25),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gold-50/10 border border-gold-300 rounded-none flex-shrink-0 animate-pulse">
              <Gift className="w-10 h-10 text-gold-200" />
            </div>
            <div className="text-center md:text-left">
              <span className="bg-gold-500 text-white text-[9px] font-bold px-2.5 py-0.5 tracking-widest uppercase rounded-full">Royal Privilege Offer</span>
              <h3 className="font-serif text-xl md:text-2xl font-bold mt-1.5 text-gold-100">Enjoy Complimentary Custom Carvings & Free $100 Gift Voucher</h3>
              <p className="text-xs text-gold-100/70 mt-1 max-w-lg leading-relaxed">
                Use authentication code <strong className="text-white font-mono bg-gold-950/80 px-2 py-0.5 border border-gold-700">GOLD2026</strong> on first orders over $1,500. Dual certified diamonds.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNav('products')}
            className="px-6 py-3 bg-white text-gold-950 font-serif tracking-widest text-xs uppercase hover:bg-gold-50 transition-colors flex-shrink-0 font-bold border border-gold-300 shadow-md"
          >
            Claim Privilege Code
          </button>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="py-16 max-w-7xl mx-auto px-4" id="new-arrivals">
        <div className="text-center mb-10">
          <span className="font-sans text-[10px] md:text-xs text-gold-600 font-semibold tracking-[0.3em] uppercase block mb-1">FRESHLY MOULDED</span>
          <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold tracking-wide uppercase">New Arrivals</h2>
          <div className="h-0.5 w-16 bg-gold-400 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.some(p => p.id === product.id)}
              onWishlistToggle={onWishlistToggle}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </section>

      {/* 7. TRENDING DESIGNS */}
      <section className="py-16 bg-gold-50/20 border-t border-gray-100" id="trending-designs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="font-sans text-[10px] md:text-xs text-gold-600 font-semibold tracking-[0.3em] uppercase block mb-1">SOVEREIGN FAVORITES</span>
            <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold tracking-wide uppercase">Trending Designs</h2>
            <div className="h-0.5 w-16 bg-gold-400 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.some(p => p.id === product.id)}
                onWishlistToggle={onWishlistToggle}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <section className="py-16 bg-gold-50/40 border-y border-gold-200/50" id="testimonials">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="mb-10">
            <span className="font-sans text-[10px] md:text-xs text-gold-600 font-semibold tracking-[0.3em] uppercase block mb-1">PATRON DECREES</span>
            <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold tracking-wide uppercase">Testimonials</h2>
            <div className="h-0.5 w-16 bg-gold-400 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-white p-6 border border-gold-100 flex flex-col justify-between text-left relative shadow-xs">
                <Quote className="w-8 h-8 text-gold-200 absolute top-4 right-4" />
                <div>
                  <div className="flex text-yellow-500 mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{test.quote}"
                  </p>
                </div>
                <div className="mt-6 border-t border-gray-50 pt-3">
                  <h4 className="font-serif text-sm font-bold text-gold-950">{test.name}</h4>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">{test.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. INSTAGRAM GALLERY BENTO GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4" id="instagram-gallery">
        <div className="text-center mb-10">
          <Instagram className="w-6 h-6 text-gold-600 mx-auto mb-2" />
          <span className="font-sans text-[10px] md:text-xs text-gold-600 font-semibold tracking-[0.3em] uppercase block mb-1">SOCIETY HIGHLIGHTS</span>
          <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold tracking-wide uppercase">#UdayAura On Instagram</h2>
          <div className="h-0.5 w-16 bg-gold-400 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {instagramGrid.map((img, idx) => (
            <div key={idx} className="relative pt-[100%] overflow-hidden group border border-gray-100">
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center text-white">
                <Instagram className="w-5 h-5 animate-bounce" />
              </div>
              <img
                src={img}
                alt="Instagram jewelry post"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
