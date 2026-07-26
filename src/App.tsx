/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LogoImage } from './components/LogoImage';
import { User, Product, TradeOffer, Message, ActiveTab } from './types';
import { 
  getUsers, 
  getCurrentUser, 
  setCurrentUser, 
  getProducts, 
  getTradeOffers, 
  getMessages, 
  markMessagesReadForUser,
  syncWithSupabase
} from './utils/storage';

import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { TradeModal } from './components/TradeModal';
import { CreateProductModal } from './components/CreateProductModal';
import { AuthModal } from './components/AuthModal';
import { MessagesInbox } from './components/MessagesInbox';
import { UserProfileModal } from './components/UserProfileModal';
import { TradeHubView } from './components/TradeHubView';
import { SupabaseStatusModal } from './components/SupabaseStatusModal';

import { 
  Store, 
  Repeat, 
  Users, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Package, 
  CheckCircle2, 
  Search,
  Filter
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUserParams] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Navigation and Filter state
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [filterListingType, setFilterListingType] = useState<string>('All');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signup');
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [tradeTargetProduct, setTradeTargetProduct] = useState<Product | null>(null);

  // Supabase State
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [supabaseSyncState, setSupabaseSyncState] = useState<{
    connected: boolean;
    syncing: boolean;
    lastSynced: string | null;
    counts?: { users: number; products: number; offers: number; messages: number };
    error?: string;
  }>({
    connected: true,
    syncing: false,
    lastSynced: null,
  });

  // Refresh all state from localStorage
  const refreshAppData = () => {
    const user = getCurrentUser();
    setCurrentUserParams(user);
    setProducts(getProducts());
    setTradeOffers(getTradeOffers());
    setMessages(getMessages());
  };

  const handleTriggerSupabaseSync = async () => {
    setSupabaseSyncState(prev => ({ ...prev, syncing: true }));
    const result = await syncWithSupabase();
    setSupabaseSyncState({
      connected: result.connected,
      syncing: false,
      lastSynced: new Date().toISOString(),
      counts: result.syncedCounts,
      error: result.error,
    });
    refreshAppData();
  };

  useEffect(() => {
    refreshAppData();
    handleTriggerSupabaseSync();
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserParams(null);
  };

  // Unread messages count
  const unreadMessagesCount = currentUser
    ? messages.filter(m => m.recipientId === currentUser.id && !m.read).length
    : 0;

  // Mark unread messages read when viewing messages tab
  useEffect(() => {
    if (activeTab === 'messages' && currentUser) {
      markMessagesReadForUser(currentUser.id);
      setMessages(getMessages());
    }
  }, [activeTab, currentUser]);

  // Handle Demo User Quick Switch
  const handleSwitchDemoUser = (user: User) => {
    setCurrentUser(user);
    setCurrentUserParams(user);
    refreshAppData();
  };

  const allUsers = getUsers();

  // Filtered Products for Explore Grid
  const exploreProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesCountry = filterCountry === 'All' || p.location.country === filterCountry;
    const matchesType = filterListingType === 'All' || 
      (filterListingType === 'Trade' && (p.listingType === 'Sale & Trade' || p.listingType === 'Trade Only')) ||
      (filterListingType === 'Sale' && (p.listingType === 'Sale & Trade' || p.listingType === 'Sale Only'));

    const queryLower = searchQuery.toLowerCase().trim();
    const matchesQuery = !queryLower ||
      p.title.toLowerCase().includes(queryLower) ||
      p.description.toLowerCase().includes(queryLower) ||
      p.category.toLowerCase().includes(queryLower) ||
      p.location.country.toLowerCase().includes(queryLower) ||
      p.location.province.toLowerCase().includes(queryLower) ||
      p.location.postalCode.toLowerCase().includes(queryLower);

    return matchesCategory && matchesCountry && matchesType && matchesQuery;
  });

  const availableCountries = Array.from(new Set(products.map(p => p.location.country)));

  // My Listed Products
  const myProducts = currentUser ? products.filter(p => p.sellerId === currentUser.id) : [];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex flex-col font-sans selection:bg-[#21303E] selection:text-white">
      
      {/* Main Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => {
          setAuthInitialMode('signup');
          setIsAuthModalOpen(true);
        }}
        onOpenCreateProduct={() => setIsCreateProductOpen(true)}
        unreadCount={unreadMessagesCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogout={handleLogout}
        onOpenSupabaseStatus={() => setIsSupabaseModalOpen(true)}
        supabaseConnected={supabaseSyncState.connected}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'explore' && (
          <div>
            {/* Hero Section */}
            <HeroBanner
              onOpenCreateProduct={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsCreateProductOpen(true);
              }}
              onSelectCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
            />

            {/* Marketplace Grid Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Secondary Filter Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#222222]">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                    <Store className="w-5 h-5 text-[#93ACCC]" />
                    <span className="italic font-serif">Live Marketplace</span>
                  </h2>
                  <span className="px-2.5 py-0.5 bg-[#182533] border border-[#2D4158] text-[#93ACCC] text-xs font-bold rounded-full">
                    {exploreProducts.length} items
                  </span>
                </div>

                {/* Country and Listing Type Filters */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 bg-[#111111] p-1 border border-[#222222] rounded-xl">
                    <span className="px-2 font-bold text-[#666666]">Type:</span>
                    <button
                      onClick={() => setFilterListingType('All')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        filterListingType === 'All' ? 'bg-[#21303E] border border-[#3A506B] text-white font-bold' : 'text-[#888888] hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterListingType('Trade')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        filterListingType === 'Trade' ? 'bg-[#21303E] border border-[#3A506B] text-white font-bold' : 'text-[#888888] hover:text-white'
                      }`}
                    >
                      Trade Eligible
                    </button>
                    <button
                      onClick={() => setFilterListingType('Sale')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        filterListingType === 'Sale' ? 'bg-[#21303E] border border-[#3A506B] text-white font-bold' : 'text-[#888888] hover:text-white'
                      }`}
                    >
                      Buy Only
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-[#111111] p-1 border border-[#222222] rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-[#93ACCC] ml-1" />
                    <select
                      value={filterCountry}
                      onChange={(e) => setFilterCountry(e.target.value)}
                      className="bg-transparent pr-2 py-1 text-xs font-semibold focus:outline-none text-[#CCCCCC]"
                    >
                      <option value="All" className="bg-[#111111] text-white">All Countries</option>
                      {availableCountries.map(c => (
                        <option key={c} value={c} className="bg-[#111111] text-white">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid */}
              {exploreProducts.length === 0 ? (
                <div className="text-center py-16 bg-[#111111] rounded-3xl border border-[#222222] p-8">
                  <Package className="w-12 h-12 text-[#444444] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white">No products found</h3>
                  <p className="text-xs text-[#888888] mt-1 max-w-sm mx-auto">
                    No items match your search filters. Try clearing filters or list your own product for sale or trade!
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setFilterCountry('All');
                      setFilterListingType('All');
                    }}
                    className="mt-4 px-4 py-2 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white text-xs font-bold rounded-xl transition-all shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {exploreProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetail={setDetailProduct}
                      onInitiateTrade={(prod) => {
                        if (!currentUser) {
                          setIsAuthModalOpen(true);
                        } else {
                          setTradeTargetProduct(prod);
                        }
                      }}
                      isOwner={currentUser?.id === product.sellerId}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {activeTab === 'trades' && (
          <TradeHubView
            products={products}
            currentUser={currentUser}
            onViewDetail={setDetailProduct}
            onInitiateTrade={(prod) => {
              if (!currentUser) setIsAuthModalOpen(true);
              else setTradeTargetProduct(prod);
            }}
            onOpenCreateProduct={() => {
              if (!currentUser) setIsAuthModalOpen(true);
              else setIsCreateProductOpen(true);
            }}
          />
        )}

        {activeTab === 'messages' && (
          currentUser ? (
            <MessagesInbox
              currentUser={currentUser}
              messages={messages}
              tradeOffers={tradeOffers}
              onRefreshData={refreshAppData}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 text-center bg-[#111111] rounded-3xl border border-[#222222]">
              <Users className="w-12 h-12 text-[#93ACCC] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Sign In to View Messages</h3>
              <p className="text-xs text-[#888888] mt-1 mb-4">
                Sign in with your username & password to manage trade requests and buyer inquiries.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full py-2.5 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-xl text-xs shadow-md"
              >
                Sign In / Sign Up
              </button>
            </div>
          )
        )}

        {activeTab === 'my-listings' && (
          currentUser ? (
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white italic font-serif">My Listed Products</h2>
                  <p className="text-xs text-[#888888]">
                    Manage your items listed on OmniBazaar.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateProductOpen(true)}
                  className="px-4 py-2 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-xl text-xs shadow-md"
                >
                  + Add New Product
                </button>
              </div>

              {myProducts.length === 0 ? (
                <div className="text-center py-12 bg-[#111111] rounded-3xl border border-[#222222]">
                  <Package className="w-10 h-10 text-[#444444] mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">You have no listed products.</p>
                  <button
                    onClick={() => setIsCreateProductOpen(true)}
                    className="mt-3 px-4 py-2 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Create Product Listing
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetail={setDetailProduct}
                      onInitiateTrade={() => {}}
                      isOwner={true}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 text-center bg-[#111111] rounded-3xl border border-[#222222]">
              <Package className="w-12 h-12 text-[#93ACCC] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Sign In to View Your Products</h3>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="mt-4 w-full py-2.5 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-xl text-xs shadow-md"
              >
                Sign In / Sign Up
              </button>
            </div>
          )
        )}

        {activeTab === 'profile' && (
          currentUser ? (
            <UserProfileModal
              currentUser={currentUser}
              userProducts={myProducts}
              onProfileUpdated={(updated) => {
                setCurrentUserParams(updated);
                refreshAppData();
              }}
              onRefreshData={refreshAppData}
              onOpenCreateProduct={() => setIsCreateProductOpen(true)}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 text-center bg-[#111111] rounded-3xl border border-[#222222]">
              <Users className="w-12 h-12 text-[#93ACCC] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Sign In Required</h3>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="mt-4 w-full py-2.5 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-xl text-xs shadow-md"
              >
                Sign In / Sign Up
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] border-t border-[#222222] py-8 text-center text-xs text-[#555555]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-white p-0.5 border border-[#3A506B] flex items-center justify-center shrink-0 overflow-hidden">
              <LogoImage alt="OmniBazaar Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-white tracking-wider uppercase text-[10px]">OmniBazaar</span>
            <span>— Global Direct Trade & Marketplace</span>
          </div>

          <div className="flex items-center gap-4 text-[#555555] uppercase tracking-widest text-[10px]">
            <span>Verified Users</span>
            <span>•</span>
            <span>P2P Bartering</span>
            <span>•</span>
            <span>Encrypted Trading</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUserParams(user);
          refreshAppData();
        }}
        initialMode={authInitialMode}
      />

      {currentUser && (
        <CreateProductModal
          isOpen={isCreateProductOpen}
          onClose={() => setIsCreateProductOpen(false)}
          currentUser={currentUser}
          onProductCreated={refreshAppData}
        />
      )}

      <ProductDetailModal
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        product={detailProduct}
        currentUser={currentUser}
        onInitiateTrade={(prod) => {
          setDetailProduct(null);
          if (!currentUser) setIsAuthModalOpen(true);
          else setTradeTargetProduct(prod);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {currentUser && (
        <TradeModal
          isOpen={!!tradeTargetProduct}
          onClose={() => setTradeTargetProduct(null)}
          targetProduct={tradeTargetProduct}
          currentUser={currentUser}
          userProducts={myProducts}
          onTradeSubmitted={refreshAppData}
          onOpenCreateProduct={() => {
            setTradeTargetProduct(null);
            setIsCreateProductOpen(true);
          }}
        />
      )}

      <SupabaseStatusModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        syncState={supabaseSyncState}
        onTriggerSync={handleTriggerSupabaseSync}
      />

    </div>
  );
}
