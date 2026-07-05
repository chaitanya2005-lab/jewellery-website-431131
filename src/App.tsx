import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, Order } from './types';
import { products, collectionsList } from './data/products';

// Import Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BridalPage from './pages/BridalPage';
import CustomPage from './pages/CustomPage';
import StoreLocatorPage from './pages/StoreLocatorPage';
import ContactPage from './pages/ContactPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProductsPage from './pages/ProductsPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import CheckoutPage from './pages/CheckoutPage';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import AppointmentModal from './components/AppointmentModal';

export default function App() {
  // Navigation
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Drawer & Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // E-commerce core States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // 1. Initial Load: Load cart & wishlist from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('uday_cart');
    const storedWishlist = localStorage.getItem('uday_wishlist');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // 2. Persist state changes helper
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('uday_cart', JSON.stringify(newCart));
  };

  const saveWishlist = (newWishlist: Product[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('uday_wishlist', JSON.stringify(newWishlist));
  };

  // 3. Callback Actions
  const handleAddToCart = (product: Product, quantity = 1, size?: string) => {
    const existingIdx = cart.findIndex(
      item => item.product.id === product.id && item.selectedSize === size
    );

    let newCart = [...cart];
    if (existingIdx > -1) {
      newCart[existingIdx].quantity += quantity;
    } else {
      newCart.push({ product, quantity, selectedSize: size });
    }

    saveCart(newCart);
    setIsCartOpen(true); // Open cart immediately to show feedback!
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const newCart = cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const handleRemoveFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    saveCart(newCart);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  const handleWishlistToggle = (product: Product) => {
    const isSaved = wishlist.some(item => item.id === product.id);
    let newWishlist = [];
    if (isSaved) {
      newWishlist = wishlist.filter(item => item.id !== product.id);
    } else {
      newWishlist = [...wishlist, product];
    }
    saveWishlist(newWishlist);
  };

  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product);

    // Save to recently viewed memory
    const existingRecents: string[] = JSON.parse(localStorage.getItem('uday_recently_viewed') || '[]');
    const filtered = existingRecents.filter(id => id !== product.id);
    const updated = [product.id, ...filtered].slice(0, 8); // Keep last 8 unique
    localStorage.setItem('uday_recently_viewed', JSON.stringify(updated));
  };

  const handleOrderPlaced = (order: Order) => {
    // Route to order tracking immediately
    setCurrentPage('tracking');
    setIsCartOpen(false);
  };

  const handleSearchSelect = (product: Product) => {
    handleViewProductDetails(product);
  };

  // 4. Render correct active view
  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            products={products}
            wishlist={wishlist}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onViewDetails={handleViewProductDetails}
            onOpenAppointment={() => setIsAppointmentOpen(true)}
            onNav={setCurrentPage}
          />
        );

      case 'collections':
        return (
          <div className="bg-white min-h-screen py-16 px-4 max-w-7xl mx-auto" id="collections-directory-page">
            <div className="text-center mb-12">
              <span className="font-sans text-xs text-gold-600 font-semibold tracking-widest uppercase block mb-1">SIGNATURE THEMES</span>
              <h2 className="font-serif text-3xl md:text-4xl text-gold-950 font-bold uppercase tracking-wider">The House Collections</h2>
              <div className="h-0.5 w-16 bg-gold-400 mx-auto mt-3.5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collectionsList.map((col, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden border border-gold-200/50 h-[300px] flex flex-col justify-end p-6 cursor-pointer"
                  onClick={() => {
                    if (col.value === 'Bridal') {
                      setCurrentPage('bridal');
                    } else {
                      localStorage.setItem('uday_filter_collection', col.value);
                      setCurrentPage('products');
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                  <img
                    src={col.image}
                    alt={col.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="relative z-20 text-white space-y-2">
                    <span className="text-[10px] tracking-widest text-gold-300 font-semibold uppercase">Curated Legacy</span>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-gold-50">{col.name}</h3>
                    <p className="text-xs text-gray-200/80 max-w-sm font-light leading-relaxed">{col.desc}</p>
                    <span className="inline-block text-[10px] text-gold-300 group-hover:text-white transition-colors tracking-widest uppercase pt-2 font-bold">
                      Enter Directory →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'products':
        return (
          <ProductsPage
            wishlist={wishlist}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onViewDetails={handleViewProductDetails}
          />
        );

      case 'bridal':
        return <BridalPage onOpenAppointment={() => setIsAppointmentOpen(true)} />;

      case 'custom':
        return <CustomPage onOpenAppointment={() => setIsAppointmentOpen(true)} />;

      case 'stores':
        return <StoreLocatorPage onOpenAppointment={() => setIsAppointmentOpen(true)} />;

      case 'about':
        return <AboutPage />;

      case 'contact':
        return <ContactPage />;

      case 'tracking':
        return <OrderTrackingPage />;

      case 'dashboard':
        return (
          <DashboardPage
            onNav={setCurrentPage}
            onViewProductDetails={handleViewProductDetails}
            onAddToCart={handleAddToCart}
          />
        );

      case 'admin':
        return <AdminPage />;

      case 'checkout':
        return (
          <CheckoutPage
            cartItems={cart}
            onClearCart={handleClearCart}
            onOrderPlaced={handleOrderPlaced}
            onNav={setCurrentPage}
          />
        );

      default:
        return (
          <HomePage
            products={products}
            wishlist={wishlist}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onViewDetails={handleViewProductDetails}
            onOpenAppointment={() => setIsAppointmentOpen(true)}
            onNav={setCurrentPage}
          />
        );
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans">
      
      {/* 1. HEADER (BRAND BAR & GOLD RATES & ACCOUNT PORTAL) */}
      <Header
        onNav={setCurrentPage}
        currentPage={currentPage}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSearchSelect={handleSearchSelect}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
      />

      {/* 2. DYNAMIC MAIN BODY WITH TRANSITIONS */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. TRUST FOOTER & FLOATING WHATSAPP ASSISTANT */}
      <Footer onNav={setCurrentPage} onOpenAppointment={() => setIsAppointmentOpen(true)} />

      {/* 4. MODALS & SLIDE-OUT DRAWERS */}
      
      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        onCheckout={() => setCurrentPage('checkout')}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleWishlistToggle}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Product Detail Modal (Zoom Image Gallery, Appraisal Submission) */}
      <ProductDetailModal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        isWishlisted={selectedProduct ? wishlist.some(item => item.id === selectedProduct.id) : false}
        onWishlistToggle={handleWishlistToggle}
        onAddToCart={handleAddToCart}
      />

      {/* Bridal & Bespoke VIP Appointment Booking Modal */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />

    </div>
  );
}
