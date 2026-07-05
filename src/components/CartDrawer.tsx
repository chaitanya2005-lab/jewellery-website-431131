import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Product, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onOrderPlaced,
  onCheckout
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'completed'>('cart');
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine: '',
    city: '',
    postalCode: ''
  });
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discount = cartItems.reduce((acc, item) => {
    if (item.product.discountPercentage) {
      return acc + ((item.product.price * item.product.discountPercentage / 100) * item.quantity);
    }
    return acc;
  }, 0);
  const tax = (subtotal - discount) * 0.03; // 3% GST on luxury jewelry
  const total = subtotal - discount + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment loading
    setTimeout(() => {
      const trackingNum = 'UDY' + Math.floor(100000 + Math.random() * 900000);
      const newOrder: Order = {
        id: 'ORD_' + Date.now(),
        items: [...cartItems],
        totalAmount: parseFloat(total.toFixed(2)),
        shippingAddress: { ...shippingForm },
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: 'Placed',
        trackingNumber: trackingNum
      };

      // Save order to local storage
      const existingOrders = JSON.parse(localStorage.getItem('uday_orders') || '[]');
      existingOrders.push(newOrder);
      localStorage.setItem('uday_orders', JSON.stringify(existingOrders));

      setPlacedOrder(newOrder);
      setIsProcessing(false);
      setCheckoutStep('completed');
      onOrderPlaced(newOrder);
      onClearCart();
    }, 2500);
  };

  const resetCheckout = () => {
    setCheckoutStep('cart');
    setPlacedOrder(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="cart-drawer-overlay">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10" id="cart-drawer-container">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white flex flex-col h-full shadow-2xl border-l border-gold-200"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gold-50/50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold-700" />
                  <span className="font-serif text-lg tracking-wider text-gold-900 uppercase">My Luxury Bag</span>
                  {cartItems.length > 0 && checkoutStep === 'cart' && (
                    <span className="bg-gold-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gold-600 transition-colors"
                  id="close-cart-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Stepper (Except for Completed step) */}
              {cartItems.length > 0 && checkoutStep !== 'completed' && (
                <div className="bg-gold-50/20 border-b border-gold-100 px-6 py-3 flex justify-between text-[11px] font-medium tracking-wider text-gray-400 uppercase">
                  <span className={checkoutStep === 'cart' ? 'text-gold-700 font-semibold' : 'text-gold-600'}>01 Bag</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  <span className={checkoutStep === 'shipping' ? 'text-gold-700 font-semibold' : checkoutStep === 'payment' ? 'text-gold-600' : 'text-gray-400'}>02 Shipping</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  <span className={checkoutStep === 'payment' ? 'text-gold-700 font-semibold' : 'text-gray-400'}>03 Payment</span>
                </div>
              )}

              {/* Drawer Main Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {checkoutStep === 'cart' && (
                  <>
                    {cartItems.length === 0 ? (
                      <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 rounded-full border border-gold-200 flex items-center justify-center text-gold-400 bg-gold-50/20">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-serif text-lg text-gold-900 font-medium">Your bag is empty</p>
                          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                            Bespoke designs are waiting. Curate your perfect luxury assortment.
                          </p>
                        </div>
                        <button
                          onClick={onClose}
                          className="px-6 py-2.5 bg-gold-900 text-white font-serif text-xs tracking-widest uppercase hover:bg-gold-800 transition-colors"
                        >
                          Explore Masterpieces
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex gap-4 p-3 border border-gray-100 bg-white hover:border-gold-200 transition-colors"
                          >
                            <div className="w-20 h-20 bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <h4 className="font-serif text-sm text-gold-950 font-medium truncate">
                                  {item.product.name}
                                </h4>
                                {item.selectedSize && (
                                  <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                                )}
                                <p className="text-xs text-gold-600 font-medium">Purity: {item.product.specifications.purity}</p>
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border border-gray-200 rounded-none bg-white">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                    className="p-1 px-2 text-gray-500 hover:text-gold-600 transition-colors"
                                    id={`minus-qty-${item.product.id}`}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 text-xs font-medium text-gray-800">{item.quantity}</span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                    className="p-1 px-2 text-gray-500 hover:text-gold-600 transition-colors"
                                    id={`plus-qty-${item.product.id}`}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="font-serif font-semibold text-gold-900 text-sm">
                                    ${(item.product.price * item.quantity).toLocaleString()}
                                  </span>
                                  <button
                                    onClick={() => onRemoveFromCart(item.product.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remove from cart"
                                    id={`remove-cart-${item.product.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {checkoutStep === 'shipping' && (
                  <form onSubmit={handleShippingSubmit} className="space-y-4" id="shipping-details-form">
                    <h3 className="font-serif text-lg text-gold-900 border-b border-gold-100 pb-2">Atelier Delivery Address</h3>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gold-500"
                        placeholder="John Doe"
                        value={shippingForm.fullName}
                        onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Email</label>
                        <input
                          type="email"
                          required
                          className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gold-500"
                          placeholder="johndoe@gmail.com"
                          value={shippingForm.email}
                          onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Phone</label>
                        <input
                          type="tel"
                          required
                          className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gold-500"
                          placeholder="+91 99999 88888"
                          value={shippingForm.phone}
                          onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Shipping Address</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gold-500"
                        placeholder="Suite, House No, Building, Street"
                        value={shippingForm.addressLine}
                        onChange={(e) => setShippingForm({ ...shippingForm, addressLine: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">City</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gold-500"
                          placeholder="Majalgaon"
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Postal Code</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gold-500"
                          placeholder="431131"
                          value={shippingForm.postalCode}
                          onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center gap-2 text-xs text-gray-500 bg-gold-50/50 p-3 border border-gold-100">
                      <ShieldCheck className="w-5 h-5 text-gold-600 flex-shrink-0" />
                      <span>Insured shipping with personal courier hand-delivery and dual signature requirements.</span>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('cart')}
                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-serif text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-gold-900 text-white font-serif text-xs uppercase tracking-widest hover:bg-gold-800 transition-colors"
                      >
                        Proceed to Pay
                      </button>
                    </div>
                  </form>
                )}

                {checkoutStep === 'payment' && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4" id="secure-payment-form">
                    <h3 className="font-serif text-lg text-gold-900 border-b border-gold-100 pb-2">Secure Luxury Gateway</h3>

                    <div className="p-4 bg-gold-900 text-white rounded-none border border-gold-400 relative overflow-hidden flex flex-col justify-between h-44 shadow-lg mb-6">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-serif text-lg tracking-widest text-gold-200">UDAY PRIVÉ</p>
                          <p className="text-[10px] uppercase tracking-widest text-gold-100/70 mt-1">Insured Valued Customer</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-gold-300" />
                      </div>

                      <div className="space-y-1">
                        <p className="font-mono text-base tracking-widest">
                          {paymentForm.cardNumber || '••••  ••••  ••••  ••••'}
                        </p>
                      </div>

                      <div className="flex justify-between items-end font-sans text-xs uppercase text-gold-100/90">
                        <div>
                          <p className="text-[8px] text-gold-200/50">Cardholder</p>
                          <p className="tracking-wider">{paymentForm.cardName || 'YOUR FULL NAME'}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-gold-200/50">Expires</p>
                          <p>{paymentForm.expiry || 'MM/YY'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gold-500"
                        placeholder="John Doe"
                        value={paymentForm.cardName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        className="w-full px-3 py-2 border border-gray-300 text-sm font-mono focus:outline-none focus:border-gold-500"
                        placeholder="1111 2222 3333 4444"
                        value={paymentForm.cardNumber}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                          let matches = v.match(/\d{4,16}/g);
                          let match = matches && matches[0] || '';
                          let parts = [];
                          for (let i=0, len=match.length; i<len; i+=4) {
                            parts.push(match.substring(i, i+4));
                          }
                          if (parts.length > 0) {
                            setPaymentForm({ ...paymentForm, cardNumber: parts.join(' ') });
                          } else {
                            setPaymentForm({ ...paymentForm, cardNumber: v });
                          }
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Expiry Date</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          className="w-full px-3 py-2 border border-gray-300 text-sm placeholder:font-sans font-mono focus:outline-none focus:border-gold-500"
                          placeholder="MM/YY"
                          value={paymentForm.expiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/[^0-9]/gi, '');
                            if (v.length >= 2) {
                              setPaymentForm({ ...paymentForm, expiry: v.substring(0,2) + '/' + v.substring(2,4) });
                            } else {
                              setPaymentForm({ ...paymentForm, expiry: v });
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">CVV / Security Code</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          className="w-full px-3 py-2 border border-gray-300 text-sm font-mono focus:outline-none focus:border-gold-500"
                          placeholder="•••"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/[^0-9]/gi, '') })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('shipping')}
                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-serif text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 py-2.5 bg-gold-900 text-white font-serif text-xs uppercase tracking-widest hover:bg-gold-800 transition-colors flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Authorizing...</span>
                          </>
                        ) : (
                          <span>Place Order (${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {checkoutStep === 'completed' && placedOrder && (
                  <div className="text-center py-8 flex flex-col items-center justify-center space-y-4" id="checkout-completed-screen">
                    <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center border border-gold-300 animate-pulse">
                      <CheckCircle2 className="w-10 h-10 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-gold-900 tracking-wide">Trousseau Handed Over</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Transaction Authorized</p>
                    </div>

                    <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
                      Your premium jewelry order has been securely registered in our system and is being forwarded to our master artisans for crafting.
                    </p>

                    <div className="p-4 bg-gold-50 border border-gold-100 w-full text-left font-mono text-xs space-y-1.5 text-gold-900">
                      <p><strong>Order ID:</strong> {placedOrder.id}</p>
                      <p><strong>Tracking No:</strong> {placedOrder.trackingNumber}</p>
                      <p><strong>Recipient:</strong> {placedOrder.shippingAddress.fullName}</p>
                      <p><strong>Total Amount:</strong> ${placedOrder.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full pt-4">
                      <button
                        onClick={() => {
                          resetCheckout();
                          onClose();
                        }}
                        className="py-2.5 bg-gold-900 text-white font-serif text-xs uppercase tracking-widest hover:bg-gold-800 transition-all"
                      >
                        Continue Curating
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Summary Footer (Only on Cart step and when items are present) */}
              {cartItems.length > 0 && checkoutStep === 'cart' && (
                <div className="p-6 border-t border-gray-100 bg-gold-50/30">
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Bag Subtotal</span>
                      <span className="font-medium text-gray-900">${subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Royal Offer Discount</span>
                        <span>-${discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Luxury Tax (3% GST)</span>
                      <span>+${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-gold-800">
                      <span>Courier Hand-delivery</span>
                      <span className="uppercase text-[10px] font-semibold tracking-wider">Complimentary</span>
                    </div>
                    <div className="border-t border-gold-100 my-2" />
                    <div className="flex justify-between text-sm font-serif font-bold text-gold-950 pt-1">
                      <span>Total Premium Sum</span>
                      <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onCheckout();
                      onClose();
                    }}
                    className="w-full mt-4 py-3 bg-gold-900 hover:bg-gold-800 text-white font-serif tracking-widest text-xs uppercase transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    id="cart-proceed-checkout"
                  >
                    <span>Proceed to Secured Checkout</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
