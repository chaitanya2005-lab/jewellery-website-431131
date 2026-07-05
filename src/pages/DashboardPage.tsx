import React, { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import {
  User as UserIcon,
  Calendar,
  ShoppingBag,
  MapPin,
  Heart,
  FileText,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Plus,
  Trash2,
  X,
  Printer,
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Appointment, Order, Product } from '../types';
import { products } from '../data/products';

interface DashboardPageProps {
  onNav: (page: string) => void;
  onViewProductDetails: (product: Product) => void;
  onAddToCart: (product: Product, qty: number) => void;
}

export default function DashboardPage({ onNav, onViewProductDetails, onAddToCart }: DashboardPageProps) {
  const {
    userData,
    logout,
    appointments,
    orders,
    updateUserAddresses,
    updateAppointment,
    cancelAppointment
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'appointments' | 'orders' | 'addresses' | 'wishlist'>('profile');
  const [newAddress, setNewAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  // Rescheduling states
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Wishlist logic
  const [localWishlist, setLocalWishlist] = useState<Product[]>(() => {
    return JSON.parse(localStorage.getItem('uday_wishlist') || '[]');
  });

  const handleRemoveWishlist = (productId: string) => {
    const updated = localWishlist.filter(p => p.id !== productId);
    setLocalWishlist(updated);
    localStorage.setItem('uday_wishlist', JSON.stringify(updated));
    // Trigger standard reload event
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    const currentAddresses = userData?.savedAddresses || [];
    const updated = [...currentAddresses, newAddress.trim()];
    await updateUserAddresses(updated);
    setNewAddress('');
    setShowAddressForm(false);
  };

  const handleRemoveAddress = async (index: number) => {
    const currentAddresses = userData?.savedAddresses || [];
    const updated = currentAddresses.filter((_, i) => i !== index);
    await updateUserAddresses(updated);
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingApt || !rescheduleDate || !rescheduleTime) return;
    
    await updateAppointment(reschedulingApt.id, {
      date: rescheduleDate,
      time: rescheduleTime,
      status: 'Rescheduled'
    });

    setReschedulingApt(null);
    setRescheduleDate('');
    setRescheduleTime('');
  };

  const handlePrint = () => {
    window.print();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Placed': return 'bg-amber-50 text-amber-800 border border-amber-200';
      case 'Crafting': return 'bg-indigo-50 text-indigo-800 border border-indigo-200';
      case 'Hallmarked': return 'bg-purple-50 text-purple-800 border border-purple-200';
      case 'Dispatched': return 'bg-blue-50 text-blue-800 border border-blue-200';
      case 'Delivered': return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
      default: return 'bg-neutral-50 text-neutral-800 border border-neutral-200';
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 py-20 text-center" id="dashboard-logged-out">
        <UserIcon className="w-12 h-12 text-gold-500 mb-4 animate-pulse" />
        <h2 className="font-serif text-2xl text-gold-950 font-bold uppercase tracking-wider mb-2">Aura Portal Access Required</h2>
        <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">Please authenticate via the Aura Portal in the top navigation header to unlock your secure custom jewellery vault, personal orders, and concierge appointments.</p>
        <button
          onClick={() => {
            // Trigger clicking on header's login portal button
            const btn = document.getElementById('header-auth-btn') || document.getElementById('header-auth-btn-mob');
            if (btn) btn.click();
          }}
          className="px-6 py-3 bg-gold-950 text-white font-serif text-xs uppercase tracking-widest hover:bg-gold-800 transition-all border border-gold-600 shadow-md cursor-pointer"
        >
          Access Aura Portal
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-10 md:py-16 text-gray-800 font-sans" id="dashboard-root">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Navigation sidebar */}
        <div className="lg:col-span-3 bg-white border border-gold-200/80 p-6 shadow-sm">
          <div className="text-center pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-tr from-gold-900 to-gold-600 rounded-full flex items-center justify-center text-white font-serif text-xl font-bold mx-auto mb-3 shadow-md border-2 border-white">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-serif text-lg font-bold text-gold-950 truncate">{userData.name}</h3>
            <p className="text-[10px] uppercase text-gold-600 tracking-widest mt-1 font-semibold">Premium Patron</p>
            {userData.isAdmin && (
              <span className="inline-block mt-2 px-2 py-0.5 bg-gold-950 text-gold-300 font-serif text-[9px] uppercase tracking-wider font-bold">
                Director privileges active
              </span>
            )}
          </div>

          <nav className="mt-6 space-y-1.5" id="dashboard-tabs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider transition-all border-l-2 cursor-pointer ${activeTab === 'profile' ? 'bg-gold-50/50 border-gold-600 text-gold-950 font-bold' : 'border-transparent text-gray-500 hover:bg-neutral-50 hover:text-gray-900'}`}
            >
              <UserIcon className="w-4 h-4 text-gold-600" />
              <span>Vault Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider transition-all border-l-2 cursor-pointer ${activeTab === 'appointments' ? 'bg-gold-50/50 border-gold-600 text-gold-950 font-bold' : 'border-transparent text-gray-500 hover:bg-neutral-50 hover:text-gray-900'}`}
            >
              <Calendar className="w-4 h-4 text-gold-600" />
              <span>Appointments ({appointments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider transition-all border-l-2 cursor-pointer ${activeTab === 'orders' ? 'bg-gold-50/50 border-gold-600 text-gold-950 font-bold' : 'border-transparent text-gray-500 hover:bg-neutral-50 hover:text-gray-900'}`}
            >
              <ShoppingBag className="w-4 h-4 text-gold-600" />
              <span>Orders & Custom Des. ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider transition-all border-l-2 cursor-pointer ${activeTab === 'addresses' ? 'bg-gold-50/50 border-gold-600 text-gold-950 font-bold' : 'border-transparent text-gray-500 hover:bg-neutral-50 hover:text-gray-900'}`}
            >
              <MapPin className="w-4 h-4 text-gold-600" />
              <span>Saved Addresses ({userData.savedAddresses?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider transition-all border-l-2 cursor-pointer ${activeTab === 'wishlist' ? 'bg-gold-50/50 border-gold-600 text-gold-950 font-bold' : 'border-transparent text-gray-500 hover:bg-neutral-50 hover:text-gray-900'}`}
            >
              <Heart className="w-4 h-4 text-gold-600" />
              <span>Saved Treasures ({localWishlist.length})</span>
            </button>
            
            {userData.isAdmin && (
              <div className="pt-4 border-t border-gray-100 mt-4">
                <button
                  onClick={() => onNav('admin')}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-gold-950 text-gold-200 hover:bg-gold-900 text-xs uppercase tracking-wider font-semibold shadow-sm rounded-none"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider text-red-600 hover:bg-red-50 transition-all border-l-2 border-transparent mt-8 text-left cursor-pointer font-bold"
            >
              <span>Logout Secure Session</span>
            </button>
          </nav>
        </div>

        {/* Right Column - Active view panel */}
        <div className="lg:col-span-9 bg-white border border-gold-200/80 p-6 md:p-8 shadow-sm min-h-[500px]">
          
          {/* TAB 1: PROFILE INFO */}
          {activeTab === 'profile' && (
            <div className="space-y-6" id="dashboard-profile-tab">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl md:text-2xl text-gold-950 font-bold uppercase tracking-wider">Vault Profile Details</h2>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Your Private Account Registry</p>
                </div>
                <Sparkles className="w-5 h-5 text-gold-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Registered Patron Name</span>
                  <p className="text-base font-serif font-bold text-gold-950 mt-1">{userData.name}</p>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Secure Account Email</span>
                  <p className="text-base font-sans font-medium text-gray-800 mt-1">{userData.email}</p>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Concierge Mobile Number</span>
                  <p className="text-base font-sans font-medium text-gray-800 mt-1">{userData.phone || 'Not Specified'}</p>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Security Classification</span>
                  <p className="text-sm font-sans font-semibold text-gold-800 mt-1 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-gold-600" />
                    <span>256-Bit Encrypted Secure Profile</span>
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-serif text-sm font-bold text-gold-950 uppercase tracking-wide mb-3">Quick Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button onClick={() => setActiveTab('appointments')} className="p-4 border border-gold-200 bg-gold-50/10 hover:bg-gold-50/40 transition-all text-left flex flex-col justify-between h-24">
                    <Calendar className="w-4 h-4 text-gold-700" />
                    <span className="text-xs font-semibold text-gold-950 uppercase tracking-wider block mt-2">Bookings Directory →</span>
                  </button>
                  <button onClick={() => setActiveTab('orders')} className="p-4 border border-gold-200 bg-gold-50/10 hover:bg-gold-50/40 transition-all text-left flex flex-col justify-between h-24">
                    <ShoppingBag className="w-4 h-4 text-gold-700" />
                    <span className="text-xs font-semibold text-gold-950 uppercase tracking-wider block mt-2">Heirloom History →</span>
                  </button>
                  <button onClick={() => setActiveTab('addresses')} className="p-4 border border-gold-200 bg-gold-50/10 hover:bg-gold-50/40 transition-all text-left flex flex-col justify-between h-24">
                    <MapPin className="w-4 h-4 text-gold-700" />
                    <span className="text-xs font-semibold text-gold-950 uppercase tracking-wider block mt-2">Saved Mansions →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6" id="dashboard-appointments-tab">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl md:text-2xl text-gold-950 font-bold uppercase tracking-wider">Scheduled Rendezvous</h2>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Concierge consultation & Showroom Booking</p>
                </div>
                <button
                  onClick={() => onNav('contact')}
                  className="px-4 py-2 bg-gold-950 hover:bg-gold-800 text-white font-serif text-[10px] font-bold uppercase tracking-widest shadow-sm cursor-pointer"
                >
                  New Booking
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 border border-neutral-150">
                  <Calendar className="w-10 h-10 text-gold-400 mx-auto mb-3" />
                  <p className="text-sm font-serif text-gold-950 uppercase tracking-wider font-semibold">No Bookings Registered</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Request premium private lounge access, customized sketch-design, or valuations.</p>
                  <button onClick={() => onNav('contact')} className="px-5 py-2.5 bg-gold-900 text-white font-serif text-[10px] uppercase tracking-widest hover:bg-gold-800 transition-colors">
                    Arrange Consultation
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="border border-gold-200 p-5 bg-white space-y-4 shadow-sm hover:border-gold-400 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div>
                          <span className="px-2.5 py-0.5 bg-gold-50 text-gold-900 border border-gold-200 font-serif text-[10px] uppercase font-bold tracking-widest">
                            {apt.type}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-2 font-mono uppercase">ID: {apt.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 font-sans font-bold text-[10px] uppercase tracking-wider ${
                            apt.status === 'Cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                            apt.status === 'Rescheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {apt.status || 'Scheduled'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gold-700" />
                          <span>{apt.date} at {apt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gold-700" />
                          <span className="truncate">{apt.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gold-700" />
                          <span>{apt.phone}</span>
                        </div>
                      </div>

                      {apt.notes && (
                        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-sm text-xs text-gray-500 font-light">
                          <strong className="text-gray-700 uppercase tracking-widest text-[9px] block mb-1">Notes:</strong>
                          {apt.notes}
                        </div>
                      )}

                      {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 text-[10px] uppercase tracking-wider">
                          <button
                            onClick={() => {
                              setReschedulingApt(apt);
                              setRescheduleDate(apt.date);
                              setRescheduleTime(apt.time);
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-600 hover:border-gold-500 hover:text-gold-950 transition-colors cursor-pointer"
                          >
                            Reschedule Booking
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm("Are you sure you want to cancel this luxurious booking?")) {
                                await cancelAppointment(apt.id);
                              }
                            }}
                            className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            Cancel Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6" id="dashboard-orders-tab">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl md:text-2xl text-gold-950 font-bold uppercase tracking-wider">Order Ledger</h2>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Heirloom Purchases & Custom Jewelry Status</p>
                </div>
                <ShoppingBag className="w-5 h-5 text-gold-500" />
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 border border-neutral-150">
                  <ShoppingBag className="w-10 h-10 text-gold-400 mx-auto mb-3" />
                  <p className="text-sm font-serif text-gold-950 uppercase tracking-wider font-semibold">No Transactions Recorded</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Your gold vault is empty. Explore our exquisite range of GIA diamonds, 22K pure temple chains, and custom-sketched rings.</p>
                  <button onClick={() => onNav('products')} className="px-5 py-2.5 bg-gold-900 text-white font-serif text-[10px] uppercase tracking-widest hover:bg-gold-800 transition-colors">
                    Explore Showcase
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border border-gold-200/80 p-5 bg-white space-y-5 shadow-sm hover:border-gold-400 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div>
                          <p className="font-serif text-sm font-bold text-gold-950">
                            Order {ord.id}
                          </p>
                          <span className="text-[10px] text-gray-400 font-sans">Placed on {ord.date}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`px-2.5 py-0.5 font-sans font-bold text-[10px] uppercase tracking-wider ${getStatusColor(ord.status)}`}>
                            {ord.status}
                          </span>
                          <button
                            onClick={() => setSelectedInvoice(ord)}
                            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider border border-gold-300 text-gold-900 bg-gold-50/20 hover:bg-gold-50 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-gold-700" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>

                      {/* Dynamic Visual Tracker */}
                      <div className="pt-2">
                        <p className="text-[10px] uppercase tracking-widest text-gold-600 font-bold mb-3.5">Heirloom Journey Progress</p>
                        <div className="relative flex justify-between items-center w-full max-w-xl mx-auto py-2">
                          {/* Progress Line */}
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
                          <div
                            className="absolute top-1/2 left-0 h-0.5 bg-gold-600 -translate-y-1/2 z-0 transition-all duration-[1000ms]"
                            style={{
                              width: ord.status === 'Placed' ? '0%' :
                                     ord.status === 'Crafting' ? '25%' :
                                     ord.status === 'Hallmarked' ? '50%' :
                                     ord.status === 'Dispatched' ? '75%' : '100%'
                            }}
                          />

                          {/* Steps */}
                          {['Placed', 'Crafting', 'Hallmarked', 'Dispatched', 'Delivered'].map((stepName, stepIdx) => {
                            const stepsMap = { Placed: 0, Crafting: 1, Hallmarked: 2, Dispatched: 3, Delivered: 4 };
                            const currentIdx = stepsMap[ord.status];
                            const isCompleted = stepIdx <= currentIdx;

                            return (
                              <div key={stepName} className="relative z-10 flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-serif text-[9px] font-bold ${
                                  isCompleted ? 'bg-gold-950 text-white border-gold-950' : 'bg-white text-gray-400 border-gray-200'
                                }`}>
                                  {stepIdx + 1}
                                </div>
                                <span className={`text-[8px] font-semibold uppercase tracking-wider mt-1.5 ${
                                  isCompleted ? 'text-gold-950 font-bold' : 'text-gray-400'
                                }`}>
                                  {stepName}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-center mt-3 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                          Tracking No: {ord.trackingNumber}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 border-t border-gray-100 pt-4">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs">
                            <img src={it.product.images[0]} className="w-12 h-12 object-cover border border-gray-100" />
                            <div className="flex-1 min-w-0">
                              <p className="font-serif font-semibold text-gray-900 truncate">{it.product.name}</p>
                              <p className="text-[10px] text-gray-400">
                                Size: {it.selectedSize || 'N/A'} • Qty: {it.quantity}
                              </p>
                            </div>
                            <span className="font-bold text-gold-950">${it.product.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-gray-100 text-xs gap-3">
                        <div>
                          <p className="text-gray-400 uppercase tracking-widest text-[9px]">Delivery Address</p>
                          <p className="text-gray-700 mt-1">{ord.shippingAddress.addressLine}, {ord.shippingAddress.city} - {ord.shippingAddress.postalCode}</p>
                        </div>
                        <div className="text-right self-end sm:self-auto">
                          <p className="text-gray-400 uppercase tracking-widest text-[9px]">Total Amount Paid</p>
                          <p className="font-serif text-lg font-bold text-gold-950 mt-0.5">${ord.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6" id="dashboard-addresses-tab">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl md:text-2xl text-gold-950 font-bold uppercase tracking-wider">Secured Mansions</h2>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Saved delivery and shipping addresses</p>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-4 py-2 bg-gold-950 hover:bg-gold-800 text-gold-100 font-serif text-[10px] font-bold uppercase tracking-widest shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Address</span>
                </button>
              </div>

              {showAddressForm && (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddAddress}
                  className="p-4 border border-gold-200 bg-gold-50/10 space-y-4"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Full Shipping Mansion Address</label>
                    <textarea
                      required
                      placeholder="e.g. Royal Palace Mansion, Floor 2, Sector 5, Majalgaon - 431131"
                      className="w-full px-3 py-2 border border-gray-300 font-sans text-xs focus:outline-none focus:border-gold-500 h-20"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-500 text-xs uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-gold-950 text-white text-xs uppercase tracking-wider hover:bg-gold-800"
                    >
                      Save Address
                    </button>
                  </div>
                </motion.form>
              )}

              {(!userData.savedAddresses || userData.savedAddresses.length === 0) ? (
                <div className="text-center py-12 bg-neutral-50 border border-neutral-150">
                  <MapPin className="w-10 h-10 text-gold-400 mx-auto mb-3" />
                  <p className="text-sm font-serif text-gold-950 uppercase tracking-wider font-semibold">No Saved Mansions</p>
                  <p className="text-xs text-gray-400 mt-1">Please insert a default shipping and courier destination for your jewelry orders.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.savedAddresses.map((addr, idx) => (
                    <div key={idx} className="border border-gold-200 p-4 bg-white flex justify-between items-start shadow-sm hover:border-gold-400 transition-colors">
                      <div className="flex gap-2.5">
                        <MapPin className="w-4 h-4 text-gold-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Mansion {idx + 1}</p>
                          <p className="text-xs text-gray-700 font-sans mt-1 leading-relaxed whitespace-pre-line">{addr}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAddress(idx)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6" id="dashboard-wishlist-tab">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl md:text-2xl text-gold-950 font-bold uppercase tracking-wider">Saved Treasures</h2>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Jewelry items matching your personal royal catalog</p>
                </div>
                <Heart className="w-5 h-5 text-gold-500 fill-gold-500" />
              </div>

              {localWishlist.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 border border-neutral-150">
                  <Heart className="w-10 h-10 text-gold-400 mx-auto mb-3" />
                  <p className="text-sm font-serif text-gold-950 uppercase tracking-wider font-semibold">No Treasures Saved</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Click the heart symbol on any product in our collections to add it here.</p>
                  <button onClick={() => onNav('products')} className="px-5 py-2.5 bg-gold-900 text-white font-serif text-[10px] uppercase tracking-widest hover:bg-gold-800 transition-colors">
                    Explore Showcase
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localWishlist.map((p) => (
                    <div key={p.id} className="border border-gold-200 p-4 bg-white flex gap-4 items-center shadow-sm">
                      <img src={p.images[0]} className="w-16 h-16 object-cover border border-gray-100 cursor-pointer" onClick={() => onViewProductDetails(p)} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-bold text-gold-950 truncate cursor-pointer hover:text-gold-700" onClick={() => onViewProductDetails(p)}>
                          {p.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{p.type} • {p.collection}</p>
                        <p className="font-sans text-sm text-gold-900 font-bold mt-1">${p.price}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            onAddToCart(p, 1);
                            handleRemoveWishlist(p.id);
                          }}
                          className="px-3 py-1.5 bg-gold-950 hover:bg-gold-800 text-white font-serif text-[9px] uppercase tracking-widest font-bold shadow-sm"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={() => handleRemoveWishlist(p.id)}
                          className="text-[9px] text-gray-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* MODAL 1: INVOICE / RECEIPT OVERLAY */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-2xl w-full border border-gold-300 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              id="printable-invoice"
            >
              <button
                onClick={() => setSelectedInvoice(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gold-800 p-1.5 print:hidden"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 space-y-6">
                {/* Header of Receipt */}
                <div className="text-center pb-6 border-b-2 border-gold-400/50">
                  <h2 className="font-serif text-2xl font-extrabold tracking-widest text-gold-950 uppercase">UDAY JEWELLERS</h2>
                  <p className="text-[9px] uppercase tracking-[0.4em] text-gold-700 mt-1 font-serif">A Legacy by Uday Shivajirav Narwade</p>
                  <p className="text-[9px] text-gray-400 font-sans mt-2">Bajaj Complex, Shivaji Chowk, Majalgaon | +91 75587 95959</p>
                </div>

                <div className="flex justify-between text-xs text-gray-600 font-sans">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gold-700 font-bold">CLIENT INVOICE FOR</p>
                    <p className="font-serif font-bold text-sm text-gold-950 mt-1">{ordDetailValue(selectedInvoice).shippingAddress.fullName}</p>
                    <p className="mt-0.5">{ordDetailValue(selectedInvoice).shippingAddress.fullName}</p>
                    <p>{ordDetailValue(selectedInvoice).shippingAddress.addressLine}</p>
                    <p>{ordDetailValue(selectedInvoice).shippingAddress.city} - {ordDetailValue(selectedInvoice).shippingAddress.postalCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-gold-700 font-bold">TRANSACTION META</p>
                    <p className="font-serif font-bold text-sm text-gold-950 mt-1">Invoice ID: {selectedInvoice.id}</p>
                    <p className="mt-0.5">Date: {selectedInvoice.date}</p>
                    <p>Tracking No: {selectedInvoice.trackingNumber}</p>
                    <p>Status: {selectedInvoice.status}</p>
                  </div>
                </div>

                {/* Table of items */}
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-gold-300 text-gold-900 uppercase tracking-widest font-bold">
                      <th className="py-2.5 font-serif">Heirloom Product Description</th>
                      <th className="py-2.5 text-center font-serif">Qty</th>
                      <th className="py-2.5 text-center font-serif">Size</th>
                      <th className="py-2.5 text-right font-serif">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedInvoice.items.map((it, idx) => (
                      <tr key={idx} className="text-gray-700">
                        <td className="py-3 font-medium text-gray-900">{it.product.name} ({it.product.type})</td>
                        <td className="py-3 text-center">{it.quantity}</td>
                        <td className="py-3 text-center">{it.selectedSize || 'N/A'}</td>
                        <td className="py-3 text-right font-bold">${it.product.price * it.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total amount summary */}
                <div className="border-t-2 border-gold-200 pt-4 flex flex-col items-end gap-1.5 text-xs text-gray-600">
                  <div className="flex justify-between w-60">
                    <span>Tax (GST 3% on Gold):</span>
                    <span className="font-semibold text-gray-900">Included</span>
                  </div>
                  <div className="flex justify-between w-60">
                    <span>Royal Trousseau Delivery:</span>
                    <span className="font-semibold text-emerald-600">Complimentary</span>
                  </div>
                  <div className="flex justify-between w-60 border-t border-gray-100 pt-2 text-sm text-gold-950 font-bold">
                    <span>TOTAL AMOUNT PAID:</span>
                    <span>${selectedInvoice.totalAmount}</span>
                  </div>
                </div>

                {/* footer terms */}
                <div className="text-[10px] text-gray-400 font-sans leading-relaxed text-center pt-6 border-t border-dashed border-gray-200">
                  <p className="font-serif font-bold text-gold-900 uppercase mb-1">Auspicious Certified Legacy</p>
                  <p>Every piece includes Hallmark purity certification, authentic gemstone weight parameters, and a complimentary lifetime refurbishing guarantee at our Majalgaon flagship showroom.</p>
                </div>

                <div className="flex gap-3 justify-center pt-4 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gold-950 hover:bg-gold-800 text-white font-serif text-xs font-bold uppercase tracking-widest cursor-pointer shadow"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Invoice / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-600 text-xs uppercase tracking-wider hover:bg-neutral-50 cursor-pointer"
                  >
                    Close Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESCHEDULING MODAL OVERLAY */}
      <AnimatePresence>
        {reschedulingApt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-sm w-full border border-gold-300 shadow-2xl relative"
            >
              <button
                onClick={() => setReschedulingApt(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gold-800 p-1.5"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-4">
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-gold-600 mx-auto mb-2" />
                  <h3 className="font-serif text-lg font-bold text-gold-950 uppercase tracking-wider">Reschedule Rendezvous</h3>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Select new premium date & time</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 font-sans text-xs focus:outline-none focus:border-gold-500"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Preferred Time Slot</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 bg-white font-sans text-xs focus:outline-none"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                  >
                    <option value="">Select Slot</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Morning)</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                    <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM (Evening)</option>
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setReschedulingApt(null)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-500 text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-gold-950 text-white text-xs uppercase tracking-wider hover:bg-gold-800"
                  >
                    Confirm Change
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper typing helper
function ordDetailValue(o: Order): Order {
  return o;
}
