import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onViewDetails
}: ProductCardProps) {
  const finalPrice = product.price;
  const originalPrice = product.discountPercentage 
    ? Math.round(product.price / (1 - product.discountPercentage / 100))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5 }}
      className="group bg-white border border-gray-100 hover:border-gold-300 transition-all duration-500 overflow-hidden relative flex flex-col justify-between h-full font-sans"
    >
      {/* Badges / Top Bar */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isBestSeller && (
          <span className="bg-gold-800 text-white text-[8px] tracking-widest uppercase font-medium px-2 py-0.5 shadow-sm">
            Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-gold-600 text-white text-[8px] tracking-widest uppercase font-medium px-2 py-0.5 shadow-sm">
            New Arrival
          </span>
        )}
        {product.discountPercentage && (
          <span className="bg-red-700 text-white text-[8px] tracking-widest uppercase font-medium px-2 py-0.5 shadow-sm">
            {product.discountPercentage}% Off
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onWishlistToggle(product);
        }}
        className="absolute top-3 right-3 z-10 p-2 bg-white/95 hover:bg-gold-50 text-gray-400 hover:text-gold-600 transition-colors shadow-xs group-hover:scale-105 duration-300"
        aria-label="Add to Wishlist"
        id={`wishlist-toggle-${product.id}`}
      >
        <Heart className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
      </button>

      {/* Product Image Section */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative pt-[100%] bg-gray-50 overflow-hidden cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {/* Overlay Action Bar */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <div className="flex gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="px-3.5 py-1.5 bg-white text-gray-800 hover:bg-gold-900 hover:text-white font-serif text-[10px] tracking-widest uppercase transition-colors flex items-center gap-1 shadow-sm"
              id={`quick-view-${product.id}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="px-3.5 py-1.5 bg-gold-900 text-white hover:bg-gold-800 font-serif text-[10px] tracking-widest uppercase transition-colors flex items-center gap-1 shadow-sm"
              id={`add-to-cart-${product.id}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detail Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="cursor-pointer" onClick={() => onViewDetails(product)}>
          <div className="flex justify-between items-center text-[10px] text-gold-600 font-semibold uppercase tracking-widest">
            <span>{product.category}</span>
            <div className="flex items-center gap-0.5 text-yellow-500">
              <Star className="w-3 h-3 fill-yellow-500" />
              <span className="text-gray-500 font-normal">{product.rating}</span>
            </div>
          </div>
          
          <h3 className="font-serif text-[13px] text-gold-950 font-medium tracking-wide mt-1 group-hover:text-gold-700 transition-colors line-clamp-2 h-9">
            {product.name}
          </h3>
          
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
            {product.specifications.purity || product.type}
          </p>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2 pt-2 border-t border-gray-50">
          <span className="font-serif font-bold text-gold-900 text-base">
            ${finalPrice.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ${originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
