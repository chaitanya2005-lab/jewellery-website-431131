import React, { useState, useEffect } from 'react';
import { Search, MapPin, Truck, Award, ShieldCheck, CheckCircle2, ShoppingBag, Clock, Sparkles } from 'lucide-react';
import { Order } from '../types';

export default function OrderTrackingPage() {
  const [searchCode, setSearchCode] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState('');

  // Initial load: check if we have a recent order or demo order code
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem('uday_orders') || '[]');
    if (existing.length > 0) {
      // Auto-load most recent order
      setOrder(existing[existing.length - 1]);
      setSearchCode(existing[existing.length - 1].trackingNumber);
    } else {
      // Seed a default demo order for gorgeous initial preview state
      const demoOrder: Order = {
        id: 'ORD_DEMO777',
        items: [
          {
            product: {
              id: 'p1',
              name: 'Aisvarya Royal Temple Choker',
              category: 'Necklaces',
              type: 'Gold',
              collection: 'Temple',
              price: 3250,
              rating: 4.9,
              reviewsCount: 18,
              images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400'],
              description: 'Handcrafted temple choker.',
              specifications: { weight: '42.5g', purity: '22K Gold' }
            },
            quantity: 1
          }
        ],
        totalAmount: 3347.50, // subtotal + tax
        shippingAddress: {
          fullName: 'Maharani Gayatri Devi',
          email: 'gayatri@palace.com',
          phone: '+91 99999 88888',
          addressLine: 'Rambagh Palace Bungalow 2, Jaipur Road',
          city: 'Jaipur',
          postalCode: '302005'
        },
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: 'Hallmarked',
        trackingNumber: 'UDY777999'
      };
      localStorage.setItem('uday_orders', JSON.stringify([demoOrder]));
      setOrder(demoOrder);
      setSearchCode(demoOrder.trackingNumber);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const existing: Order[] = JSON.parse(localStorage.getItem('uday_orders') || '[]');
    const found = existing.find(
      o => o.trackingNumber.toLowerCase() === searchCode.trim().toLowerCase() || o.id.toLowerCase() === searchCode.trim().toLowerCase()
    );

    if (found) {
      setOrder(found);
      setSearchError('');
    } else {
      setSearchError('No luxury order found matching that credentials. Ensure tracking format is "UDY777999" or enter Order ID.');
    }
  };

  // Status mapping to helper indexes
  const statusSteps = [
    {
      status: 'Placed',
      title: 'Order Registered & Verified',
      desc: 'Atelier registered your precious order. Design sheets are being finalized.',
      icon: Clock
    },
    {
      status: 'Crafting',
      title: 'Artisanal Molding & Setting',
      desc: 'Master Karigars are chiseled molding the 22K/18K metal and hand-setting diamonds.',
      icon: Sparkles
    },
    {
      status: 'Hallmarked',
      title: 'BIS Hallmark Assay Verification',
      desc: 'Ornaments undergo laser testing for exact gold karat verification and hallmark certification.',
      icon: Award
    },
    {
      status: 'Dispatched',
      title: 'Secured Insured Courier Transit',
      desc: 'Packed in luxurious tamper-proof boxes and handed to specialized armed courier.',
      icon: Truck
    },
    {
      status: 'Delivered',
      title: 'Hand-delivered with Dual Sign',
      desc: 'Securely reached destination. Received after physical ID check and signature.',
      icon: CheckCircle2
    }
  ];

  const currentStatusIdx = statusSteps.findIndex(s => s.status === order?.status);

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans" id="order-tracking-root">
      
      {/* 1. HERO BAR */}
      <section className="relative py-16 bg-gold-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gold-950 via-gold-950/95 to-gold-950 z-10" />

        <div className="relative z-20 max-w-3xl mx-auto px-4">
          <span className="text-[10px] tracking-[0.4em] text-gold-300 font-semibold uppercase block mb-2">SECURE VAULT INTEGRATION</span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-widest text-gold-50 uppercase">
            Order Tracking
          </h1>
          <p className="font-sans text-xs md:text-sm text-gold-100/70 mt-3 leading-relaxed max-w-xl mx-auto font-light">
            Monitor every phase of your luxury order, from mold casting in our workshop to government hallmarking assays and hand delivery.
          </p>
        </div>
      </section>

      {/* 2. SEARCH GATEWAY */}
      <section className="py-10 bg-gold-50/30 border-b border-gold-100">
        <div className="max-w-md mx-auto px-4">
          <form onSubmit={handleSearch} className="flex border border-gold-300 font-sans shadow-xs bg-white">
            <input
              type="text"
              required
              placeholder="Enter Tracking No (e.g. UDY777999) or Order ID"
              className="w-full px-4 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gold-950 hover:bg-gold-800 text-white px-5 transition-colors flex items-center justify-center border-l border-gold-300"
              id="search-order-btn"
            >
              <Search className="w-4 h-4 text-gold-100" />
            </button>
          </form>

          {searchError && (
            <p className="text-red-500 text-xs text-center mt-2 font-medium">
              {searchError}
            </p>
          )}

          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400 italic">
              Try searching our standard demo order code: <strong className="text-gold-700 select-all font-mono">UDY777999</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 3. TIMELINE & SUMMARY VIEW */}
      {order && (
        <section className="py-16 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            
            {/* Left: Progress Timeline */}
            <div className="md:col-span-7 space-y-8 bg-white border border-gold-100 p-6 md:p-8">
              <h3 className="font-serif text-lg font-bold text-gold-950 uppercase tracking-wider mb-6">Artisanal Progress</h3>
              
              <div className="relative border-l border-gold-200 ml-4 pl-8 space-y-10">
                {statusSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCompleted = idx <= currentStatusIdx;
                  const isCurrent = idx === currentStatusIdx;

                  return (
                    <div key={idx} className="relative">
                      {/* Checkpoint Dot */}
                      <span className={`absolute -left-[45px] top-0 w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-all ${isCompleted ? 'bg-gold-900 border-gold-400 text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-gold-200" />
                        ) : (
                          <StepIcon className="w-4 h-4" />
                        )}
                      </span>

                      {/* Line connector highlights */}
                      {idx < statusSteps.length - 1 && (
                        <div className={`absolute -left-[30px] top-8 w-px h-12 -z-10 ${idx < currentStatusIdx ? 'bg-gold-900' : 'bg-gray-200'}`} />
                      )}

                      <div className="text-left font-sans">
                        <h4 className={`text-sm font-bold tracking-wide uppercase ${isCurrent ? 'text-gold-800' : isCompleted ? 'text-gray-900 font-semibold' : 'text-gray-400 font-normal'}`}>
                          {step.title}
                          {isCurrent && <span className="ml-2 text-[9px] bg-gold-100 text-gold-800 px-1.5 py-0.5 rounded-full font-semibold uppercase">Active Stage</span>}
                        </h4>
                        <p className={`text-xs mt-1 leading-relaxed ${isCompleted ? 'text-gray-600 font-light' : 'text-gray-400 font-light'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Order summary card */}
            <div className="md:col-span-5 space-y-6">
              
              <div className="bg-gold-50/40 border border-gold-300 p-6 space-y-5">
                <div className="border-b border-gold-200 pb-3 text-left">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Transaction Confirmed</p>
                  <h4 className="font-serif text-lg font-bold text-gold-950 uppercase mt-0.5">Order Invoice</h4>
                  <p className="text-[10px] text-gold-600 font-mono mt-1">ID: {order.id}</p>
                </div>

                {/* Items detail list */}
                <div className="space-y-4 divide-y divide-gold-100 max-h-[220px] overflow-y-auto pr-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 pt-3 first:pt-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover border border-gold-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left min-w-0 flex-1">
                        <h5 className="font-serif text-xs font-semibold text-gold-950 truncate">{item.product.name}</h5>
                        <p className="text-[10px] text-gray-400 mt-0.5">Qty: {item.quantity} • Purity: {item.product.specifications.purity}</p>
                        <p className="text-xs font-semibold text-gold-900 mt-0.5">${(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping info */}
                <div className="border-t border-gold-200 pt-4 text-left space-y-1.5 text-xs text-gray-600">
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-gold-700 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>{order.shippingAddress.fullName}</strong><br />
                      {order.shippingAddress.addressLine}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}
                    </span>
                  </p>
                  <p className="pl-5.5 text-gray-400">Insured phone: {order.shippingAddress.phone}</p>
                </div>

                {/* Total pricing */}
                <div className="border-t border-gold-200 pt-4 text-left flex justify-between font-serif text-sm font-bold text-gold-950">
                  <span>Total Amount Paid</span>
                  <span>${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Insured Security statement */}
              <div className="p-4 bg-gray-50 border border-gray-200 text-[10px] text-gray-400 leading-relaxed font-light">
                <ShieldCheck className="w-5 h-5 text-gold-600 mb-1.5" />
                This tracking connection uses Uday’s secure private keys linked directly with courier servers. For security, courier details are private until hallmarking assay completes.
              </div>

            </div>

          </div>
        </section>
      )}

    </div>
  );
}
