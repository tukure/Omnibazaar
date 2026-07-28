export interface LocationInfo {
  country: string;
  province: string;
  city?: string;
  address: string;
  postalCode: string;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  email?: string;
  avatarUrl?: string;
  location: LocationInfo;
  createdAt: string;
  rating?: number;
  tradesCompleted?: number;
}

export type ProductCondition = 'New' | 'Like New' | 'Good' | 'Fair';

export type ListingType = 'Sale & Trade' | 'Sale Only' | 'Trade Only' | 'Free / Donation';

export interface Product {
  id: string;
  sellerId: string;
  sellerUsername: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ProductCondition;
  listingType: ListingType;
  imageUrl: string;
  additionalImages?: string[];
  location: LocationInfo;
  createdAt: string;
  isSold?: boolean;
  isTraded?: boolean;
  isFree?: boolean;
  isClaimed?: boolean;
  featured?: boolean;
  viewsCount?: number;
}

export type TradeStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface TradeItem {
  title: string;
  description: string;
  imageUrl: string;
  estimatedValue: number;
  condition: ProductCondition;
  existingProductId?: string;
}

export interface TradeOffer {
  id: string;
  senderId: string;
  senderUsername: string;
  recipientId: string;
  recipientUsername: string;
  targetProductId: string;
  targetProductTitle: string;
  targetProductImageUrl: string;
  offeredItem: TradeItem;
  cashTopUp: number; // Positive means sender gives extra cash, negative means asks cash
  note: string;
  status: TradeStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderUsername: string;
  recipientId: string;
  recipientUsername: string;
  productId?: string;
  tradeOfferId?: string;
  text: string;
  createdAt: string;
  read: boolean;
  isSystemNotification?: boolean;
}

export type ActiveTab = 'explore' | 'free' | 'my-listings' | 'trades' | 'messages' | 'profile';
