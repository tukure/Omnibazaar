import { User, Product, TradeOffer, Message } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    username: 'Alex_Tech',
    email: 'alex@omnibazaar.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    location: {
      country: 'Canada',
      province: 'Ontario',
      address: '450 Yonge Street, Apt 12B',
      postalCode: 'M5B 1T8'
    },
    createdAt: '2025-01-10T10:00:00Z',
    rating: 4.9,
    tradesCompleted: 14
  },
  {
    id: 'user_2',
    username: 'Sophia_Vintage',
    email: 'sophia@omnibazaar.com',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    location: {
      country: 'United States',
      province: 'California',
      address: '742 Evergreen Terrace',
      postalCode: '90210'
    },
    createdAt: '2025-02-01T14:30:00Z',
    rating: 4.8,
    tradesCompleted: 22
  },
  {
    id: 'user_3',
    username: 'Liam_Audio',
    email: 'liam@omnibazaar.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    location: {
      country: 'United Kingdom',
      province: 'Greater London',
      address: '221B Baker Street',
      postalCode: 'NW1 6XE'
    },
    createdAt: '2025-02-15T09:15:00Z',
    rating: 5.0,
    tradesCompleted: 9
  },
  {
    id: 'user_4',
    username: 'Elena_Kicks',
    email: 'elena@omnibazaar.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    location: {
      country: 'Germany',
      province: 'Bavaria',
      address: 'Leopoldstraße 42',
      postalCode: '80802'
    },
    createdAt: '2025-03-01T11:20:00Z',
    rating: 4.7,
    tradesCompleted: 18
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    sellerId: 'user_1',
    sellerUsername: 'Alex_Tech',
    title: 'Sony WH-1000XM5 Wireless Headphones - Midnight Blue',
    description: 'Pristine condition Sony noise-canceling headphones. Includes original magnetic case, audio cable, and USB-C charger. Looking to trade for a mechanical keyboard or sell.',
    price: 320,
    category: 'Electronics',
    condition: 'Like New',
    listingType: 'Sale & Trade',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    location: {
      country: 'Canada',
      province: 'Ontario',
      address: '450 Yonge Street, Apt 12B',
      postalCode: 'M5B 1T8'
    },
    createdAt: '2026-07-15T12:00:00Z',
    featured: true,
    viewsCount: 142
  },
  {
    id: 'prod_2',
    sellerId: 'user_2',
    sellerUsername: 'Sophia_Vintage',
    title: 'Vintage Canon AE-1 35mm SLR Camera + 50mm f/1.8 Lens',
    description: 'Classic analog film camera in full working order. Fresh light seals, crisp shutter, clear optics. Open for trade with audio gear or retro gaming consoles.',
    price: 260,
    category: 'Collectibles & Art',
    condition: 'Good',
    listingType: 'Sale & Trade',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
    location: {
      country: 'United States',
      province: 'California',
      address: '742 Evergreen Terrace',
      postalCode: '90210'
    },
    createdAt: '2026-07-18T16:20:00Z',
    featured: true,
    viewsCount: 289
  },
  {
    id: 'prod_3',
    sellerId: 'user_3',
    sellerUsername: 'Liam_Audio',
    title: 'Fender Player Telecaster Electric Guitar - Butterscotch Blonde',
    description: 'Beautiful Mexican-made Fender Telecaster with maple fretboard. Smooth neck, punchy pickups. Interested in trading for a synth synthesizer or selling directly.',
    price: 650,
    category: 'Books & Music',
    condition: 'Like New',
    listingType: 'Sale & Trade',
    imageUrl: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?auto=format&fit=crop&q=80&w=800',
    location: {
      country: 'United Kingdom',
      province: 'Greater London',
      address: '221B Baker Street',
      postalCode: 'NW1 6XE'
    },
    createdAt: '2026-07-19T10:10:00Z',
    featured: true,
    viewsCount: 195
  },
  {
    id: 'prod_4',
    sellerId: 'user_4',
    sellerUsername: 'Elena_Kicks',
    title: 'Nike Air Jordan 1 High OG "Chicago" (US 10)',
    description: 'Authentic 2022 release, worn twice indoors. Comes with original box and extra laces. Will consider trades for Apple Watch Ultra or high-end streetwear.',
    price: 450,
    category: 'Fashion & Apparel',
    condition: 'Like New',
    listingType: 'Sale & Trade',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800',
    location: {
      country: 'Germany',
      province: 'Bavaria',
      address: 'Leopoldstraße 42',
      postalCode: '80802'
    },
    createdAt: '2026-07-20T14:00:00Z',
    featured: true,
    viewsCount: 310
  },
  {
    id: 'prod_5',
    sellerId: 'user_1',
    sellerUsername: 'Alex_Tech',
    title: 'Apple iPad Pro 11" M2 Chip (128GB, Space Gray)',
    description: 'Fast and responsive tablet with Liquid Retina display. Minimal usage, screen protector applied since day one. Includes Apple Pencil v2.',
    price: 680,
    category: 'Electronics',
    condition: 'New',
    listingType: 'Sale Only',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
    location: {
      country: 'Canada',
      province: 'Ontario',
      address: '450 Yonge Street, Apt 12B',
      postalCode: 'M5B 1T8'
    },
    createdAt: '2026-07-21T08:30:00Z',
    viewsCount: 88
  },
  {
    id: 'prod_6',
    sellerId: 'user_2',
    sellerUsername: 'Sophia_Vintage',
    title: 'Nintendo Game Boy Color (Atomic Purple) + Pokemon Yellow',
    description: 'Authentic retro handheld console with new backlight IPS lens mod and clean shell. Comes with original Pokemon Yellow cartridge.',
    price: 195,
    category: 'Gaming & Toys',
    condition: 'Good',
    listingType: 'Trade Only',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    location: {
      country: 'United States',
      province: 'California',
      address: '742 Evergreen Terrace',
      postalCode: '90210'
    },
    createdAt: '2026-07-21T18:45:00Z',
    viewsCount: 420
  },
  {
    id: 'prod_7',
    sellerId: 'user_1',
    sellerUsername: 'Alex_Tech',
    title: 'Purebred Golden Retriever Puppies (AKC Registered & Vet Checked)',
    description: 'Playful, healthy, and family-socialized Golden Retriever puppies from champion bloodlines. Vaccinated, microchipped, and health guaranteed. Open to direct trade for farm equipment or sale.',
    price: 1200,
    category: 'Livestock & Pets',
    condition: 'New',
    listingType: 'Sale & Trade',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
    location: {
      country: 'Canada',
      province: 'Ontario',
      address: '450 Yonge Street, Apt 12B',
      postalCode: 'M5B 1T8'
    },
    createdAt: '2026-07-22T09:00:00Z',
    featured: true,
    viewsCount: 340
  },
  {
    id: 'prod_8',
    sellerId: 'user_2',
    sellerUsername: 'Sophia_Vintage',
    title: 'Registered Black Angus Cattle & Young Breeding Calves',
    description: 'Top-tier genetic Black Angus bull and pasture-raised healthy calves. Docile temperament, excellent weight records. Ideal for farm expansion or direct livestock trade.',
    price: 2800,
    category: 'Livestock & Pets',
    condition: 'Good',
    listingType: 'Sale & Trade',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800',
    location: {
      country: 'United States',
      province: 'California',
      address: '742 Evergreen Terrace',
      postalCode: '90210'
    },
    createdAt: '2026-07-22T11:30:00Z',
    featured: true,
    viewsCount: 512
  },
  {
    id: 'prod_9',
    sellerId: 'user_4',
    sellerUsername: 'Elena_Kicks',
    title: 'Flock of Heritage Laying Hens (Rhode Island Red & Plymouth Rock)',
    description: 'Group of 10 organic pasture-raised hens laying fresh eggs daily. Includes automatic feeder and watering kit. Willing to trade for power tools or garden equipment.',
    price: 250,
    category: 'Livestock & Pets',
    condition: 'Good',
    listingType: 'Sale & Trade',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800',
    location: {
      country: 'Germany',
      province: 'Bavaria',
      address: 'Leopoldstraße 42',
      postalCode: '80802'
    },
    createdAt: '2026-07-22T14:15:00Z',
    featured: false,
    viewsCount: 210
  },
  {
    id: 'prod_10',
    sellerId: 'user_3',
    sellerUsername: 'Liam_Audio',
    title: 'Purebred Registered Arabian Mare (Trail & Pleasure Trained)',
    description: '6-year-old registered Arabian mare with outstanding pedigree and gentle disposition. Fully trained for trail riding. Looking for trade with horse trailer or direct purchase.',
    price: 4500,
    category: 'Livestock & Pets',
    condition: 'Like New',
    listingType: 'Sale & Trade',
    imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800',
    location: {
      country: 'United Kingdom',
      province: 'Greater London',
      address: '221B Baker Street',
      postalCode: 'NW1 6XE'
    },
    createdAt: '2026-07-22T16:00:00Z',
    featured: true,
    viewsCount: 680
  }
];

export const INITIAL_OFFERS: TradeOffer[] = [
  {
    id: 'offer_1',
    senderId: 'user_2',
    senderUsername: 'Sophia_Vintage',
    recipientId: 'user_1',
    recipientUsername: 'Alex_Tech',
    targetProductId: 'prod_1',
    targetProductTitle: 'Sony WH-1000XM5 Wireless Headphones - Midnight Blue',
    targetProductImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    offeredItem: {
      title: 'Vintage Film Camera Canon AE-1',
      description: 'Fully serviced film camera in great condition.',
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
      estimatedValue: 260,
      condition: 'Good',
      existingProductId: 'prod_2'
    },
    cashTopUp: 40,
    note: 'Hi Alex! I love those Sony headphones. Would you be down to trade them for my vintage Canon AE-1 camera plus $40 cash on top?',
    status: 'pending',
    createdAt: '2026-07-21T19:00:00Z'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    conversationId: 'user_2_user_1_prod_1',
    senderId: 'user_2',
    senderUsername: 'Sophia_Vintage',
    recipientId: 'user_1',
    recipientUsername: 'Alex_Tech',
    productId: 'prod_1',
    tradeOfferId: 'offer_1',
    text: '🎁 [TRADE PROPOSAL] Offered "Vintage Film Camera Canon AE-1" + $40 cash top-up for your "Sony WH-1000XM5 Headphones". Note: Hi Alex! I love those Sony headphones. Would you be down to trade them for my vintage Canon AE-1 camera plus $40 cash on top?',
    createdAt: '2026-07-21T19:00:00Z',
    read: false
  }
];
