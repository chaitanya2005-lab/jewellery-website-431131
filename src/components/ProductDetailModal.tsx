import React, { useState, useEffect } from 'react';
import { X, Heart, Star, ShieldCheck, Truck, RotateCcw, Award, ShoppingBag, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Review } from '../types';
import { mockReviews, products } from '../data/products';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  isWishlisted: boolean;
  onWishlistToggle: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, size?: string) => void;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  isWishlisted,
  onWishlistToggle,
  onAddToCart
}: ProductDetailModalProps) {
  if (!product) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // Local reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    userName: '',
    comment: ''
  });
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Zoom effect coordinates
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setQuantity(1);
      setIsSubmitSuccess(false);
      setNewReview({ rating: 5, userName: '', comment: '' });

      // Initialize sizes
      if (product.specifications.size) {
        const sizes = product.specifications.size.split(', ');
        setSelectedSize(sizes[0]);
      } else {
        setSelectedSize('');
      }

      // Load combined reviews (mock + any added from localStorage)
      const storedReviews = JSON.parse(localStorage.getItem(`uday_reviews_${product.id}`) || '[]');
      const filteredMocks = mockReviews.filter(r => r.productId === product.id);
      setReviews([...filteredMocks, ...storedReviews]);
    }
  }, [product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center'
    });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName.trim() || !newReview.comment.trim()) return;

    const newRevObj: Review = {
      id: 'rev_' + Date.now(),
      productId: product.id,
      userName: newReview.userName,
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      comment: newReview.comment,
      verified: true
    };

    // Save to local storage for persistence
    const storedReviews = JSON.parse(localStorage.getItem(`uday_reviews_${product.id}`) || '[]');
    storedReviews.push(newRevObj);
    localStorage.setItem(`uday_reviews_${product.id}`, JSON.stringify(storedReviews));

    setReviews([...reviews, newRevObj]);
    setNewReview({ rating: 5, userName: '', comment: '' });
    setIsSubmitSuccess(true);
    setTimeout(() => setIsSubmitSuccess(false), 3000);
  };

  // Recommendations: Other products from the same category or collection
  const recommendations = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.collection === product.collection))
    .slice(0, 3);

  const sizes = product.specifications.size ? product.specifications.size.split(', ') : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center font-sans" id="product-detail-modal-overlay">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="bg-white w-full max-w-5xl rounded-none border border-gold-300 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
            id="product-detail-modal-container"
          >
            {/* Elegant top accent bar */}
            <div className="h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 w-full" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-gold-50 border border-gold-200 text-gray-500 hover:text-gold-600 transition-all rounded-none"
              id="close-detail-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* 1. Left Gallery / Zoom Section */}
                <div className="md:col-span-6 space-y-4">
                  <div 
                    className="relative pt-[100%] border border-gray-100 overflow-hidden bg-gray-50 cursor-zoom-in group"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img
                      src={product.images[activeImageIdx]}
                      alt={product.name}
                      style={zoomStyle}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-100 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 text-[9px] uppercase tracking-widest text-gold-800 border border-gold-200 pointer-events-none">
                      Hover to Magnify Detail
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-16 h-16 border-2 overflow-hidden transition-all bg-gray-50 ${activeImageIdx === idx ? 'border-gold-500 shadow-xs' : 'border-gray-200 hover:border-gold-300'}`}
                        >
                          <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Trusted Guarantees */}
                  <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-100 text-center">
                    <div className="p-3 bg-gold-50/50 border border-gold-100 flex flex-col items-center">
                      <Award className="w-5 h-5 text-gold-600 mb-1" />
                      <span className="text-[10px] font-semibold text-gold-900 uppercase tracking-wider">BIS Hallmarked</span>
                      <span className="text-[8px] text-gray-500 mt-0.5">100% Certified 22K/18K</span>
                    </div>
                    <div className="p-3 bg-gold-50/50 border border-gold-100 flex flex-col items-center">
                      <Truck className="w-5 h-5 text-gold-600 mb-1" />
                      <span className="text-[10px] font-semibold text-gold-900 uppercase tracking-wider">Secured Hand</span>
                      <span className="text-[8px] text-gray-500 mt-0.5">Free Insured Courier</span>
                    </div>
                    <div className="p-3 bg-gold-50/50 border border-gold-100 flex flex-col items-center">
                      <RotateCcw className="w-5 h-5 text-gold-600 mb-1" />
                      <span className="text-[10px] font-semibold text-gold-900 uppercase tracking-wider">Exchange Policy</span>
                      <span className="text-[8px] text-gray-500 mt-0.5">15-Day Easy Returns</span>
                    </div>
                  </div>
                </div>

                {/* 2. Right Info Section */}
                <div className="md:col-span-6 space-y-6">
                  <div>
                    <span className="text-xs text-gold-600 font-semibold uppercase tracking-widest">{product.category}</span>
                    <h2 className="font-serif text-2xl md:text-3xl text-gold-950 font-bold mt-1 tracking-wide leading-tight">
                      {product.name}
                    </h2>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-500 font-medium">{reviews.length} Authentic Reviews</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gold-50/40 p-4 border-l-4 border-gold-500 flex items-baseline gap-4">
                    <span className="font-serif text-3xl font-bold text-gold-950">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.discountPercentage && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          ${Math.round(product.price / (1 - product.discountPercentage / 100)).toLocaleString()}
                        </span>
                        <span className="bg-red-700 text-white text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase">
                          Save {product.discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Ring/Bangle Size Selector */}
                  {sizes.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Select Size</label>
                        <a href="#size-chart" className="text-[10px] text-gold-700 hover:underline">Sizing Guide</a>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`px-4 py-2 text-xs border font-medium transition-all ${selectedSize === s ? 'border-gold-600 bg-gold-950 text-white' : 'border-gray-200 hover:border-gold-400 bg-white'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to Cart & Wishlist Controls */}
                  <div className="flex gap-4 pt-2">
                    <div className="flex items-center border border-gray-300">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-gray-500 hover:text-gold-600 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-semibold text-gray-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 text-gray-500 hover:text-gold-600 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onAddToCart(product, quantity, selectedSize)}
                      className="flex-1 py-3 bg-gold-900 hover:bg-gold-800 text-white font-serif tracking-widest text-xs uppercase transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add To Luxury Bag</span>
                    </button>

                    <button
                      onClick={() => onWishlistToggle(product)}
                      className={`p-3 border transition-all ${isWishlisted ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 hover:border-gold-400 bg-white text-gray-400 hover:text-gold-600'}`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Specifications Breakdown */}
                  <div>
                    <h3 className="font-serif text-sm font-bold text-gold-950 border-b border-gray-100 pb-2 uppercase tracking-wider">Artisanal Specifications</h3>
                    <table className="w-full text-xs mt-2 text-gray-600 font-sans divide-y divide-gray-100">
                      <tbody>
                        {product.specifications.weight && (
                          <tr className="py-2 flex justify-between">
                            <td className="font-medium text-gray-400">Metal Weight</td>
                            <td className="text-gray-900 font-medium">{product.specifications.weight}</td>
                          </tr>
                        )}
                        {product.specifications.purity && (
                          <tr className="py-2 flex justify-between">
                            <td className="font-medium text-gray-400">Metal Purity</td>
                            <td className="text-gray-900 font-medium">{product.specifications.purity}</td>
                          </tr>
                        )}
                        {product.specifications.diamondCarat && (
                          <tr className="py-2 flex justify-between">
                            <td className="font-medium text-gray-400">Diamond Carat</td>
                            <td className="text-gray-900 font-medium">{product.specifications.diamondCarat}</td>
                          </tr>
                        )}
                        {product.specifications.diamondClarity && (
                          <tr className="py-2 flex justify-between">
                            <td className="font-medium text-gray-400">Diamond Clarity</td>
                            <td className="text-gray-900 font-medium">{product.specifications.diamondClarity}</td>
                          </tr>
                        )}
                        {product.specifications.gender && (
                          <tr className="py-2 flex justify-between">
                            <td className="font-medium text-gray-400">Gender Allocation</td>
                            <td className="text-gray-900 font-medium">{product.specifications.gender}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

              {/* 3. Review Engine */}
              <div className="mt-12 border-t border-gray-100 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Reviews List */}
                  <div className="md:col-span-7 space-y-6">
                    <h3 className="font-serif text-lg text-gold-900 font-medium tracking-wide">
                      Patron Opinions ({reviews.length})
                    </h3>

                    {reviews.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No reviews submitted yet for this jewelry piece. Be the first to express your appraisal.</p>
                    ) : (
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {reviews.map((rev) => (
                          <div key={rev.id} className="p-4 bg-gold-50/20 border border-gold-100/50">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-xs text-gold-950">{rev.userName}</span>
                              <span className="text-[10px] text-gray-400">{rev.date}</span>
                            </div>
                            <div className="flex text-yellow-500 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-200'}`} 
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-600 italic">"{rev.comment}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Review Form */}
                  <div className="md:col-span-5 bg-gold-50/30 p-6 border border-gold-200/60">
                    <h4 className="font-serif text-sm font-semibold text-gold-900 uppercase tracking-widest mb-3">Leave an Appraisal</h4>
                    
                    {isSubmitSuccess ? (
                      <div className="text-center py-6 text-gold-800 text-xs font-medium bg-gold-100/50 border border-gold-200">
                        Thank you! Your verified appraisal has been saved locally.
                      </div>
                    ) : (
                      <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Patron Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Maharani Devika"
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white"
                            value={newReview.userName}
                            onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Rating Score</label>
                          <div className="flex gap-1 text-yellow-500">
                            {[1, 2, 3, 4, 5].map((stars) => (
                              <button
                                key={stars}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: stars })}
                                className="focus:outline-none"
                              >
                                <Star className={`w-5 h-5 ${stars <= newReview.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Appraisal Comment</label>
                          <textarea
                            required
                            placeholder="Share your experience of the design luster, weight accuracy, or bespoke box packaging..."
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white h-16 resize-none"
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-gold-950 text-white font-serif tracking-widest uppercase hover:bg-gold-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Review</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Related Masterpieces */}
              {recommendations.length > 0 && (
                <div className="mt-12 border-t border-gray-100 pt-8">
                  <h3 className="font-serif text-lg text-gold-950 font-semibold tracking-wide mb-6">You May Also Admire</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => {
                          // Change the active product in detail view
                          // The parent modal receives the new product
                          // Since we mutate parent state, we must lift this up or just close and click
                          setActiveImageIdx(0);
                          product.id = rec.id; // local state triggers update
                          onClose();
                          setTimeout(() => {
                            const btn = document.getElementById(`quick-view-${rec.id}`);
                            if (btn) btn.click();
                          }, 100);
                        }}
                        className="group border border-gray-100 hover:border-gold-200 bg-white p-3 cursor-pointer text-center flex flex-col justify-between"
                      >
                        <div className="relative pt-[100%] overflow-hidden bg-gray-50 mb-3">
                          <img
                            src={rec.images[0]}
                            alt={rec.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif text-xs text-gold-950 font-medium truncate mb-1">{rec.name}</h4>
                          <span className="font-serif text-xs text-gold-900 font-bold">${rec.price.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
