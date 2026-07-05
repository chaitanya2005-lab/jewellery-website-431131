import { Product, Review } from '../types';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Aisvarya Royal Temple Choker',
    category: 'Necklaces',
    type: 'Gold',
    collection: 'Temple',
    price: 3250,
    rating: 4.9,
    reviewsCount: 18,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A magnificent handcrafted choker featuring traditional temple motifs, adorned with exquisite Kundan work and delicate south-sea pearl drops. Crafted in premium 22 Karat yellow gold.',
    specifications: {
      weight: '42.5 grams',
      purity: '22K (916 Gold)',
      gender: 'Women'
    },
    isBestSeller: true,
    isTrending: true,
    discountPercentage: 5
  },
  {
    id: 'p2',
    name: 'Celestial Solitaire Diamond Ring',
    category: 'Rings',
    type: 'Diamond',
    collection: 'Classic',
    price: 1850,
    rating: 4.8,
    reviewsCount: 34,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An elegant four-prong setting of a brilliant-cut 0.75-carat solitaire diamond on an 18K white gold band. A timeless symbol of love.',
    specifications: {
      weight: '3.8 grams',
      purity: '18K White Gold',
      diamondCarat: '0.75 CT',
      diamondClarity: 'VVS1, E Color',
      gender: 'Women',
      size: '6, 7, 8'
    },
    isBestSeller: true,
    isNewArrival: true
  },
  {
    id: 'p3',
    name: 'Mayur Majestic Peacock Bangles',
    category: 'Bangles',
    type: 'Gold',
    collection: 'Bridal',
    price: 4900,
    rating: 5.0,
    reviewsCount: 12,
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b1a111c1fc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Set of two intricately carved gold bangles boasting dancing peacock patterns embedded with ruby doublets and uncut emeralds. Perfect for the modern bride looking for regal elegance.',
    specifications: {
      weight: '58.2 grams',
      purity: '22K (916 Gold)',
      gender: 'Women',
      size: '2.4, 2.6, 2.8'
    },
    isBestSeller: false,
    isTrending: true
  },
  {
    id: 'p4',
    name: 'Shiddat Diamond Mangalsutra',
    category: 'Mangalsutra',
    type: 'Diamond',
    collection: 'Classic',
    price: 1120,
    rating: 4.7,
    reviewsCount: 22,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A delicate fusion of sacred black beads and a sleek V-shaped pendant studded with high-clarity diamonds, celebrating traditional bonds with modern luxury.',
    specifications: {
      weight: '8.4 grams',
      purity: '18K Yellow Gold',
      diamondCarat: '0.45 CT',
      diamondClarity: 'VS, G-H Color',
      gender: 'Women'
    },
    isBestSeller: true,
    isNewArrival: false,
    discountPercentage: 10
  },
  {
    id: 'p5',
    name: 'Imperial Emerald Drop Earrings',
    category: 'Earrings',
    type: 'Diamond',
    collection: 'Bridal',
    price: 2450,
    rating: 4.9,
    reviewsCount: 15,
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588444839799-eb6429975d6f?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Breathtaking drop earrings crafted in white gold, suspending vibrant pear-cut Colombian emeralds framed by a double halo of micro-pave diamonds.',
    specifications: {
      weight: '12.6 grams',
      purity: '18K White Gold',
      diamondCarat: '1.20 CT',
      diamondClarity: 'VVS2, F Color',
      gender: 'Women'
    },
    isBestSeller: false,
    isNewArrival: true,
    isTrending: true
  },
  {
    id: 'p6',
    name: 'Drape of Divinity Gold Chain',
    category: 'Chains',
    type: 'Gold',
    collection: 'Classic',
    price: 950,
    rating: 4.6,
    reviewsCount: 45,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An exquisitely flexible, laser-cut rope chain in pure 22K gold. Provides a heavy feel with highly polished multifaceted links reflecting premium radiance.',
    specifications: {
      weight: '14.5 grams',
      purity: '22K (916 Gold)',
      gender: 'Unisex'
    },
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: 'p7',
    name: 'Aura Classic Silver Bracelet',
    category: 'Bracelets',
    type: 'Silver',
    collection: 'Modern',
    price: 320,
    rating: 4.5,
    reviewsCount: 29,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A minimal modern sterling silver link chain bracelet with a polished lobster clasp. Durable, anti-tarnish protective coating.',
    specifications: {
      weight: '18.0 grams',
      purity: '925 Sterling Silver',
      gender: 'Unisex'
    },
    isBestSeller: false,
    isNewArrival: true,
    discountPercentage: 15
  },
  {
    id: 'p8',
    name: 'Maharaja Emerald Ring for Men',
    category: "Men's Jewellery",
    type: 'Gold',
    collection: 'Men',
    price: 1650,
    rating: 4.8,
    reviewsCount: 14,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A heavy, commanding signet ring for men in 22K yellow gold featuring a central cushion-cut emerald and textured linear side bands.',
    specifications: {
      weight: '16.5 grams',
      purity: '22K (916 Gold)',
      gender: 'Men',
      size: '9, 10, 11'
    },
    isBestSeller: true,
    isTrending: true
  },
  {
    id: 'p9',
    name: 'Ganesha Blessings Pendant',
    category: 'Pendants',
    type: 'Gold',
    collection: 'Temple',
    price: 680,
    rating: 4.9,
    reviewsCount: 41,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A beautifully sculpted Lord Ganesha pendant with laser-etched detailing on premium gold sheet. An auspicious jewelry piece representing good fortune.',
    specifications: {
      weight: '6.2 grams',
      purity: '22K (916 Gold)',
      gender: 'Unisex'
    },
    isBestSeller: false,
    isNewArrival: false
  },
  {
    id: 'p10',
    name: 'Sublime Navaratna Bridal Set',
    category: 'Bridal Jewellery',
    type: 'Gold',
    collection: 'Bridal',
    price: 8900,
    rating: 5.0,
    reviewsCount: 8,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A true wedding masterpiece. Contains a heavy necklace and matching earrings featuring the nine celestial gemstones (Navaratna) set meticulously in luxurious 22K filigree art.',
    specifications: {
      weight: '94.0 grams',
      purity: '22K (916 Gold)',
      gender: 'Women'
    },
    isBestSeller: true,
    isTrending: true
  },
  {
    id: 'p11',
    name: 'Vedic Flora Gold Ear Studs',
    category: 'Earrings',
    type: 'Gold',
    collection: 'Classic',
    price: 540,
    rating: 4.7,
    reviewsCount: 19,
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Captivating flower-shaped ear studs featuring a ruby centerpiece with fine micro-granules of gold surrounding each petal. Extremely comfortable screw back.',
    specifications: {
      weight: '5.5 grams',
      purity: '22K (916 Gold)',
      gender: 'Women'
    },
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: 'p12',
    name: 'Duo Glimmer Silver Anklets',
    category: 'Silver Jewellery',
    type: 'Silver',
    collection: 'Classic',
    price: 180,
    rating: 4.4,
    reviewsCount: 31,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Charming traditional anklets (Payal) crafted in pure 92.5 sterling silver with micro silver ghungroos that emit a very sweet and soft sound on movement.',
    specifications: {
      weight: '25.0 grams',
      purity: '925 Sterling Silver',
      gender: 'Women'
    },
    isBestSeller: true,
    isNewArrival: false,
    discountPercentage: 5
  },
  {
    id: 'p13',
    name: 'Regal Diamond Chandelier Earrings',
    category: 'Earrings',
    type: 'Diamond',
    collection: 'Bridal',
    price: 3800,
    rating: 4.9,
    reviewsCount: 10,
    images: [
      'https://images.unsplash.com/photo-1588444839799-eb6429975d6f?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Chandelier drop earrings containing over 250 individually handset sparkling diamonds structured in geometric tiers of flawless 18K white gold.',
    specifications: {
      weight: '16.8 grams',
      purity: '18K White Gold',
      diamondCarat: '2.50 CT',
      diamondClarity: 'VVS2, F-G Color',
      gender: 'Women'
    },
    isBestSeller: false,
    isNewArrival: false,
    isTrending: true
  },
  {
    id: 'p14',
    name: 'Classic Curb Link Platinum Bracelet',
    category: 'Bracelets',
    type: 'Platinum',
    collection: 'Men',
    price: 2100,
    rating: 4.8,
    reviewsCount: 16,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A heavy luxury link bracelet built in premium solid 950 Platinum. Subtle satin-finish alternating links creating a refined modern luxury statement.',
    specifications: {
      weight: '32.0 grams',
      purity: 'PT950 Platinum',
      gender: 'Men'
    },
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: 'p15',
    name: 'Aadhya Temple Lakshmi Pendant',
    category: 'Pendants',
    type: 'Gold',
    collection: 'Temple',
    price: 1250,
    rating: 4.9,
    reviewsCount: 25,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An elegant vintage-style temple pendant showcasing Goddess Lakshmi seated on a lotus with micro-inlaid rubies and surrounding floral designs in antique gold.',
    specifications: {
      weight: '11.8 grams',
      purity: '22K (916 Gold)',
      gender: 'Women'
    },
    isBestSeller: true,
    isTrending: false
  },
  {
    id: 'p16',
    name: 'Elysian Diamond Hoop Earrings',
    category: 'Earrings',
    type: 'Diamond',
    collection: 'Modern',
    price: 1450,
    rating: 4.7,
    reviewsCount: 20,
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Modern inside-out diamond set hoops that sparkle from every direction. High-end handcrafted design using brilliant-cut micro-diamonds.',
    specifications: {
      weight: '6.4 grams',
      purity: '18K Rose Gold',
      diamondCarat: '0.90 CT',
      diamondClarity: 'VS1, H Color',
      gender: 'Women'
    },
    isBestSeller: false,
    isNewArrival: true,
    discountPercentage: 8
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userName: 'Priya Sharma',
    rating: 5,
    date: '2026-06-12',
    comment: 'The craftsmanship on the temple choker is absolutely spectacular! The weight is perfect and looks very royal. Highly recommend Uday Jewellers.',
    verified: true
  },
  {
    id: 'r2',
    productId: 'p2',
    userName: 'Rohit Deshmukh',
    rating: 5,
    date: '2026-05-24',
    comment: 'Proposed to my fiancé with this celestial solitaire. She is absolutely in love with it. The sparkle is unbelievable. Certified solitaire, great peace of mind.',
    verified: true
  },
  {
    id: 'r3',
    productId: 'p3',
    userName: 'Meenakshi Iyer',
    rating: 5,
    date: '2026-06-30',
    comment: 'Breathtaking peacock bangles. The 22K gold has an beautiful authentic rich luster. The sizing was exact.',
    verified: true
  },
  {
    id: 'r4',
    productId: 'p4',
    userName: 'Kavita Patel',
    rating: 4,
    date: '2026-06-18',
    comment: 'Delicate and perfect for daily wear. Love the subtle shimmer of the diamonds. Very modern design.',
    verified: true
  }
];

export const categoriesList = [
  { name: 'All Categories', count: 16, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200' },
  { name: 'Rings', count: 3, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=200' },
  { name: 'Earrings', count: 4, image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=200' },
  { name: 'Necklaces', count: 2, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200' },
  { name: 'Bangles', count: 1, image: 'https://images.unsplash.com/photo-1611085583191-a3b1a111c1fc?auto=format&fit=crop&q=80&w=200' },
  { name: 'Bracelets', count: 2, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=200' },
  { name: 'Chains', count: 1, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200' },
  { name: 'Pendants', count: 2, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200' },
  { name: 'Mangalsutra', count: 1, image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=200' },
  { name: 'Bridal Jewellery', count: 2, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=200' },
  { name: "Men's Jewellery", count: 2, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=200' }
];

export const materialTypes = [
  { name: 'Gold Jewellery', type: 'Gold' },
  { name: 'Diamond Jewellery', type: 'Diamond' },
  { name: 'Silver Jewellery', type: 'Silver' }
];

export const collectionsList = [
  { name: 'Bridal Collection', value: 'Bridal', desc: 'Regal masterpieces for your auspicious moments.', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800' },
  { name: 'Temple Jewellery', value: 'Temple', desc: 'Crafted with absolute divinity and heritage.', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800' },
  { name: 'Classic Elegance', value: 'Classic', desc: 'Timeless styles perfect for everyday and special occasions.', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Modern Minimalist', value: 'Modern', desc: 'Sleek designs expressing contemporary flair.', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' }
];
