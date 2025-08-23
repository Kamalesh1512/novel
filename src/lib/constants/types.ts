import {
  BarChart3,
  Bell,
  Clock,
  CreditCard,
  Droplet,
  Flag,
  Gift,
  Heart,
  HelpCircle,
  LayoutDashboard,
  MapPin,
  Package,
  RotateCcw,
  Settings,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  User,
  UserCog,
  Users,
} from "lucide-react";

export const userNavigation = [
  {
    name: "Wishlist",
    href: "/my-wishlist",
    icon: Heart,
    badge: "5",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Help & Support",
    href: "/support",
    icon: HelpCircle,
  },
];

export const quickActions = [
  {
    title: "Track Order",
    href: "/track-order",
    icon: Truck,
    color: "bg-blue-500",
  },
  {
    title: "Return Item",
    href: "/returns",
    icon: RotateCcw,
    color: "bg-orange-500",
  },
  {
    title: "Reorder",
    href: "/reorder",
    icon: Package,
    color: "bg-green-500",
  },
  {
    title: "Rate Products",
    href: "/reviews",
    icon: Star,
    color: "bg-yellow-500",
  },
];

export const testimonials = [
    {
      id: 1,
      name: "Venture Solutions",
      text: "I have been using uMake since its early conception and have enjoyed every minute of it. uMake allows me to take my ideas and turn them into concepts.",
      rating: 5,
    },
    {
      id: 2,
      name: "Chris McMillan",
      text: "I've been working with uMake for several years and it's progressed from a great tool to an awesome tool, so much more content than just even one year ago.",
      rating: 5,
    },
    {
      id: 3,
      name: "Youssef",
      text: "Awesome and easy to use, plus you can design whatever you want, from product mock-ups to houses interior and exterior design.",
      rating: 4.5,
    },
    {
      id: 5,
      name: "Sarah Johnson",
      text: "The customer service is exceptional and the product quality exceeds expectations every single time! Highly recommend to everyone.",
      rating: 4,
    },
    {
      id: 6,
      name: "Michael Chen",
      text: "Outstanding experience from start to finish. The attention to detail is what sets this brand apart from the competition.",
      rating: 5,
    },
  ];

export interface CategoryItem {
  id: string;
  title: string;
  price: string;
  image: string;
  banner: string;
  bgColor: string;
  textColor?: string;
  modelUrl?: string;
}

export const categories: CategoryItem[] = [
  {
    id: "baby-care",
    title: "Baby Care",
    banner: "/images/cat/premium/banner.jpg",
    price: "₹999/-",
    image: "/images/cat/premium_perfumes.png",
    bgColor: "bg-gradient-to-br from-gray-800 to-gray-900",
    textColor: "text-white",
    modelUrl: "/models/black_velvet.glb",
  },
  {
    id: "adult-care",
    title: "Home Care",
    banner: "/images/cat/premium/banner_2.png",
    price: "₹599/-",
    image: "/images/cat/perfumes.png",
    bgColor: "bg-gradient-to-br from-blue-900 to-slate-900",
    textColor: "text-white",
  },
    {
    id: "Personal-care",
    title: "Personal Care",
    banner: "/images/cat/premium/banner_2.png",
    price: "₹599/-",
    image: "/images/cat/perfumes.png",
    bgColor: "bg-gradient-to-br from-blue-900 to-slate-900",
    textColor: "text-white",
  },
];

type IconType = "clock" | "certificate" | "droplet" | "flag";
// types/deals.ts
export interface ProductType {
  id: string;
  name: string;
  description?: string;
  gender?: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  size: JSON;
  sellers: { name: string; url: string }[];
  categoryId: string;
  images: string[];
  modelUrl?: string;
  featured: boolean;
  bestSeller: boolean;
  published: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  rating?: number;
  reviews?: number;
  features?: string[];
  notes?: {
    title: string;
    description: string;
  }[];
  weight?: number;
  productReviews?: ReviewType[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Database categories enum
export enum CategoryType {
  PREMIUM_PERFUME = "premium-perfumes",
  PERFUME = "perfumes",
  SHOWER_GEL = "shower-gels",
  MASCULINE = "masculine",
  FEMININE = "feminine",
  GIFT_SET = "gift-sets",
}

// types/review.ts
export interface ReviewType {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
}

// Types
export interface Settings {
  id?: string;
  storeName: string;
  storeAddress: string;
  currency: string;
  timezone: string;
  taxRate: number;
}

export interface AdminContactInfo {
  email: string;
  phoneNumber: string;
}

export interface AccountSettings {
  settings: Settings;
  contactInfo: AdminContactInfo;
  shipping: {
    freeShippingThreshold: number;
    pickupPostcode: number;
    defaultWeight: number;
  };
  payments: {
    codEnabled: boolean;
    onlinePaymentEnabled: boolean;
    paymentGateway: string;
  };
  deals: {
    "scent-sational": number;
    "iconic-match": number;
    "alma-affair": number;
    "lov-dor": number;
    "gift-set": number;
  };
}

export interface UserWithSettings {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  accountSettings: AccountSettings | null;
}

export interface UserProfile {
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "";
  bio?: string;
}

export interface UserLocation {
  city?: string;
  state?: string;
  country?: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
}

export interface UserNotifications {
  email: boolean;
  whatsapp: boolean;
}
export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  joinDate: string;
}

export interface UserSettings {
  profile: UserProfile;
  location: UserLocation;
  notifications: UserNotifications;
  stats: UserStats;
}

//admin nav
export const adminNavigation = [
  // { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Admin Users", href: "/admin/admin-users", icon: User },
  { name: "Banners", href: "/admin/banners", icon: LayoutDashboard },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  // { name: "Coupons", href: "/admin/coupons", icon: Gift },
  { name: "Customers", href: "/admin/customers", icon: Users },
  // { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Settings", href: "/admin/settings", icon: UserCog },
];

export interface NavSubItem {
  title: string;
  href: string;
}

export interface NavItem {
  title: string;
  hasDropdown: boolean;
  items?: NavSubItem[];
}

export const navigationItems: NavItem[] = [
  {
    title: "Baby Care",
    hasDropdown: true,
    items: [
      { title: "Baby Wipes", href: "/baby-care/baby-wipes" },
      { title: "Baby Pants", href: "/baby-care/baby-pants" },
      { title: "Baby Soaps", href: "/baby-care/baby-soaps" },
      { title: "Baby Powder", href: "/baby-care/baby-powder" },
    ],
  },
  {
    title: "Outdoor Gear",
    hasDropdown: true,
    items: [
      { title: "Strollers", href: "/outdoor-gear/strollers" },
      { title: "Car Seats", href: "/outdoor-gear/car-seats" },
      { title: "Carriers", href: "/outdoor-gear/carriers" },
      { title: "Travel Accessories", href: "/outdoor-gear/travel-accessories" },
    ],
  },
  {
    title: "Indoor Gear",
    hasDropdown: true,
    items: [
      { title: "Baby High Chairs", href: "/indoor-gear/baby-high-chairs" },
      { title: "Swings", href: "/indoor-gear/swings" },
      { title: "Baby Walkers", href: "/indoor-gear/baby-walkers" },
    ],
  },
  {
    title: "Nursing & Feeding Essentials",
    hasDropdown: true,
    items: [
      { title: "Feeding Bottles", href: "/nursing-feeding/feeding-bottles" },
      { title: "Baby Bibs", href: "/nursing-feeding/baby-bibs" },
      { title: "Other Baby Essentials", href: "/nursing-feeding/other-essentials" },
    ],
  },
  {
    title: "Adult Care",
    hasDropdown: true,
    items: [
      { title: "Underpads", href: "/adult-care/underpads" },
      { title: "Adult Diapers", href: "/adult-care/adult-diapers" },
      { title: "Body Wipes", href: "/adult-care/body-wipes" },
    ],
  },
  {
    title: "Personal Care",
    hasDropdown: true,
    items: [
      { title: "Face Tissues", href: "/personal-care/face-tissues" },
      { title: "Refreshing Wipes", href: "/personal-care/refreshing-wipes" },
      { title: "Paper Napkins", href: "/personal-care/paper-napkins" },
      { title: "Toilet Roll", href: "/personal-care/toilet-roll" },
      { title: "Bath Soap", href: "/personal-care/bath-soap" },
    ],
  },
];

export const platformConfig = {
    amazon: {
      name: "Amazon",
      logoSrc: "/Images/amazon_logo.svg",
    },
    flipkart: {
      name: "Flipkart",
      logoSrc: "/Images/flipkart_logo.webp",
    },
    meesho: {
      name: "Meesho",
      logoSrc: "/Images/meesho_logo.png",
    },
  };


  export interface BannerProps {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    priority: number;
    ctaText?: string;
    ctaUrl?: string;
    backgroundColor?: string;
  }