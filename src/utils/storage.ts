import { User, Product, TradeOffer, Message, LocationInfo } from '../types';
import { INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_OFFERS, INITIAL_MESSAGES } from '../data/mockData';
import { SupabaseService } from '../services/supabaseService';

const STORAGE_KEYS = {
  USERS: 'omnibazaar_users',
  CURRENT_USER: 'omnibazaar_current_user',
  PRODUCTS: 'omnibazaar_products',
  TRADE_OFFERS: 'omnibazaar_trade_offers',
  MESSAGES: 'omnibazaar_messages',
};

// Initialize Storage if empty
export function initStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0])); // Default to Alex_Tech
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRADE_OFFERS)) {
    localStorage.setItem(STORAGE_KEYS.TRADE_OFFERS, JSON.stringify(INITIAL_OFFERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
  }
}

// Full bidirectional sync with Supabase
export async function syncWithSupabase(): Promise<{
  connected: boolean;
  syncedCounts?: { users: number; products: number; offers: number; messages: number };
  error?: string;
}> {
  try {
    initStorage();
    
    // Check connection first
    const isConnected = await SupabaseService.checkConnection();
    if (!isConnected) {
      return { connected: false, error: 'Could not connect to Supabase database. Check table schema or RLS policies.' };
    }

    // Try seed initial mock data to Supabase if tables are newly created
    await SupabaseService.seedInitialDataIfNeeded();

    // Fetch remote records from Supabase
    const remoteUsers = await SupabaseService.fetchUsers();
    const remoteProducts = await SupabaseService.fetchProducts();
    const remoteOffers = await SupabaseService.fetchTradeOffers();
    const remoteMessages = await SupabaseService.fetchMessages();

    // Merge or update local storage with Supabase remote state
    if (remoteUsers && remoteUsers.length > 0) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(remoteUsers));
    }
    if (remoteProducts && remoteProducts.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(remoteProducts));
    }
    if (remoteOffers && remoteOffers.length > 0) {
      localStorage.setItem(STORAGE_KEYS.TRADE_OFFERS, JSON.stringify(remoteOffers));
    }
    if (remoteMessages && remoteMessages.length > 0) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(remoteMessages));
    }

    // Sync any local users or products that might not be in Supabase yet
    const localUsers = getUsers();
    for (const u of localUsers) {
      SupabaseService.saveUser(u);
    }

    const localProducts = getProducts();
    for (const p of localProducts) {
      SupabaseService.saveProduct(p);
    }

    return {
      connected: true,
      syncedCounts: {
        users: remoteUsers?.length || localUsers.length,
        products: remoteProducts?.length || localProducts.length,
        offers: remoteOffers?.length || getTradeOffers().length,
        messages: remoteMessages?.length || getMessages().length,
      }
    };
  } catch (err: any) {
    return { connected: false, error: err?.message || 'Supabase sync failed' };
  }
}

// USERS
export function getUsers(): User[] {
  initStorage();
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : INITIAL_USERS;
}

export function getCurrentUser(): User | null {
  initStorage();
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function registerUser(newUserParams: {
  username: string;
  password?: string;
  email?: string;
  location: LocationInfo;
}): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const existing = users.find(u => u.username.toLowerCase() === newUserParams.username.toLowerCase());
  
  if (existing) {
    return { success: false, error: 'Username already taken. Please choose another username.' };
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    username: newUserParams.username.trim(),
    password: newUserParams.password,
    email: newUserParams.email || `${newUserParams.username.toLowerCase()}@omnibazaar.com`,
    avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
    location: newUserParams.location,
    createdAt: new Date().toISOString(),
    rating: 5.0,
    tradesCompleted: 0,
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  setCurrentUser(newUser);

  // Sync to Supabase
  SupabaseService.saveUser(newUser);

  return { success: true, user: newUser };
}

export function loginUser(username: string, password?: string): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());

  if (!user) {
    return { success: false, error: 'User not found. Please check your username or Sign Up.' };
  }

  if (user.password && password && user.password !== password) {
    return { success: false, error: 'Incorrect password.' };
  }

  setCurrentUser(user);
  return { success: true, user };
}

export function updateUserProfile(userId: string, updatedLocation: LocationInfo, avatarUrl?: string): User | null {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx].location = updatedLocation;
    if (avatarUrl) users[idx].avatarUrl = avatarUrl;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const curr = getCurrentUser();
    if (curr && curr.id === userId) {
      setCurrentUser(users[idx]);
    }

    // Sync to Supabase
    SupabaseService.saveUser(users[idx]);

    return users[idx];
  }
  return null;
}

// PRODUCTS
export function getProducts(): Product[] {
  initStorage();
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!data) return INITIAL_PRODUCTS;
  
  try {
    const existingProducts: Product[] = JSON.parse(data);
    const existingIds = new Set(existingProducts.map(p => p.id));
    const missingInitial = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
    
    if (missingInitial.length > 0) {
      const merged = [...existingProducts, ...missingInitial];
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(merged));
      return merged;
    }
    return existingProducts;
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
}

export function addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'viewsCount'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...productData,
    id: `prod_${Date.now()}`,
    createdAt: new Date().toISOString(),
    viewsCount: 1,
    isSold: false,
    isTraded: false
  };

  products.unshift(newProduct);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

  // Sync to Supabase
  SupabaseService.saveProduct(newProduct);

  return newProduct;
}

export function deleteProduct(productId: string): void {
  const products = getProducts().filter(p => p.id !== productId);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

  // Sync to Supabase
  SupabaseService.deleteProduct(productId);
}

// TRADE OFFERS
export function getTradeOffers(): TradeOffer[] {
  initStorage();
  const data = localStorage.getItem(STORAGE_KEYS.TRADE_OFFERS);
  return data ? JSON.parse(data) : INITIAL_OFFERS;
}

export function createTradeOffer(offer: Omit<TradeOffer, 'id' | 'createdAt' | 'status'>): TradeOffer {
  const offers = getTradeOffers();
  const newOffer: TradeOffer = {
    ...offer,
    id: `offer_${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  offers.unshift(newOffer);
  localStorage.setItem(STORAGE_KEYS.TRADE_OFFERS, JSON.stringify(offers));

  // Sync to Supabase
  SupabaseService.saveTradeOffer(newOffer);

  // Auto-send a message in inbox
  const cashText = newOffer.cashTopUp > 0 
    ? ` + $${newOffer.cashTopUp} cash top-up` 
    : newOffer.cashTopUp < 0 
    ? ` (asking $${Math.abs(newOffer.cashTopUp)} cash)` 
    : '';

  sendMessage({
    conversationId: `${newOffer.senderId}_${newOffer.recipientId}_${newOffer.targetProductId}`,
    senderId: newOffer.senderId,
    senderUsername: newOffer.senderUsername,
    recipientId: newOffer.recipientId,
    recipientUsername: newOffer.recipientUsername,
    productId: newOffer.targetProductId,
    tradeOfferId: newOffer.id,
    text: `🎁 [NEW TRADE PROPOSAL] Offered "${newOffer.offeredItem.title}"${cashText} for your "${newOffer.targetProductTitle}".\n\nNote: ${newOffer.note}`
  });

  return newOffer;
}

export function updateTradeOfferStatus(offerId: string, status: 'accepted' | 'declined' | 'cancelled'): void {
  const offers = getTradeOffers();
  const idx = offers.findIndex(o => o.id === offerId);
  if (idx !== -1) {
    offers[idx].status = status;
    localStorage.setItem(STORAGE_KEYS.TRADE_OFFERS, JSON.stringify(offers));

    const offer = offers[idx];
    
    // Sync to Supabase
    SupabaseService.saveTradeOffer(offer);

    // Send system message
    const statusText = status === 'accepted' 
      ? '🎉 TRADE ACCEPTED! Both parties have agreed to exchange items.' 
      : status === 'declined' 
      ? '❌ Trade proposal was declined.' 
      : '🚫 Trade proposal was cancelled.';

    sendMessage({
      conversationId: `${offer.senderId}_${offer.recipientId}_${offer.targetProductId}`,
      senderId: offer.recipientId,
      senderUsername: offer.recipientUsername,
      recipientId: offer.senderId,
      recipientUsername: offer.senderUsername,
      productId: offer.targetProductId,
      tradeOfferId: offer.id,
      text: `${statusText} Regarding "${offer.targetProductTitle}" vs "${offer.offeredItem.title}".`,
      isSystemNotification: true
    });

    if (status === 'accepted') {
      // Mark target product as traded
      const products = getProducts();
      const targetProdIdx = products.findIndex(p => p.id === offer.targetProductId);
      if (targetProdIdx !== -1) {
        products[targetProdIdx].isTraded = true;
        SupabaseService.saveProduct(products[targetProdIdx]);
      }
      if (offer.offeredItem.existingProductId) {
        const offProdIdx = products.findIndex(p => p.id === offer.offeredItem.existingProductId);
        if (offProdIdx !== -1) {
          products[offProdIdx].isTraded = true;
          SupabaseService.saveProduct(products[offProdIdx]);
        }
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  }
}

// MESSAGES
export function getMessages(): Message[] {
  initStorage();
  const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return data ? JSON.parse(data) : INITIAL_MESSAGES;
}

export function sendMessage(msg: Omit<Message, 'id' | 'createdAt' | 'read'>): Message {
  const messages = getMessages();
  const newMessage: Message = {
    ...msg,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    read: false
  };

  messages.push(newMessage);
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));

  // Sync to Supabase
  SupabaseService.saveMessage(newMessage);

  return newMessage;
}

export function markMessagesReadForUser(userId: string): void {
  const messages = getMessages();
  let updated = false;
  messages.forEach(m => {
    if (m.recipientId === userId && !m.read) {
      m.read = true;
      updated = true;
    }
  });
  if (updated) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    SupabaseService.markMessagesRead(userId);
  }
}
