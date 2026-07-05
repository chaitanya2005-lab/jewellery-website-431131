import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Grid, List, RefreshCw, Star, Heart, X, Sparkles, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { products, categoriesList, materialTypes } from '../data/products';
import ProductCard from '../components/ProductCard';

interface ProductsPageProps {
  wishlist: Product[];
  onWishlistToggle: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductsPage({
  wishlist,
  onWishlistToggle,
  onAddToCart,
  onViewDetails
}: ProductsPageProps) {
  
  // Advanced Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedPurity, setSelectedPurity] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [sortOrder, setSortOrder] = useState('Featured');
  const [priceRange, setPriceRange] = useState(10000); // max price slider

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Recently Viewed state
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // 1. Transient Navigation filters from Homepage
  useEffect(() => {
    const preFilteredCategory = localStorage.getItem('uday_filter_category');
    const preFilteredCollection = localStorage.getItem('uday_filter_collection');

    if (preFilteredCategory) {
      setSelectedCategory(preFilteredCategory);
      localStorage.removeItem('uday_filter_category'); // clear immediately
    }
    if (preFilteredCollection) {
      setSelectedCollection(preFilteredCollection);
      localStorage.removeItem('uday_filter_collection'); // clear immediately
    }

    // Load recently viewed
    const storedRecentIds: string[] = JSON.parse(localStorage.getItem('uday_recently_viewed') || '[]');
    const matchingRecent = products.filter(p => storedRecentIds.includes(p.id)).slice(0, 4);
    setRecentlyViewed(matchingRecent);
  }, []);

  // 2. Perform Filtering & Sorting
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Material (Metal Type) filter
    if (selectedMaterial !== 'All') {
      result = result.filter(p => p.type === selectedMaterial);
    }

    // Purity filter
    if (selectedPurity !== 'All') {
      result = result.filter(p => p.specifications.purity?.includes(selectedPurity));
    }

    // Collection filter
    if (selectedCollection !== 'All') {
      result = result.filter(p => p.collection === selectedCollection);
    }

    // Gender filter
    if (selectedGender !== 'All') {
      result = result.filter(p => p.specifications.gender === selectedGender || p.specifications.gender === 'Unisex');
    }

    // Price filter
    result = result.filter(p => p.price <= priceRange);

    // Sorting
    if (sortOrder === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'Best Sellers') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else if (sortOrder === 'Top Rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'New Arrivals') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, selectedMaterial, selectedPurity, selectedCollection, selectedGender, sortOrder, priceRange]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedMaterial('All');
    setSelectedPurity('All');
    setSelectedCollection('All');
    setSelectedGender('All');
    setSortOrder('Featured');
    setPriceRange(10000);
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans" id="productspage-root">
      
      {/* 1. TOP COVER */}
      <section className="bg-gold-50/50 border-b border-gold-100 py-10 px-4 text-center">
        <span className="text-[10px] tracking-[0.3em] text-gold-600 font-semibold uppercase block mb-1">UDAY CATALOG</span>
        <h1 className="font-serif text-3xl font-bold text-gold-950 uppercase tracking-wide">Precious Showcase</h1>
        <div className="h-0.5 w-16 bg-gold-400 mx-auto mt-2.5" />
      </section>

      {/* 2. CATALOG CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* A. LEFT ADVANCED FILTER BAR (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 bg-gold-50/20 border border-gold-100 p-5">
            <div className="flex justify-between items-center border-b border-gold-200 pb-3">
              <span className="font-serif text-sm font-bold uppercase tracking-wider text-gold-950 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold-700" />
                <span>Filters</span>
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[10px] text-gold-700 hover:underline uppercase tracking-wider font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between text-xs text-gray-700 font-semibold uppercase tracking-wider mb-2">
                <span>Maximum Price</span>
                <span className="text-gold-800 font-mono">${priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-gold-600"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
              />
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category</h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {categoriesList.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left py-1 text-xs transition-colors flex justify-between items-center ${selectedCategory === cat.name ? 'text-gold-700 font-bold' : 'text-gray-500 hover:text-gold-600'}`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Material/Metal Type */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Metal Type</h4>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Gold', 'Diamond', 'Silver', 'Platinum'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMaterial(m)}
                    className={`px-3 py-1 border text-[11px] font-medium transition-all ${selectedMaterial === m ? 'border-gold-600 bg-gold-950 text-white' : 'border-gray-200 hover:border-gold-300 bg-white text-gray-700'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Purity selection */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Karat / Purity</h4>
              <div className="flex flex-wrap gap-1.5">
                {['All', '22K', '18K', '925', 'PT950'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPurity(p)}
                    className={`px-3 py-1 border text-[11px] font-medium transition-all ${selectedPurity === p ? 'border-gold-600 bg-gold-950 text-white' : 'border-gray-200 hover:border-gold-300 bg-white'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Collection</h4>
              <div className="space-y-1.5">
                {['All', 'Bridal', 'Temple', 'Classic', 'Modern', 'Men'].map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={`w-full text-left py-1 text-xs transition-colors block ${selectedCollection === col ? 'text-gold-700 font-bold' : 'text-gray-500 hover:text-gold-600'}`}
                  >
                    {col === 'All' ? 'All Collections' : `${col} Collection`}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Segment</h4>
              <div className="flex gap-1.5">
                {['All', 'Women', 'Men'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`flex-1 py-1 text-center border text-[11px] transition-all ${selectedGender === g ? 'border-gold-600 bg-gold-950 text-white' : 'border-gray-200 hover:border-gold-400 bg-white'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* B. RIGHT PRODUCTS GRID */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Control Bar: Search Input & Sorter */}
            <div className="bg-gold-50/20 border border-gold-100 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Refine search within selection..."
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-200 bg-white focus:outline-none text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              </div>

              {/* Status information */}
              <div className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold font-sans">
                Showing <strong className="text-gold-950">{filteredProducts.length}</strong> divine ornaments
              </div>

              {/* Mobile Filter Button and Sorter */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden py-1.5 px-3 border border-gold-300 text-gold-950 text-xs flex items-center gap-1 bg-white hover:bg-gold-50"
                  id="mobile-filters-trigger"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <span className="hidden sm:inline">Sort:</span>
                  <select
                    className="border border-gray-200 bg-white py-1 px-2.5 focus:outline-none text-xs text-gray-700"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="Featured">Featured Sovereign</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Best Sellers">Best Sellers First</option>
                    <option value="New Arrivals">New Arrivals First</option>
                    <option value="Top Rated">Top Rated First</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Empty state check */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center justify-center space-y-4 border border-dashed border-gray-200 bg-gray-50/20">
                <div className="w-16 h-16 rounded-full border border-gold-200 flex items-center justify-center text-gold-400">
                  <SlidersHorizontal className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-gold-900 font-medium">No masterpieces match your criteria</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Try clearing certain material filters, increasing the price ceiling, or searching using broader keywords.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2 bg-gold-950 hover:bg-gold-900 text-white font-serif text-xs uppercase tracking-widest"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="products-catalog-grid">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={wishlist.some(item => item.id === p.id)}
                    onWishlistToggle={onWishlistToggle}
                    onAddToCart={onAddToCart}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            )}

            {/* C. RECENTLY VIEWED SHELF */}
            {recentlyViewed.length > 0 && (
              <div className="pt-12 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-6">
                  <Sparkles className="w-4 h-4 text-gold-600" />
                  <h3 className="font-serif text-base font-bold text-gold-950 uppercase tracking-widest">Recently Admired Ornaments</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recentlyViewed.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => onViewDetails(rec)}
                      className="group border border-gray-100 hover:border-gold-200 p-2.5 cursor-pointer bg-white"
                    >
                      <div className="relative pt-[100%] overflow-hidden bg-gray-50 mb-2">
                        <img
                          src={rec.images[0]}
                          alt={rec.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h4 className="font-serif text-[11px] text-gold-950 truncate">{rec.name}</h4>
                      <p className="font-serif text-[11px] text-gold-900 font-semibold mt-0.5">${rec.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* D. MOBILE FILTER OVERLAY DRAWER */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end" id="mobile-filters-drawer-overlay">
          <div className="bg-white w-full max-w-xs h-full flex flex-col p-6 overflow-y-auto space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="font-serif text-sm font-bold uppercase text-gold-950">Mobile Filters</span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 text-gray-400 hover:text-gold-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Slider Mobile */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-gray-700">
                <span>Max Price</span>
                <span className="font-mono text-gold-800">${priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-gold-600"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
              />
            </div>

            {/* Categories Mobile */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category</h4>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {categoriesList.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left py-1 text-xs ${selectedCategory === cat.name ? 'text-gold-700 font-bold' : 'text-gray-500'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Metal Mobile */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Metal</h4>
              <div className="grid grid-cols-3 gap-1.5">
                {['All', 'Gold', 'Diamond', 'Silver', 'Platinum'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMaterial(m)}
                    className={`py-1 text-center border text-[11px] ${selectedMaterial === m ? 'border-gold-600 bg-gold-950 text-white' : 'border-gray-200 bg-white'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Mobile */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Collection</h4>
              <div className="space-y-1">
                {['All', 'Bridal', 'Temple', 'Classic', 'Modern', 'Men'].map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={`w-full text-left py-1 text-xs block ${selectedCollection === col ? 'text-gold-700 font-bold' : 'text-gray-500'}`}
                  >
                    {col} Collection
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full py-2.5 bg-gold-950 text-white font-serif tracking-widest text-xs uppercase"
            >
              Apply Filter Selections
            </button>
            <button
              onClick={() => {
                handleResetFilters();
                setIsMobileFiltersOpen(false);
              }}
              className="w-full py-2.5 border border-gray-300 text-gray-600 font-serif tracking-widest text-xs uppercase"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
