import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart
}: WishlistDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="wishlist-drawer-overlay">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10" id="wishlist-drawer-container">
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
                  <span className="font-serif text-lg tracking-wider text-gold-900 uppercase">My Wishlist</span>
                  <span className="bg-gold-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gold-600 transition-colors"
                  id="close-wishlist-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Wishlist Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="text-center py-16 flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-full border border-gold-200 flex items-center justify-center text-gold-400 bg-gold-50/20">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-serif text-lg text-gold-900 font-medium">Your sanctuary is empty</p>
                      <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                        Save your favorite precious masterpieces here to view or purchase them later.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-gold-900 text-white font-serif text-xs tracking-widest uppercase hover:bg-gold-800 transition-colors"
                    >
                      Begin Exploring
                    </button>
                  </div>
                ) : (
                  wishlist.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-3 border border-gray-100 rounded-none hover:border-gold-300 transition-colors bg-white relative group"
                    >
                      <div className="w-20 h-20 bg-gray-50 flex-shrink-0 overflow-hidden relative border border-gray-100">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <p className="text-xs text-gold-600 font-medium tracking-wide uppercase">{product.category}</p>
                          <h4 className="font-serif text-sm text-gold-950 font-medium truncate mt-0.5" title={product.name}>
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">Purity: {product.specifications.purity || 'N/A'}</p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-serif font-semibold text-gold-900 text-sm">
                            ${product.price.toLocaleString()}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onAddToCart(product)}
                              className="p-1.5 bg-gold-50 border border-gold-200 text-gold-800 hover:bg-gold-900 hover:text-white transition-colors"
                              title="Add to Cart"
                              id={`wishlist-add-to-cart-${product.id}`}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onRemoveFromWishlist(product)}
                              className="p-1.5 border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 transition-colors"
                              title="Remove"
                              id={`wishlist-remove-${product.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
