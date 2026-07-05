import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { CartItem, Order, ShippingAddress } from '../types';
import {
  ShieldCheck,
  CreditCard,
  MapPin,
  Truck,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Plus,
  KeyRound,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
  onNav: (page: string) => void;
}

export default function CheckoutPage({
  cartItems,
  onClearCart,
  onOrderPlaced,
  onNav
}: CheckoutPageProps) {
  const { userData, login, signup, addSavedAddress, createOrder } = useAuth();

  // Inline auth state (if not logged in)
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [authError, setAuthError] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isRegSuccess, setIsRegSuccess] = useState(false);

  // Shipping details state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    email: ''
  });

  const [useSavedAddressIdx, setUseSavedAddressIdx] = useState<number>(-1);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card' | 'Bank'>('COD');
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Sync shipping address fields with user profile if logged in
  useEffect(() => {
    if (userData) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: prev.fullName || userData.name || '',
        email: prev.email || userData.email || '',
        phone: prev.phone || userData.phone || ''
      }));
    }
  }, [userData]);

  // Handle saved address selection
  const handleSelectSavedAddress = (addrString: string, idx: number) => {
    setUseSavedAddressIdx(idx);
    // Parse simplified address string: "FullName, AddressLine, City, PostalCode, State, Country, Phone, Email"
    const parts = addrString.split(',').map(p => p.trim());
    if (parts.length >= 6) {
      setShippingAddress({
        fullName: parts[0] || userData?.name || '',
        addressLine: parts[1] || '',
        city: parts[2] || '',
        state: parts[4] || '',
        postalCode: parts[3] || '',
        country: parts[5] || 'India',
        phone: parts[6] || userData?.phone || '',
        email: parts[7] || userData?.email || ''
      });
    }
  };

  const handleInlineAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthSubmitting(true);
    
    try {
      if (isRegistering) {
        if (!authForm.name.trim()) {
          setAuthError('Patron name is required.');
          setIsAuthSubmitting(false);
          return;
        }
        if (authForm.name.trim().length < 3) {
          setAuthError('Patron name must be at least 3 characters.');
          setIsAuthSubmitting(false);
          return;
        }
        if (!authForm.email) {
          setAuthError('Email address is required.');
          setIsAuthSubmitting(false);
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(authForm.email)) {
          setAuthError('Please enter a valid email address.');
          setIsAuthSubmitting(false);
          return;
        }
        if (!authForm.phone.trim()) {
          setAuthError('Mobile number is required.');
          setIsAuthSubmitting(false);
          return;
        }
        const cleanPhone = authForm.phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
          setAuthError('Please enter a valid mobile number (at least 10 digits).');
          setIsAuthSubmitting(false);
          return;
        }
        if (!authForm.password) {
          setAuthError('Secure pin is required.');
          setIsAuthSubmitting(false);
          return;
        }
        if (authForm.password.length < 6) {
          setAuthError('Secure pin must be at least 6 characters.');
          setIsAuthSubmitting(false);
          return;
        }

        await signup(authForm.email, authForm.password, authForm.name, authForm.phone);
        setIsRegSuccess(true);
        // Automatically proceed after 2 seconds
        setTimeout(() => {
          setIsRegSuccess(false);
          setIsAuthSubmitting(false);
        }, 2000);
      } else {
        if (!authForm.email || !authForm.password) {
          setAuthError('Please enter both email and secure pin.');
          setIsAuthSubmitting(false);
          return;
        }
        await login(authForm.email, authForm.password);
        setIsAuthSubmitting(false);
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'Authentication error. Please verify your entries.';
      if (errMsg.includes('auth/email-already-in-use')) {
        errMsg = 'This email is already registered as a premium patron.';
      } else if (errMsg.includes('auth/weak-password')) {
        errMsg = 'Secure pin must be at least 6 characters.';
      } else if (errMsg.includes('auth/invalid-credential')) {
        errMsg = 'Invalid email address or passcode.';
      } else if (errMsg.includes('Firestore Error')) {
        try {
          const parsed = JSON.parse(errMsg);
          if (parsed.error) errMsg = parsed.error;
        } catch (e) {}
      }
      setAuthError(errMsg);
      setIsAuthSubmitting(false);
    }
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const goldHallmarkingFee = subtotal > 0 ? 150 : 0; // standard custom inspection fee
  const standardShipping = 0; // complimentary insured courier for luxury assets
  const totalAmount = subtotal + goldHallmarkingFee + standardShipping;

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    setCheckoutError('');
    setIsSubmitting(true);

    if (
      !shippingAddress.fullName ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone ||
      !shippingAddress.email
    ) {
      setCheckoutError('Please provide complete shipping coordinates.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Optionally save address to profile if checked
      if (saveToProfile && useSavedAddressIdx === -1) {
        const addressString = `${shippingAddress.fullName}, ${shippingAddress.addressLine}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.state}, ${shippingAddress.country}, ${shippingAddress.phone}, ${shippingAddress.email}`;
        await addSavedAddress(addressString);
      }

      // 2. Prepare Order Object
      const orderPayload = {
        items: cartItems,
        totalAmount,
        shippingAddress,
        paymentDetails: {
          method: paymentMethod,
          status: paymentMethod === 'COD' ? 'Pending' : 'Completed'
        }
      };

      // 3. Save order to Firestore
      const savedOrder = await createOrder(orderPayload);
      
      // 4. Clear cart & trigger success callback
      onClearCart();
      setIsSubmitting(false);
      onOrderPlaced(savedOrder);
    } catch (err: any) {
      console.error(err);
      setCheckoutError(err.message || 'Could not verify premium payment. Please contact showroom desk.');
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-4 text-center" id="checkout-empty">
        <ShoppingBag className="w-12 h-12 text-gold-300 mb-4" />
        <h3 className="font-serif text-2xl text-gold-950 font-bold uppercase tracking-wider mb-2">Vault is Empty</h3>
        <p className="text-xs text-gray-500 max-w-xs mb-6 leading-relaxed">You must select fine jewelry to reserve or checkout from our collection directory.</p>
        <button
          onClick={() => onNav('products')}
          className="px-6 py-2.5 bg-gold-950 hover:bg-gold-800 text-white uppercase text-xs tracking-widest font-serif transition-colors"
        >
          Explore Jewels
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50/50 min-h-screen py-12 text-gray-800 font-sans" id="checkout-page-root">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left / Central Info: 8 Columns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gold-200/80 p-6 md:p-8 space-y-6 shadow-sm">
            
            {/* Header */}
            <div>
              <span className="font-sans text-[10px] text-gold-600 font-semibold tracking-widest uppercase block mb-1">Aura Order checkout</span>
              <h1 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold uppercase tracking-wide">Insured Carriage Delivery</h1>
              <div className="h-0.5 w-12 bg-gold-400 mt-2.5" />
            </div>

            {/* CASE 1: NOT LOGGED IN INLINE PORTAL */}
            {!userData ? (
              <div className="border border-gold-200 bg-gold-50/15 p-5 md:p-6 space-y-4" id="inline-auth">
                {isRegSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center border border-gold-300 mx-auto animate-bounce">
                      <Sparkles className="w-6 h-6 text-gold-600 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg text-gold-950 font-bold uppercase tracking-wide">Account Registered!</h3>
                      <p className="text-xs text-gray-500">
                        Welcome to Uday Jewellers. Accessing checkout panel...
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2 text-gold-900 font-serif font-bold uppercase tracking-wide">
                      <KeyRound className="w-4 h-4 text-gold-600" />
                      <span>{isRegistering ? 'Patron Registration' : 'Patron Verification Needed'}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {isRegistering 
                        ? 'Join Uday Jewellers to experience complimentary insured shipping, VIP privileges, and order tracking.' 
                        : 'To complete purchases, arrange insured shipments, and review active lifetime history, register your premium patron record first.'}
                    </p>

                    {authError && (
                      <p className="text-red-500 text-xs text-center mb-4 bg-red-50 p-2 border border-red-200">
                        {authError}
                      </p>
                    )}

                    <form onSubmit={handleInlineAuthSubmit} className="space-y-4 text-xs">
                      {isRegistering && (
                        <div>
                          <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Patron Username</label>
                          <input
                            type="text"
                            required
                            disabled={isAuthSubmitting}
                            className="w-full px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:border-gold-500 disabled:opacity-55 font-sans"
                            placeholder="e.g. Maharani Devika"
                            value={authForm.name}
                            onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Email Address</label>
                          <input
                            type="email"
                            required
                            disabled={isAuthSubmitting}
                            className="w-full px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:border-gold-500 disabled:opacity-55 font-sans"
                            placeholder="patron@gmail.com"
                            value={authForm.email}
                            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                          />
                        </div>
                        {isRegistering ? (
                          <div>
                            <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Mobile Number</label>
                            <input
                              type="tel"
                              required
                              disabled={isAuthSubmitting}
                              className="w-full px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:border-gold-500 disabled:opacity-55 font-sans"
                              placeholder="+91 75587 95959"
                              value={authForm.phone}
                              onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Secure Pin (Password)</label>
                            <input
                              type="password"
                              required
                              disabled={isAuthSubmitting}
                              className="w-full px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:border-gold-500 disabled:opacity-55 font-sans"
                              placeholder="••••••••"
                              value={authForm.password}
                              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                            />
                          </div>
                        )}
                      </div>

                      {isRegistering && (
                        <div>
                          <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Secure Pin (Password)</label>
                          <input
                            type="password"
                            required
                            disabled={isAuthSubmitting}
                            className="w-full px-3 py-2 border border-gray-200 bg-white focus:outline-none focus:border-gold-500 disabled:opacity-55 font-sans"
                            placeholder="••••••••"
                            value={authForm.password}
                            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isAuthSubmitting}
                        className="w-full py-2.5 bg-gold-950 hover:bg-gold-800 disabled:bg-gold-950/75 disabled:cursor-not-allowed text-white font-serif tracking-widest uppercase text-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
                      >
                        {isAuthSubmitting && (
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}
                        {isAuthSubmitting
                          ? 'Processing...'
                          : isRegistering
                          ? 'Register & Continue Checkout'
                          : 'Authenticate Entry'}
                      </button>
                    </form>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        disabled={isAuthSubmitting}
                        onClick={() => {
                          setIsRegistering(!isRegistering);
                          setAuthError('');
                        }}
                        className="text-gold-700 hover:underline hover:text-gold-900 text-[11px] disabled:opacity-50"
                      >
                        {isRegistering ? 'Already have an account? Log In' : "New patron? Sign up for secure checkout"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // CASE 2: LOGGED IN PATRON SHIPPING FORM
              <form onSubmit={handlePlaceOrderSubmit} className="space-y-6" id="shipping-mansion-form">
                
                {/* Saved Address Section */}
                {userData.savedAddresses && userData.savedAddresses.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold tracking-wider text-gray-500">Insured Delivery Mansions</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userData.savedAddresses.map((addr, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectSavedAddress(addr, idx)}
                          className={`p-3.5 border text-xs cursor-pointer transition-all ${useSavedAddressIdx === idx ? 'border-gold-600 bg-gold-50/20' : 'border-gray-200 hover:border-gold-300'}`}
                        >
                          <div className="flex items-center gap-1.5 font-bold font-serif text-gold-950 mb-1">
                            <Home className="w-3.5 h-3.5 text-gold-600" />
                            <span>Address #{idx + 1}</span>
                          </div>
                          <p className="text-gray-500 line-clamp-2">{addr}</p>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          setUseSavedAddressIdx(-1);
                          setShippingAddress({
                            fullName: userData.name || '',
                            addressLine: '',
                            city: '',
                            state: '',
                            postalCode: '',
                            country: 'India',
                            phone: userData.phone || '',
                            email: userData.email || ''
                          });
                        }}
                        className={`p-3.5 border border-dashed text-xs flex flex-col items-center justify-center cursor-pointer transition-all ${useSavedAddressIdx === -1 ? 'border-gold-500 bg-gold-50/10' : 'border-gray-200 hover:border-gold-300'}`}
                      >
                        <Plus className="w-4 h-4 text-gold-600 mb-1" />
                        <span className="font-semibold text-gold-900">Custom Address</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping input coordinates */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase font-bold tracking-widest text-gold-900 border-b border-gray-100 pb-1">Insured Shipping Address</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1 tracking-wider">Recipient Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-200 bg-white font-sans text-xs focus:outline-none focus:border-gold-500"
                      placeholder="e.g. Maharani Devika"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1 tracking-wider">Mansion details (Street / Plot / Floor)</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-200 bg-white font-sans text-xs focus:outline-none focus:border-gold-500"
                      placeholder="e.g. Bajaj Complex, Samarth Nagar, Shivaji Chowk"
                      value={shippingAddress.addressLine}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1 tracking-wider">City</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-200 bg-white font-sans text-xs focus:outline-none focus:border-gold-500"
                        placeholder="Majalgaon"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1 tracking-wider">Postal Pin Code</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-200 bg-white font-sans text-xs focus:outline-none focus:border-gold-500"
                        placeholder="431131"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1 tracking-wider">State</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-200 bg-white font-sans text-xs focus:outline-none focus:border-gold-500"
                        placeholder="Maharashtra"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1 tracking-wider">Country</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-200 bg-white font-sans text-xs focus:outline-none focus:border-gold-500"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1 tracking-wider">Insured Phone Number</label>
                      <input
                        type="tel"
                        required
                        className="w-full px-3 py-2 border border-gray-200 bg-white font-sans text-xs focus:outline-none focus:border-gold-500"
                        placeholder="+91 75587 95959"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1 tracking-wider">Dispatch Notification Email</label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-gray-200 bg-white font-sans text-xs focus:outline-none focus:border-gold-500"
                        placeholder="info@udayjewellers.com"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {useSavedAddressIdx === -1 && (
                    <label className="flex items-center gap-2 mt-2 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveToProfile}
                        onChange={(e) => setSaveToProfile(e.target.checked)}
                        className="accent-gold-600"
                      />
                      <span className="text-[11px] text-gray-500">Save this address to my luxury patron list</span>
                    </label>
                  )}
                </div>

                {/* Payment Selection */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs uppercase font-bold tracking-widest text-gold-900 border-b border-gray-100 pb-1">Premium Appraisal Payment Method</h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-3.5 border text-center cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-gold-600 bg-gold-50/20' : 'border-gray-200 hover:border-gold-300'}`}
                    >
                      <Truck className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                      <p className="font-serif font-bold text-gold-950 text-[10px] uppercase">Cash/Gold COD</p>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('Card')}
                      className={`p-3.5 border text-center cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-gold-600 bg-gold-50/20' : 'border-gray-200 hover:border-gold-300'}`}
                    >
                      <CreditCard className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                      <p className="font-serif font-bold text-gold-950 text-[10px] uppercase">Insured Card</p>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('Bank')}
                      className={`p-3.5 border text-center cursor-pointer transition-all ${paymentMethod === 'Bank' ? 'border-gold-600 bg-gold-50/20' : 'border-gray-200 hover:border-gold-300'}`}
                    >
                      <ShieldCheck className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                      <p className="font-serif font-bold text-gold-950 text-[10px] uppercase">RTGS/UPI Bank</p>
                    </div>
                  </div>

                  {paymentMethod === 'Card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-neutral-50 border border-neutral-200 space-y-3"
                    >
                      <p className="text-[10px] uppercase text-gold-800 tracking-wider font-semibold">Insured Card Verification Entry</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Card Number"
                            className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none"
                            value={cardForm.number}
                            onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Expiry MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none"
                            value={cardForm.expiry}
                            onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                          />
                        </div>
                        <div>
                          <input
                            type="password"
                            placeholder="CVV"
                            className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none"
                            value={cardForm.cvv}
                            onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'Bank' && (
                    <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs text-gray-500 space-y-1.5">
                      <p className="font-serif font-bold text-gold-950">Uday Jewellers RTGS Wire Coordinates:</p>
                      <p><strong>Bank:</strong> State Bank of India</p>
                      <p><strong>Account Name:</strong> Uday Jewellers Private Limited</p>
                      <p><strong>IFSC:</strong> SBIN0000305</p>
                      <p><strong>Branch:</strong> Majalgaon, Beed</p>
                    </div>
                  )}
                </div>

                {checkoutError && (
                  <p className="text-red-500 text-xs text-center bg-red-50 p-2 border border-red-200">
                    {checkoutError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gold-950 hover:bg-gold-800 text-white font-serif tracking-widest text-xs uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Registering Order with Vault...</span>
                  ) : (
                    <>
                      <span>Place My Order (${totalAmount.toLocaleString()})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>

        {/* Right Info: Cart Summary (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gold-200/80 p-6 md:p-8 space-y-6 shadow-sm sticky top-28">
            <h3 className="font-serif text-lg font-bold text-gold-950 uppercase tracking-wider border-b border-gray-100 pb-2">Fine Asset Summary</h3>

            {/* Cart Items list */}
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto space-y-3.5 pr-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 pt-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-gold-950 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-gray-400 font-sans mt-0.5">Qty: {item.quantity} • Size: {item.selectedSize || 'N/A'}</p>
                  </div>
                  <span className="font-serif font-bold text-gold-900">${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Price lines */}
            <div className="space-y-2 border-t border-gray-100 pt-4 text-xs font-sans text-gray-600">
              <div className="flex justify-between">
                <span>Fine Assets Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Gold Hallmarking & Appraisal Fees</span>
                <span>${goldHallmarkingFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Armored Carriage</span>
                <span className="text-emerald-700 uppercase font-bold tracking-widest text-[9px]">Complimentary</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-bold font-serif text-gold-950">
                <span>Total Appraisal Price</span>
                <span>${totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-gold-50/45 p-4 border border-gold-100/50 space-y-2 text-[11px] text-gold-900 leading-relaxed font-sans">
              <div className="flex items-center gap-1.5 font-bold font-serif uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>Uday Jewellers Trust Seal</span>
              </div>
              <p className="font-light">
                Every shipment of pure 22K/24K fine jewelry leaves our showroom hallmarked, securely sealed, and 100% transit-insured under Mr. Uday Shivaji Narwade's direct supervision.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
