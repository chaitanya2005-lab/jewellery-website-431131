import { MapPin, Phone, Clock, Mail, Sparkles, Navigation } from 'lucide-react';

interface StoreLocatorPageProps {
  onOpenAppointment: () => void;
}

export default function StoreLocatorPage({ onOpenAppointment }: StoreLocatorPageProps) {
  const store = {
    city: 'Majalgaon',
    name: 'Uday Jewellers (Flagship Showroom)',
    address: 'Bajaj Complex, Samarth Nagar, Shivaji Chowk, Majalgaon - 431131, District Beed, Maharashtra, India.',
    phone: '+91 75587 95959 / +91 73877 08866',
    hours: '10:00 AM - 09:00 PM (Daily)',
    email: 'info@udayjewellers.com',
    manager: 'Mr. Uday Shivaji Narwade'
  };

  const handleDirections = () => {
    window.open("https://www.google.com/maps/search/?api=1&query=Uday+Jewellers+Bajaj+Complex+Majalgaon+Maharashtra", "_blank");
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans" id="storelocator-root">
      
      {/* 1. HEADER HERO */}
      <section className="relative py-20 bg-gold-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gold-950 via-gold-950/95 to-gold-950 z-10" />

        <div className="relative z-20 max-w-3xl mx-auto px-4">
          <span className="text-[10px] tracking-[0.4em] text-gold-300 font-semibold uppercase block mb-2">PHYSICAL BOUTIQUES</span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-widest text-gold-50 uppercase">
            Flagship Showroom
          </h1>
          <p className="font-sans text-xs md:text-sm text-gold-100/70 mt-4 leading-relaxed max-w-xl mx-auto font-light">
            Step into absolute splendor. Visit our majestic physical boutique in Majalgaon, Beed to experience certified gold purity, preview new custom collections, and get personal bridal trousseau consultations.
          </p>
        </div>
      </section>

      {/* 2. THE FLAGSHIP BOUTIQUE PRESENTATION */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Side: Store Details Card */}
          <div className="lg:col-span-5 border border-gold-300 bg-white p-6 md:p-8 hover:border-gold-400 transition-all shadow-md flex flex-col justify-between">
            <div>
              <div className="inline-block bg-gold-50 border border-gold-200 px-3 py-1 font-serif text-[11px] font-bold text-gold-800 uppercase tracking-widest mb-4">
                {store.city} Flagship
              </div>

              <h3 className="font-serif text-2xl text-gold-950 font-bold tracking-wide mb-1">
                {store.name}
              </h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">
                Proprietor & Director: {store.manager}
              </p>
              
              <div className="h-px w-12 bg-gold-400 mb-6" />

              <div className="space-y-4 text-xs text-gray-600 font-sans leading-relaxed">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Bajaj Complex, Samarth Nagar,<br />
                    Shivaji Chowk, Majalgaon - 431131,<br />
                    District Beed, Maharashtra, India.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Store Timings</p>
                    <p>{store.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Direct Helplines</p>
                    <p>+91 75587 95959</p>
                    <p>+91 73877 08866</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Concierge Email</p>
                    <p>{store.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 mt-8 border-t border-gray-100">
              <button
                onClick={onOpenAppointment}
                className="flex-1 py-3 bg-gold-950 text-white font-serif tracking-widest text-[10px] uppercase hover:bg-gold-800 transition-colors flex items-center justify-center gap-1.5 font-bold shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-gold-300" />
                <span>Book VIP Experience</span>
              </button>
              <button
                onClick={handleDirections}
                className="px-4 py-3 border border-gray-300 text-gray-600 hover:border-gold-400 hover:text-gold-800 transition-all flex items-center justify-center cursor-pointer"
                title="Open in Google Maps"
              >
                <Navigation className="w-4.5 h-4.5 text-gold-700" />
              </button>
            </div>
          </div>

          {/* Right Side: Google Map Iframe */}
          <div className="lg:col-span-7 bg-white p-2 border border-gold-300 shadow-md h-[450px] md:h-auto min-h-[400px] relative overflow-hidden flex flex-col">
            <div className="bg-gold-50/50 border-b border-gold-100 p-3 flex items-center justify-between text-[11px] font-sans font-semibold text-gold-900 tracking-wider">
              <span>EXPLORE INTERACTIVE ROUTE MAP</span>
              <button onClick={handleDirections} className="text-gold-700 hover:underline flex items-center gap-1">
                Open in App →
              </button>
            </div>
            <div className="flex-1 w-full h-full relative">
              <iframe
                src="https://maps.google.com/maps?q=Uday%20Jewellers,%20Bajaj%20Complex,%20Samarth%20Nagar,%20Shivaji%20Chowk,%20Majalgaon%20Maharashtra&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, minHeight: '100%', width: '100%' }}
                allowFullScreen={true}
                aria-hidden="false"
                tabIndex={0}
                title="Uday Jewellers Majalgaon Showroom Map"
                id="locator-google-maps-iframe"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. EXPERIENTIAL STORY BANNER */}
      <section className="py-16 bg-gold-50/30 border-t border-gold-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
              alt="Bespoke luxury table showroom"
              className="w-full h-[300px] object-cover border border-gold-200 shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="md:col-span-6 space-y-4">
            <span className="text-[10px] tracking-widest text-gold-600 font-semibold uppercase">THE PRIVÉ LOUNGE</span>
            <h3 className="font-serif text-2xl text-gold-950 font-bold uppercase tracking-wide">A Sensory Experience</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light">
              Our flagship Majalgaon showroom offers specialized private booths where you can sit with Mr. Uday Shivaji Narwade and certified designers. Enjoy complimentary traditional refreshments while sketching custom designs or valuing heirloom gold.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
