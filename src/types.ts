export interface Product {
  id: string;
  name: string;
  category: string; // e.g., 'Rings', 'Necklaces', etc.
  type: 'Gold' | 'Diamond' | 'Silver' | 'Platinum';
  collection: 'Bridal' | 'Classic' | 'Temple' | 'Modern' | 'Men';
  price: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  specifications: {
    weight?: string;
    purity?: string;
    diamondCarat?: string;
    diamondClarity?: string;
    gender?: 'Unisex' | 'Women' | 'Men';
    size?: string;
  };
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  discountPercentage?: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Appointment {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  type: 'Bridal Consultation' | 'Bespoke Design' | 'Gold Valuation' | 'Custom Jewellery Design' | 'Jewellery Exchange' | 'Gold Purchase' | 'Jewellery Repair';
  location: string;
  notes?: string;
  status?: 'Scheduled' | 'Rescheduled' | 'Cancelled' | 'Completed';
  createdAt?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  state?: string;
  country?: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  date: string;
  status: 'Placed' | 'Crafting' | 'Hallmarked' | 'Dispatched' | 'Delivered';
  trackingNumber: string;
  paymentDetails?: {
    method?: string;
    status?: string;
    cardLast4?: string;
  };
  createdAt?: string;
}

export interface User {
  uid?: string;
  email: string;
  name: string;
  phone?: string;
  isLoggedIn: boolean;
  savedAddresses?: string[];
  isAdmin?: boolean;
}
