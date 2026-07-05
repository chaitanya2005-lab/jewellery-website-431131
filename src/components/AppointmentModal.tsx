import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Appointment } from '../types';
import { useAuth } from '../lib/auth-context';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedType?: 'Bridal Consultation' | 'Bespoke Design' | 'Gold Valuation';
}

export default function AppointmentModal({ isOpen, onClose, preselectedType = 'Bridal Consultation' }: AppointmentModalProps) {
  const { userData, bookAppointment } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    type: preselectedType,
    location: 'Uday Jewellers Showroom - Majalgaon',
    notes: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Prefill when userData is available or changed
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || userData.name || '',
        email: prev.email || userData.email || '',
        phone: prev.phone || userData.phone || ''
      }));
    }
  }, [userData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await bookAppointment({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        location: formData.location,
        notes: formData.notes
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
          name: userData?.name || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          date: '',
          time: '',
          type: preselectedType,
          location: 'Uday Jewellers Showroom - Majalgaon',
          notes: ''
        });
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'We could not log this appointment session. Please verify your internet connection.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm pt-20 pb-12 sm:py-8" id="appointment-modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="my-auto relative w-full max-w-lg bg-white overflow-hidden rounded-none border border-gold-300 shadow-2xl"
            id="appointment-modal-container"
          >
            {/* Top gold bar */}
            <div className="h-1.5 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 w-full" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gold-600 transition-colors"
              id="close-appointment-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[400px]"
                id="appointment-success"
              >
                <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center border border-gold-300 mb-4 animate-bounce">
                  <CheckCircle className="w-8 h-8 text-gold-600" />
                </div>
                <h3 className="font-serif text-2xl text-gold-900 tracking-wide mb-2">Bespoke Rendezvous Confirmed</h3>
                <p className="text-sm text-gray-600 max-w-sm mb-4">
                  We are delighted to host you. A luxury relationship manager from Uday Jewellers has been assigned to you and will reach out within 2 hours.
                </p>
                <div className="p-4 bg-gold-50 border border-gold-100 w-full text-left rounded-sm font-sans text-xs space-y-1.5 text-gold-900">
                  <p><strong>Boutique:</strong> {formData.location}</p>
                  <p><strong>Date & Time:</strong> {formData.date} at {formData.time}</p>
                  <p><strong>Consultation:</strong> {formData.type}</p>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <Sparkles className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                  <h3 className="font-serif text-2xl text-gold-900 tracking-wide">Privé Showcase Appointment</h3>
                  <p className="font-sans text-xs text-gray-500 mt-1 uppercase tracking-widest">Experience Jewelry in Absolute Royalty</p>
                </div>

                {submitError && (
                  <p className="text-red-500 text-xs text-center mb-4 bg-red-50 p-2 border border-red-200">
                    {submitError}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharani Gayatri Devi"
                      className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@luxury.com"
                        className="w-full px-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Select Experience</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 bg-white font-sans text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                      value={formData.type}
                      onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Bridal Consultation">Bridal Consultation (Trousseau Styling)</option>
                      <option value="Bespoke Design">Bespoke Jewellery Designing (Sketch & Craft)</option>
                      <option value="Gold Valuation">Durable Gold Exchange & Valuation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Showroom Location</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 bg-white font-sans text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    >
                      <option value="Uday Jewellers Showroom - Majalgaon">Uday Jewellers Showroom - Majalgaon</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 font-sans text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Preferable Slot</label>
                      <div className="relative">
                        <select
                          required
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 bg-white font-sans text-sm focus:outline-none focus:border-gold-500"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        >
                          <option value="">Select Slot</option>
                          <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Morning)</option>
                          <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                          <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM (Evening)</option>
                        </select>
                        <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Special Preferences (Optional)</label>
                    <textarea
                      placeholder="e.g. Interested in custom emerald carvings or temple neckwear sets"
                      className="w-full px-3 py-2 border border-gray-300 font-sans text-sm h-16 resize-none focus:outline-none focus:border-gold-500"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gold-900 text-white font-serif tracking-widest text-sm hover:bg-gold-800 transition-all uppercase mt-2 border border-gold-600 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Reserve My Private Access</span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
