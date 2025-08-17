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
    name: "My Orders",
    href: "/my-orders",
    icon: ShoppingBag,
    badge: "2",
  },
  {
    name: "Wishlist",
    href: "/my-wishlist",
    icon: Heart,
    badge: "5",
  },
  {
    name: "Addresses",
    href: "/addresses",
    icon: MapPin,
  },
  {
    name: "Payment Methods",
    href: "/payment-methods",
    icon: CreditCard,
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
    name: "Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
    rating: 4,
    comment:
      "The 3D product viewer is absolutely amazing! I could see every detail of the serum bottle before purchasing. The quality exceeded my expectations.",
    product: "Radiance Renewal Serum",
    location: "New York, NY",
    handle: "@sarahjohnson",
  },
  {
    id: 2,
    name: "Emily Chen",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
    rating: 5,
    comment:
      "Alma has transformed my skincare routine. The products are luxurious and effective. I love how I can explore products in 3D before buying.",
    product: "Velvet Rose Body Cream",
    location: "Los Angeles, CA",
    handle: "@emilychen",
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    avatar:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=200",
    rating: 3,
    comment:
      "The Midnight Bloom perfume is divine! The 3D experience helped me understand the bottle design perfectly. Fast shipping and beautiful packaging.",
    product: "Midnight Bloom Perfume",
    location: "Miami, FL",
    handle: "@mariarodriguez",
  },
  {
    id: 4,
    name: "Jessica Wu",
    avatar:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
    rating: 4,
    comment:
      "Outstanding customer service and product quality. The interactive 3D models make online shopping feel like being in a luxury store.",
    product: "Hydrating Face Mask",
    location: "Seattle, WA",
    handle: "jessicawu199",
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
  sellers: string;
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
