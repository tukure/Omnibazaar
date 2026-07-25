import { supabase, SUPABASE_PROJECT_ID } from '../lib/supabase';
import { User, Product, TradeOffer, Message } from '../types';
import { INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_OFFERS, INITIAL_MESSAGES } from '../data/mockData';

export interface SupabaseSyncState {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
  tablesInitialized: boolean;
}

// Convert DB snake_case user to app camelCase User
function mapDbUser(row: any): User {
  return {
    id: row.id,
    username: row.username,
    password: row.password || undefined,
    email: row.email || undefined,
    avatarUrl: row.avatar_url || row.avatarUrl || undefined,
    location: row.location || { country: 'Canada', province: 'Ontario', address: '', postalCode: '' },
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    rating: Number(row.rating ?? 5.0),
    tradesCompleted: Number(row.trades_completed ?? row.tradesCompleted ?? 0),
  };
}

function mapUserToDb(user: User): any {
  return {
    id: user.id,
    username: user.username,
    password: user.password || null,
    email: user.email || null,
    avatar_url: user.avatarUrl || null,
    location: user.location,
    created_at: user.createdAt,
    rating: user.rating ?? 5.0,
    trades_completed: user.tradesCompleted ?? 0,
  };
}

// Convert DB snake_case product to app camelCase Product
function mapDbProduct(row: any): Product {
  return {
    id: row.id,
    sellerId: row.seller_id || row.sellerId,
    sellerUsername: row.seller_username || row.sellerUsername,
    title: row.title,
    description: row.description || '',
    price: Number(row.price ?? 0),
    category: row.category || 'General',
    condition: row.condition || 'Good',
    listingType: row.listing_type || row.listingType || 'Sale & Trade',
    imageUrl: row.image_url || row.imageUrl || '',
    additionalImages: row.additional_images || row.additionalImages || [],
    location: row.location || { country: 'Canada', province: 'Ontario', address: '', postalCode: '' },
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    isSold: Boolean(row.is_sold ?? row.isSold),
    isTraded: Boolean(row.is_traded ?? row.isTraded),
    featured: Boolean(row.featured),
    viewsCount: Number(row.views_count ?? row.viewsCount ?? 1),
  };
}

function mapProductToDb(p: Product): any {
  return {
    id: p.id,
    seller_id: p.sellerId,
    seller_username: p.sellerUsername,
    title: p.title,
    description: p.description,
    price: p.price,
    category: p.category,
    condition: p.condition,
    listing_type: p.listingType,
    image_url: p.imageUrl,
    additional_images: p.additionalImages || [],
    location: p.location,
    created_at: p.createdAt,
    is_sold: p.isSold || false,
    is_traded: p.isTraded || false,
    featured: p.featured || false,
    views_count: p.viewsCount || 1,
  };
}

// Convert DB snake_case offer to app camelCase TradeOffer
function mapDbTradeOffer(row: any): TradeOffer {
  return {
    id: row.id,
    senderId: row.sender_id || row.senderId,
    senderUsername: row.sender_username || row.senderUsername,
    recipientId: row.recipient_id || row.recipientId,
    recipientUsername: row.recipient_username || row.recipientUsername,
    targetProductId: row.target_product_id || row.targetProductId,
    targetProductTitle: row.target_product_title || row.targetProductTitle,
    targetProductImageUrl: row.target_product_image_url || row.targetProductImageUrl,
    offeredItem: row.offered_item || row.offeredItem,
    cashTopUp: Number(row.cash_top_up ?? row.cashTopUp ?? 0),
    note: row.note || '',
    status: row.status || 'pending',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function mapTradeOfferToDb(o: TradeOffer): any {
  return {
    id: o.id,
    sender_id: o.senderId,
    sender_username: o.senderUsername,
    recipient_id: o.recipientId,
    recipient_username: o.recipientUsername,
    target_product_id: o.targetProductId,
    target_product_title: o.targetProductTitle,
    target_product_image_url: o.targetProductImageUrl,
    offered_item: o.offeredItem,
    cash_top_up: o.cashTopUp,
    note: o.note,
    status: o.status,
    created_at: o.createdAt,
  };
}

// Convert DB snake_case message to app camelCase Message
function mapDbMessage(row: any): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id || row.conversationId,
    senderId: row.sender_id || row.senderId,
    senderUsername: row.sender_username || row.senderUsername,
    recipientId: row.recipient_id || row.recipientId,
    recipientUsername: row.recipient_username || row.recipientUsername,
    productId: row.product_id || row.productId,
    tradeOfferId: row.trade_offer_id || row.tradeOfferId,
    text: row.text || '',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    read: Boolean(row.read),
    isSystemNotification: Boolean(row.is_system_notification ?? row.isSystemNotification),
  };
}

function mapMessageToDb(m: Message): any {
  return {
    id: m.id,
    conversation_id: m.conversationId,
    sender_id: m.senderId,
    sender_username: m.senderUsername,
    recipient_id: m.recipientId,
    recipient_username: m.recipientUsername,
    product_id: m.productId || null,
    trade_offer_id: m.tradeOfferId || null,
    text: m.text,
    created_at: m.createdAt,
    read: m.read || false,
    is_system_notification: m.isSystemNotification || false,
  };
}

export class SupabaseService {
  static async checkConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('users').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase ping check warning:', error.message);
      }
      return !error;
    } catch (err) {
      console.error('Supabase connection failed:', err);
      return false;
    }
  }

  // Seed default data if tables are empty
  static async seedInitialDataIfNeeded(): Promise<void> {
    try {
      // Users
      const { data: users, error: userErr } = await supabase.from('users').select('id');
      if (!userErr && (!users || users.length === 0)) {
        console.log('Seeding initial users to Supabase...');
        await supabase.from('users').upsert(INITIAL_USERS.map(mapUserToDb));
      }

      // Products
      const { data: prods, error: prodErr } = await supabase.from('products').select('id');
      if (!prodErr && (!prods || prods.length === 0)) {
        console.log('Seeding initial products to Supabase...');
        await supabase.from('products').upsert(INITIAL_PRODUCTS.map(mapProductToDb));
      }

      // Trade Offers
      const { data: offers, error: offerErr } = await supabase.from('trade_offers').select('id');
      if (!offerErr && (!offers || offers.length === 0)) {
        console.log('Seeding initial trade offers to Supabase...');
        await supabase.from('trade_offers').upsert(INITIAL_OFFERS.map(mapTradeOfferToDb));
      }

      // Messages
      const { data: msgs, error: msgErr } = await supabase.from('messages').select('id');
      if (!msgErr && (!msgs || msgs.length === 0)) {
        console.log('Seeding initial messages to Supabase...');
        await supabase.from('messages').upsert(INITIAL_MESSAGES.map(mapMessageToDb));
      }
    } catch (e) {
      console.warn('Error during initial data seed attempt:', e);
    }
  }

  // Fetch Users
  static async fetchUsers(): Promise<User[] | null> {
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map(mapDbUser);
    } catch (e) {
      return null;
    }
  }

  // Save User
  static async saveUser(user: User): Promise<boolean> {
    try {
      const { error } = await supabase.from('users').upsert([mapUserToDb(user)]);
      return !error;
    } catch (e) {
      return false;
    }
  }

  // Fetch Products
  static async fetchProducts(): Promise<Product[] | null> {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map(mapDbProduct);
    } catch (e) {
      return null;
    }
  }

  // Save Product
  static async saveProduct(product: Product): Promise<boolean> {
    try {
      const { error } = await supabase.from('products').upsert([mapProductToDb(product)]);
      return !error;
    } catch (e) {
      return false;
    }
  }

  // Delete Product
  static async deleteProduct(productId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      return !error;
    } catch (e) {
      return false;
    }
  }

  // Fetch Trade Offers
  static async fetchTradeOffers(): Promise<TradeOffer[] | null> {
    try {
      const { data, error } = await supabase.from('trade_offers').select('*').order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map(mapDbTradeOffer);
    } catch (e) {
      return null;
    }
  }

  // Save Trade Offer
  static async saveTradeOffer(offer: TradeOffer): Promise<boolean> {
    try {
      const { error } = await supabase.from('trade_offers').upsert([mapTradeOfferToDb(offer)]);
      return !error;
    } catch (e) {
      return false;
    }
  }

  // Fetch Messages
  static async fetchMessages(): Promise<Message[] | null> {
    try {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      if (error || !data) return null;
      return data.map(mapDbMessage);
    } catch (e) {
      return null;
    }
  }

  // Save Message
  static async saveMessage(msg: Message): Promise<boolean> {
    try {
      const { error } = await supabase.from('messages').upsert([mapMessageToDb(msg)]);
      return !error;
    } catch (e) {
      return false;
    }
  }

  // Update read status for messages
  static async markMessagesRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('messages').update({ read: true }).eq('recipient_id', userId);
      return !error;
    } catch (e) {
      return false;
    }
  }
}
