import React, { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import {
  ShieldAlert,
  Users,
  Calendar,
  ShoppingBag,
  DollarSign,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Search,
  CheckCircle,
  XCircle,
  Clock3,
  RefreshCw,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Appointment, Order, User } from '../types';

export default function AdminPage() {
  const {
    allUsersList,
    allAppointmentsList,
    allOrdersList,
    updateAppointment,
    updateOrder,
    isAdmin
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'appointments' | 'orders'>('appointments');
  const [searchTerm, setSearchTerm] = useState('');

  // Editing appointments
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  // Search filter
  function filterList<T>(list: T[]): T[] {
    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(item => {
      const name = (item as any).name || '';
      const email = (item as any).email || '';
      const id = (item as any).id || '';
      return name.toLowerCase().includes(q) ||
             email.toLowerCase().includes(q) ||
             id.toLowerCase().includes(q);
    });
  }

  const handleUpdateAptStatus = async (id: string, status: 'Scheduled' | 'Rescheduled' | 'Cancelled' | 'Completed') => {
    await updateAppointment(id, { status });
  };

  const handleUpdateOrderStatus = async (id: string, status: 'Placed' | 'Crafting' | 'Hallmarked' | 'Dispatched' | 'Delivered') => {
    await updateOrder(id, { status });
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt || !editDate || !editTime) return;
    await updateAppointment(editingApt.id, {
      date: editDate,
      time: editTime,
      status: 'Rescheduled'
    });
    setEditingApt(null);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-neutral-50 px-4 py-20 text-center" id="admin-forbidden">
        <ShieldAlert className="w-16 h-16 text-red-600 mb-4 animate-bounce" />
        <h2 className="font-serif text-2xl text-red-950 font-bold uppercase tracking-wider mb-2">Access Denied</h2>
        <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">This page is restricted to Directors and authorized administration representatives of Uday Jewellers.</p>
      </div>
    );
  }

  // Calculate quick stats
  const totalUsers = allUsersList.length;
  const activeApts = allAppointmentsList.filter(a => a.status === 'Scheduled' || a.status === 'Rescheduled').length;
  const completedOrders = allOrdersList.filter(o => o.status === 'Delivered').length;
  const totalSales = allOrdersList.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="bg-neutral-50 min-h-screen py-10 text-gray-800 font-sans" id="admin-root">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Banner */}
        <div className="bg-gold-950 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between border-b-2 border-gold-400">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] uppercase text-gold-300 tracking-[0.3em] font-bold">Showroom Control Center</p>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide mt-1">Uday Jewellers Director Portal</h1>
          </div>
          <p className="text-xs text-gold-200/75 mt-2 md:mt-0 italic font-serif">Executive Administration Mode</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gold-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Total Patrons</p>
              <h3 className="font-serif text-2xl font-extrabold text-gold-950 mt-1">{totalUsers}</h3>
              <p className="text-[10px] text-emerald-600 font-sans flex items-center gap-1 mt-1.5 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+100% cloud synced</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-gold-50 border border-gold-200 flex items-center justify-center">
              <Users className="w-6 h-6 text-gold-700" />
            </div>
          </div>

          <div className="bg-white border border-gold-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Active Consultations</p>
              <h3 className="font-serif text-2xl font-extrabold text-gold-950 mt-1">{activeApts}</h3>
              <p className="text-[10px] text-amber-600 font-sans flex items-center gap-1 mt-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Showroom lounges occupied</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-gold-50 border border-gold-200 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gold-700" />
            </div>
          </div>

          <div className="bg-white border border-gold-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Dispatch Ledger</p>
              <h3 className="font-serif text-2xl font-extrabold text-gold-950 mt-1">{allOrdersList.length}</h3>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1.5">Completed: {completedOrders} orders</p>
            </div>
            <div className="w-12 h-12 bg-gold-50 border border-gold-200 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-gold-700" />
            </div>
          </div>

          <div className="bg-white border border-gold-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Executive Revenue</p>
              <h3 className="font-serif text-2xl font-extrabold text-gold-950 mt-1">${totalSales.toLocaleString()}</h3>
              <p className="text-[10px] text-gray-400 mt-1.5 font-mono">22K Pure Valuation</p>
            </div>
            <div className="w-12 h-12 bg-gold-50 border border-gold-200 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gold-700" />
            </div>
          </div>
        </div>

        {/* Directory Controls */}
        <div className="bg-white border border-gold-200/80 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => { setActiveTab('appointments'); setSearchTerm(''); }}
                className={`px-4 py-2 text-xs uppercase tracking-wider transition-all font-semibold cursor-pointer ${activeTab === 'appointments' ? 'bg-gold-950 text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-gray-600'}`}
              >
                Appointments List ({allAppointmentsList.length})
              </button>
              <button
                onClick={() => { setActiveTab('orders'); setSearchTerm(''); }}
                className={`px-4 py-2 text-xs uppercase tracking-wider transition-all font-semibold cursor-pointer ${activeTab === 'orders' ? 'bg-gold-950 text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-gray-600'}`}
              >
                Orders Directory ({allOrdersList.length})
              </button>
              <button
                onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
                className={`px-4 py-2 text-xs uppercase tracking-wider transition-all font-semibold cursor-pointer ${activeTab === 'users' ? 'bg-gold-950 text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-gray-600'}`}
              >
                Patrons Registry ({allUsersList.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 font-sans text-xs focus:outline-none focus:border-gold-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto" id="admin-users-table">
              <table className="w-full text-left text-xs divide-y divide-gray-100 font-sans">
                <thead>
                  <tr className="text-gray-400 uppercase tracking-widest font-bold bg-neutral-50">
                    <th className="py-3 px-4 font-serif text-gold-900">Name</th>
                    <th className="py-3 px-4 font-serif text-gold-900">Email Address</th>
                    <th className="py-3 px-4 font-serif text-gold-900">Contact Number</th>
                    <th className="py-3 px-4 font-serif text-gold-900">Saved Mansions</th>
                    <th className="py-3 px-4 font-serif text-gold-900 text-center">Privileges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filterList<User>(allUsersList).map((usr) => (
                    <tr key={usr.uid || usr.email} className="hover:bg-neutral-50/50">
                      <td className="py-3.5 px-4 font-serif font-bold text-gold-950">{usr.name}</td>
                      <td className="py-3.5 px-4 font-mono font-medium text-gray-600">{usr.email}</td>
                      <td className="py-3.5 px-4 text-gray-700">{usr.phone || 'None Provided'}</td>
                      <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate" title={usr.savedAddresses?.join(' | ')}>
                        {usr.savedAddresses?.length || 0} Saved addresses
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {usr.isAdmin ? (
                          <span className="px-2 py-0.5 bg-gold-950 text-gold-300 font-serif font-semibold text-[9px] uppercase tracking-wider">
                            Executive Director
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] uppercase tracking-wider">
                            Patron Client
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filterList(allUsersList).length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">No patrons found matching search criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-4" id="admin-appointments-list">
              {filterList<Appointment>(allAppointmentsList).map((apt) => (
                <div key={apt.id} className="border border-gold-200 p-5 bg-white space-y-4 shadow-sm hover:border-gold-400 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-gold-50 text-gold-900 border border-gold-200 font-serif text-[10px] uppercase font-bold tracking-widest">
                          {apt.type}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {apt.id}</span>
                      </div>
                      <p className="font-serif text-sm font-bold text-gold-950">
                        Patron: {apt.name} <span className="text-xs font-sans text-gray-400 font-light">({apt.email})</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status selectors */}
                      <span className="text-[10px] uppercase text-gray-400 tracking-wider font-semibold">Change Status:</span>
                      <select
                        className="px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-wider border border-gray-300 bg-white"
                        value={apt.status || 'Scheduled'}
                        onChange={(e) => handleUpdateAptStatus(apt.id, e.target.value as any)}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600 font-sans">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gold-700" />
                      <span>{apt.date} at {apt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold-700" />
                      <span className="truncate">{apt.location}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <Clock3 className="w-4 h-4 text-gold-700" />
                      <span>Phone: {apt.phone}</span>
                    </div>
                  </div>

                  {apt.notes && (
                    <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs text-gray-500 font-light">
                      <strong className="text-gray-700 uppercase tracking-widest text-[9px] block mb-1">Patron Requirements:</strong>
                      {apt.notes}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 text-[10px] uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setEditingApt(apt);
                        setEditDate(apt.date);
                        setEditTime(apt.time);
                      }}
                      className="px-3.5 py-1.5 bg-gold-950 text-white hover:bg-gold-800 transition-colors cursor-pointer font-bold"
                    >
                      Reschedule Appointment
                    </button>
                    {apt.status !== 'Completed' && (
                      <button
                        onClick={() => handleUpdateAptStatus(apt.id, 'Completed')}
                        className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer font-semibold"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filterList<Appointment>(allAppointmentsList).length === 0 && (
                <p className="text-center py-12 text-gray-400">No scheduled showroom bookings registered.</p>
              )}
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4" id="admin-orders-list">
              {filterList<Order>(allOrdersList).map((ord) => (
                <div key={ord.id} className="border border-gold-200 p-5 bg-white space-y-4 shadow-sm hover:border-gold-400 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <p className="font-serif text-sm font-bold text-gold-950">
                        Order ID: {ord.id} <span className="text-xs font-sans text-gray-400 font-light">({ord.shippingAddress.fullName})</span>
                      </p>
                      <span className="text-[10px] text-gray-400 font-sans block">Placed: {ord.date} • Tracking: {ord.trackingNumber}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase text-gray-400 tracking-wider font-semibold">Order Journey State:</span>
                      <select
                        className="px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-wider border border-gray-300 bg-white"
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Crafting">Crafting</option>
                        <option value="Hallmarked">Hallmarked</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-2.5 bg-neutral-50 p-3 border border-neutral-200 text-xs">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-gray-700">
                        <div>
                          <span className="font-serif font-bold text-gold-950">{it.product.name}</span>
                          <span className="text-[10px] text-gray-400 ml-2">Qty: {it.quantity} • Size: {it.selectedSize || 'N/A'}</span>
                        </div>
                        <span className="font-bold text-gold-950">${it.product.price * it.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2 font-bold font-serif text-gold-900">
                      <span>Total Revenue Recieved</span>
                      <span>${ord.totalAmount}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    <p className="font-semibold text-gray-700 uppercase tracking-widest text-[9px] mb-1">Dispatch Mansion Address:</p>
                    <p className="font-sans leading-relaxed">{ord.shippingAddress.addressLine}, {ord.shippingAddress.city}, {ord.shippingAddress.postalCode}</p>
                    <p className="font-mono mt-1 text-[10px] text-gray-400">Recipient Contact: {ord.shippingAddress.phone} | Email: {ord.shippingAddress.email}</p>
                  </div>
                </div>
              ))}
              {filterList<Order>(allOrdersList).length === 0 && (
                <p className="text-center py-12 text-gray-400">No patron purchases or custom design inquiries recorded.</p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* RESCHEDULE MODAL */}
      <AnimatePresence>
        {editingApt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-sm w-full border border-gold-300 shadow-2xl relative"
            >
              <button
                onClick={() => setEditingApt(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gold-800 p-1.5 animate-pulse"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-4">
                <div className="text-center pb-2">
                  <Calendar className="w-6 h-6 text-gold-600 mx-auto mb-2" />
                  <h3 className="font-serif text-lg font-bold text-gold-950 uppercase tracking-wider">Showroom Reschedule</h3>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Adjust Booking Calendar</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">New Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 font-sans text-xs focus:outline-none focus:border-gold-500"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">New Slot</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 bg-white font-sans text-xs focus:outline-none"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
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
                    onClick={() => setEditingApt(null)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-500 text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-gold-950 text-white text-xs uppercase tracking-wider hover:bg-gold-800"
                  >
                    Apply Reschedule
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
