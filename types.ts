export type PlatformName = 'Swiggy' | 'Zomato' | 'EatSure' | 'Magicpin' | 'Direct';

export type DietaryFilter = 'all' | 'veg' | 'non-veg';

export interface PlatformDeal {
  platformName: PlatformName;
  originalPrice: number;
  offerPrice: number;
  promoCode: string;
  discountText: string;
  deliveryFee: number;
  deliveryTimeMins: number;
  rating: number;
  isBestDeal: boolean;
  perks: string[];
  platformColor: string;
  badge?: string;
}

export interface AlternativeRestaurant {
  id: string;
  restaurantName: string;
  dishVariation: string;
  rating: number;
  reviewsCount: number;
  price: number;
  distanceKm: number;
  signatureStyle: string;
  whyBetter: string;
  hygieneScore: string;
  imageUrl: string;
}

export interface FoodItem {
  id: string;
  name: string;
  tagline: string;
  restaurant: string;
  restaurantRating: number;
  dishRating: number;
  reviewCount: number;
  cuisine: string;
  category: 'Biryani' | 'Burger' | 'Pizza' | 'North Indian' | 'South Indian' | 'Chinese' | 'Street Food' | 'Dessert' | 'Healthy' | 'Mexican' | 'Asian' | 'Snacks';
  price: number;
  originalPrice: number;
  description: string;
  mediaType: 'video' | 'image';
  mediaUrl: string;
  videoUrl?: string;
  fallbackVideoUrl?: string;
  posterUrl: string;
  prepTimeMins: number;
  distanceKm: number;
  calories: number;
  proteinGrams: number;
  isVeg: boolean;
  isBestseller: boolean;
  isTrending: boolean;
  spicyLevel: 1 | 2 | 3;
  moods: string[];       // e.g. ['Late Night', 'Comfort', 'Party', 'Stress Buster', 'Quick Lunch']
  cravings: string[];    // e.g. ['Cheesy', 'Spicy', 'Crispy', 'Sweet', 'Soupy', 'Rich']
  budgetTier: 'budget' | 'mid' | 'premium'; // budget: <=180, mid: 181-350, premium: >350
  platforms: PlatformDeal[];
  restaurantCompetitors: AlternativeRestaurant[];
  ingredients: string[];
  chefSpecialty: string;
  likesCount: number;
  sharesCount: number;
}

export interface CartItem {
  cartItemId: string;
  foodItem: FoodItem;
  quantity: number;
  selectedPlatform: PlatformName;
  customization?: string;
  addedAt: number;
}

export type OrderStatus = 'placed' | 'confirmed' | 'cooking' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  itemTotal: number;
  totalDiscount: number;
  deliveryFee: number;
  platformFee: number;
  netPayable: number;
  platformUsed: PlatformName;
  promoCodeApplied?: string;
  deliveryAddress: string;
  status: OrderStatus;
  orderTimestamp: number;
  estimatedDeliveryTimestamp: number;
  rider: {
    name: string;
    phone: string;
    vehicleNumber: string;
    rating: number;
    avatarUrl: string;
  };
  stepLogs: {
    step: OrderStatus;
    label: string;
    time: string;
    completed: boolean;
  }[];
}

export interface UserPreferences {
  mood: string;
  craving: string;
  budget: string;
  cuisine: string;
  maxPrepTime: number;
  vegOnly: boolean;
  dietaryFilter?: DietaryFilter;
}

export interface AIComparisonQuery {
  id: string;
  prompt: string;
  response: string;
  timestamp: number;
  suggestedDish?: FoodItem;
  dealHighlights?: {
    platform: PlatformName;
    dish: string;
    saving: string;
  }[];
}

export type ActiveTab = 'reels' | 'smart_crave' | 'crave_ai' | 'search' | 'cart_orders';
