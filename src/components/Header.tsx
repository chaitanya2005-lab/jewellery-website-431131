import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, LogOut, MapPin, Phone, HelpCircle, KeyRound, Sparkles, Menu, X, Globe, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, User as UserType } from '../types';
import { products } from '../data/products';
import { useAuth } from '../lib/auth-context';

interface HeaderProps {
  onNav: (page: string) => void;
  currentPage: string;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSearchSelect: (product: Product) => void;
  onOpenAppointment: () => void;
}

export default function Header({
  onNav,
  currentPage,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onSearchSelect,
  onOpenAppointment
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth States
  const { userData, login, signup, resetPassword, logout } = useAuth();
  const user = userData || { email: '', name: '', isLoggedIn: false };

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [authError, setAuthError] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isRegSuccess, setIsRegSuccess] = useState(false);

  // Sync Search Query
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = products.filter(
        p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setResetSuccessMessage('');
    
    if (isForgotPassword) {
      if (!authForm.email) {
        setAuthError('Please enter your email to reset password.');
        return;
      }
      setIsAuthSubmitting(true);
      try {
        await resetPassword(authForm.email);
        setResetSuccessMessage('A password reset link has been dispatched to your premium email.');
      } catch (err: any) {
        setAuthError(err.message || 'Failed to dispatch reset email.');
      } finally {
        setIsAuthSubmitting(false);
      }
      return;
    }

    if (isRegistering) {
      if (!authForm.name.trim()) {
        setAuthError('Premium username/name is required.');
        return;
      }
      if (authForm.name.trim().length < 3) {
        setAuthError('Premium username must be at least 3 characters.');
        return;
      }
      if (!authForm.email) {
        setAuthError('Patron email address is required.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(authForm.email)) {
        setAuthError('Please enter a valid email address.');
        return;
      }
      if (!authForm.phone.trim()) {
        setAuthError('Phone number is required for custom order verification.');
        return;
      }
      const cleanPhone = authForm.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setAuthError('Please enter a valid phone number (at least 10 digits).');
        return;
      }
      if (!authForm.password) {
        setAuthError('Secure pin code is required.');
        return;
      }
      if (authForm.password.length < 6) {
        setAuthError('Secure pin code must be at least 6 characters.');
        return;
      }

      setIsAuthSubmitting(true);
      try {
        await signup(authForm.email, authForm.password, authForm.name, authForm.phone);
        setIsRegSuccess(true);
        setTimeout(() => {
          setIsAuthOpen(false);
          setIsRegSuccess(false);
          setIsRegistering(false);
          setAuthForm({ name: '', email: '', password: '', phone: '' });
          setIsAuthSubmitting(false);
          onNav('dashboard');
        }, 2500);
      } catch (err: any) {
        console.error(err);
        let errMsg = err.message || 'Registration failed.';
        if (errMsg.includes('auth/email-already-in-use')) {
          errMsg = 'This email is already registered as a premium patron.';
        } else if (errMsg.includes('auth/weak-password')) {
          errMsg = 'Secure pin code must be at least 6 characters.';
        } else if (errMsg.includes('Firestore Error')) {
          try {
            const parsed = JSON.parse(errMsg);
            if (parsed.error) errMsg = parsed.error;
          } catch (e) {}
        }
        setAuthError(errMsg);
        setIsAuthSubmitting(false);
      }
    } else {
      if (!authForm.email || !authForm.password) {
        setAuthError('Please enter your email and secure pin code.');
        return;
      }
      setIsAuthSubmitting(true);
      try {
        await login(authForm.email, authForm.password);
        setIsAuthOpen(false);
        setAuthForm({ name: '', email: '', password: '', phone: '' });
        setAuthError('');
      } catch (err: any) {
        console.error(err);
        let errMsg = err.message || 'Authentication failed.';
        if (errMsg.includes('auth/invalid-credential') || errMsg.includes('auth/user-not-found') || errMsg.includes('auth/wrong-password')) {
          errMsg = 'Invalid email address or passcode.';
        } else if (errMsg.includes('Firestore Error')) {
          try {
            const parsed = JSON.parse(errMsg);
            if (parsed.error) errMsg = parsed.error;
          } catch (e) {}
        }
        setAuthError(errMsg);
      } finally {
        setIsAuthSubmitting(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNav('home');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchClick = (product: Product) => {
    onSearchSelect(product);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Collections', id: 'collections' },
    { label: 'Products', id: 'products' },
    { label: 'Bridal Collection', id: 'bridal' },
    { label: 'Custom Design', id: 'custom' },
    { label: 'Store Locator', id: 'stores' },
    { label: 'About Us', id: 'about' },
    { label: 'Contact Us', id: 'contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-gold-50/95 backdrop-blur-md border-b border-gold-500/20 font-sans shadow-xs" id="brand-header">
      
      {/* 1. TOP ANNOUNCEMENT BAR & GOLD RATE */}
      <div className="bg-gold-950 text-gold-100 text-[10px] md:text-xs py-2.5 px-4 flex flex-col md:flex-row justify-between items-center gap-1.5 md:gap-4 border-b border-gold-800">
        <div className="flex items-center gap-1.5 text-gold-200">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider">Live Gold Rates today:</span>
          <span>24K (99.9%): <strong>$84.50/g</strong></span>
          <span className="text-gold-400">|</span>
          <span>22K (91.6%): <strong>$78.20/g</strong></span>
        </div>
        
        <div className="flex items-center gap-4 text-gold-300">
          <button 
            onClick={() => onNav('stores')}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Showroom Locator</span>
          </button>
          <span>•</span>
          <button 
            onClick={onOpenAppointment}
            className="hover:text-white transition-colors flex items-center gap-1.5 text-gold-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-medium">Book VIP Boutique Experience</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN LOGO & ACTION BAR */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        
        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 border border-gold-200 text-gold-900 hover:bg-gold-50"
          id="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo - Centered / Left */}
        <div 
          onClick={() => onNav('home')} 
          className="cursor-pointer text-center md:text-left flex flex-col items-center md:items-start select-none group"
          id="brand-logo"
        >
          <span className="font-serif text-2xl md:text-3xl font-extrabold tracking-tighter text-gold-500 leading-none group-hover:text-gold-600 transition-colors uppercase">
            UDAY
          </span>
          <span className="font-sans text-[9px] tracking-[0.5em] text-gold-950/70 uppercase font-medium mt-1">
            JEWELLERS
          </span>
          <span className="font-serif italic text-[9px] md:text-[10px] text-gold-600/90 mt-1.5 tracking-wide text-center md:text-left">
            A Legacy by Uday Shivajirav Narwade
          </span>
        </div>

        {/* Advanced Live Search Bar */}
        <div className="hidden md:block relative flex-1 max-w-md mx-6" id="header-search-container">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Gold necklaces, Diamond rings, Bridal wear..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 font-sans text-xs focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-gray-50/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Real-time search dropdown overlay */}
          <AnimatePresence>
            {isSearchFocused && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-1.5 bg-white border border-gold-200 shadow-2xl z-50 divide-y divide-gray-100"
                id="search-results-dropdown"
              >
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSearchClick(p)}
                    className="flex items-center gap-3 p-3 hover:bg-gold-50/50 cursor-pointer transition-colors"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover border border-gray-100" referrerPolicy="no-referrer" />
                    <div className="text-left min-w-0">
                      <p className="text-xs font-serif text-gold-950 font-medium truncate">{p.name}</p>
                      <p className="text-[10px] text-gold-600 font-medium">{p.category} • {p.specifications.purity || p.type}</p>
                    </div>
                    <span className="ml-auto font-serif text-xs font-bold text-gold-900">${p.price.toLocaleString()}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Account, Wishlist, & Shopping Bag Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* WhatsApp Quick Chat */}
          <a
            href="https://wa.me/917558795959?text=Hi%20Uday%20Jewellers,%20I%20am%20interested%20in%20arranging%20a%20private%20bridal%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 transition-colors border-r border-gray-200 pr-4 mr-2"
          >
            <Phone className="w-3.5 h-3.5 text-green-500" />
            <span className="font-semibold text-emerald-600">WhatsApp Chat</span>
          </a>

          {/* User Sign-In button */}
          {user.isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNav('dashboard')}
                className="w-8 h-8 rounded-full border border-gold-400 bg-gold-50 hover:bg-gold-100 flex items-center justify-center font-serif text-xs font-bold text-gold-800 cursor-pointer shadow-sm transition-all"
                title={`Logged in as ${user.name}. Click to view Dashboard.`}
                id="header-auth-btn"
              >
                {user.name.substring(0, 2).toUpperCase()}
              </button>
              <span onClick={() => onNav('dashboard')} className="hidden lg:inline text-xs text-gold-950 font-serif font-bold cursor-pointer hover:underline max-w-[80px] truncate">
                {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gold-700 transition-colors cursor-pointer"
                title="Log Out"
                id="logout-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setIsRegistering(false);
                setIsAuthOpen(true);
              }}
              className="p-2 text-gray-700 hover:text-gold-600 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              id="login-modal-trigger"
            >
              <User className="w-4 h-4 text-gold-800" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Wishlist Trigger */}
          <button
            onClick={onOpenWishlist}
            className="p-2 text-gray-700 hover:text-gold-600 relative transition-colors"
            id="wishlist-trigger-btn"
          >
            <Heart className="w-4 h-4 text-gold-800" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full scale-90">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="p-2.5 bg-gold-50 border border-gold-200 hover:bg-gold-950 text-gold-950 hover:text-white transition-all relative"
            id="cart-trigger-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full scale-90 border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. HORIZONTAL MAIN NAVIGATION */}
      <nav className="hidden md:block bg-gold-50/30 border-t border-gold-100/50">
        <ul className="max-w-4xl mx-auto flex justify-center items-center gap-6 lg:gap-8 py-2.5 text-xs font-medium tracking-widest text-gold-950 uppercase">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => onNav(link.id)}
                className={`relative py-1 cursor-pointer transition-all hover:text-gold-600 hover:font-semibold ${currentPage === link.id ? 'text-gold-600 font-semibold border-b-2 border-gold-500' : ''}`}
                id={`nav-${link.id}`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* MOBILE MENU NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gold-200 shadow-2xl z-40 p-4 block md:hidden"
            id="mobile-navigation-dropdown"
          >
            {/* Live Search for mobile */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search gold, diamonds..."
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 text-xs focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />

              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gold-200 z-50 divide-y divide-gray-100 shadow-xl max-h-48 overflow-y-auto">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        handleSearchClick(p);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 p-2 hover:bg-gold-50"
                    >
                      <img src={p.images[0]} className="w-8 h-8 object-cover" />
                      <span className="text-xs font-serif text-gold-950 truncate flex-1 text-left">{p.name}</span>
                      <span className="text-[10px] font-bold text-gold-900">${p.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ul className="space-y-2 text-left font-serif text-sm tracking-widest uppercase divide-y divide-gray-100">
              {navLinks.map((link) => (
                <li key={link.id} className="pt-2">
                  <button
                    onClick={() => {
                      onNav(link.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-1 text-left ${currentPage === link.id ? 'text-gold-600 font-bold' : 'text-gold-950'}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUTHENTICATION OVERLAY */}
      <AnimatePresence>
        {isAuthOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-start sm:items-center p-4 overflow-y-auto pt-20 pb-12 sm:py-8" id="auth-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="my-auto bg-white border border-gold-300 w-full max-w-sm overflow-hidden shadow-2xl relative"
            >
              <div className="h-1 bg-gold-500 w-full" />
              <button
                disabled={isAuthSubmitting}
                onClick={() => {
                  setIsAuthOpen(false);
                  setIsRegSuccess(false);
                  setIsAuthSubmitting(false);
                  setAuthError('');
                  setResetSuccessMessage('');
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-gold-600 cursor-pointer disabled:opacity-50 z-10"
                id="close-auth-btn"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8">
                {isRegSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                    id="registration-success-view"
                  >
                    <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center border border-gold-300 mx-auto animate-bounce">
                      <Sparkles className="w-8 h-8 text-gold-600 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-xl text-gold-950 font-bold uppercase tracking-wider">Welcome, Patron!</h3>
                      <p className="text-xs text-gray-600 px-2 leading-relaxed">
                        Your premium Uday Jewellers patron account has been registered successfully.
                      </p>
                      <p className="text-[10px] text-gold-600 uppercase font-medium tracking-widest animate-pulse pt-2">
                        Redirecting to Aura Portal Dashboard...
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <KeyRound className="w-6 h-6 text-gold-600 mx-auto mb-2" />
                      <h3 className="font-serif text-xl text-gold-950 tracking-wide">
                        {isForgotPassword
                          ? 'Forgot Secret Pin'
                          : isRegistering
                          ? 'Patron Registration'
                          : 'Aura Portal Access'}
                      </h3>
                      <p className="text-[10px] uppercase text-gray-400 tracking-wider mt-1">Uday Jewellers Privé Portal</p>
                    </div>

                    {authError && (
                      <p className="text-red-500 text-xs text-center mb-4 bg-red-50 p-2 border border-red-200">
                        {authError}
                      </p>
                    )}

                    {resetSuccessMessage && (
                      <p className="text-emerald-700 text-xs text-center mb-4 bg-emerald-50 p-2 border border-emerald-200">
                        {resetSuccessMessage}
                      </p>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                      {isRegistering && !isForgotPassword && (
                        <div>
                          <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Premium Username</label>
                          <input
                            type="text"
                            required
                            disabled={isAuthSubmitting}
                            className="w-full px-3 py-2 border border-gray-200 font-sans text-xs focus:outline-none focus:border-gold-500 disabled:opacity-55"
                            placeholder="e.g. Maharani Devika"
                            value={authForm.name}
                            onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Patron Email</label>
                        <input
                          type="email"
                          required
                          disabled={isAuthSubmitting}
                          className="w-full px-3 py-2 border border-gray-200 font-sans text-xs focus:outline-none focus:border-gold-500 disabled:opacity-55"
                          placeholder="patron@gmail.com"
                          value={authForm.email}
                          onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        />
                      </div>

                      {isRegistering && !isForgotPassword && (
                        <div>
                          <label className="block text-gray-600 uppercase font-semibold mb-1 tracking-wider">Phone Number</label>
                          <input
                            type="tel"
                            required
                            disabled={isAuthSubmitting}
                            className="w-full px-3 py-2 border border-gray-200 font-sans text-xs focus:outline-none focus:border-gold-500 disabled:opacity-55"
                            placeholder="+91 75587 95959"
                            value={authForm.phone}
                            onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                          />
                        </div>
                      )}

                      {!isForgotPassword && (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-gray-600 uppercase font-semibold tracking-wider">Secure Pin Code (Password)</label>
                            {!isRegistering && (
                              <button
                                type="button"
                                disabled={isAuthSubmitting}
                                onClick={() => {
                                  setIsForgotPassword(true);
                                  setAuthError('');
                                  setResetSuccessMessage('');
                                }}
                                className="text-gold-700 hover:underline text-[10px] cursor-pointer disabled:opacity-50"
                              >
                                Forgot?
                              </button>
                            )}
                          </div>
                          <input
                            type="password"
                            required
                            disabled={isAuthSubmitting}
                            className="w-full px-3 py-2 border border-gray-200 font-sans text-xs focus:outline-none focus:border-gold-500 disabled:opacity-55"
                            placeholder="••••••••"
                            value={authForm.password}
                            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isAuthSubmitting}
                        className="w-full py-3 bg-gold-950 hover:bg-gold-800 disabled:bg-gold-950/75 disabled:cursor-not-allowed text-white font-serif tracking-widest uppercase text-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
                        id="submit-auth-btn"
                      >
                        {isAuthSubmitting && (
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}
                        {isAuthSubmitting
                          ? 'Processing...'
                          : isForgotPassword
                          ? 'Dispatch Reset Link'
                          : isRegistering
                          ? 'Register Patron Session'
                          : 'Authenticate Entry'}
                      </button>
                    </form>

                    <div className="text-center mt-4 space-y-2">
                      {isForgotPassword ? (
                        <button
                          type="button"
                          disabled={isAuthSubmitting}
                          onClick={() => {
                            setIsForgotPassword(false);
                            setAuthError('');
                            setResetSuccessMessage('');
                          }}
                          className="text-gold-700 hover:underline hover:text-gold-900 text-[11px] cursor-pointer block w-full text-center disabled:opacity-50"
                        >
                          Return to Authentication Gate
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isAuthSubmitting}
                          onClick={() => {
                            setIsRegistering(!isRegistering);
                            setAuthError('');
                            setResetSuccessMessage('');
                          }}
                          className="text-gold-700 hover:underline hover:text-gold-900 text-[11px] cursor-pointer block w-full text-center disabled:opacity-50"
                        >
                          {isRegistering ? 'Already a registered Patron? Log In' : "New to Uday Jewellers? Register Session"}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </header>
  );
}
