import React, { useState } from 'react';
import { Product, User } from '../types';
import { ProductCard } from './ProductCard';
import { LogoImage } from './LogoImage';
import { Gift, Heart, Sparkles, MapPin, Search, PlusCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { sendMessage } from '../utils/storage';

interface FreeSectionViewProps {
  products: Product[];
  currentUser: User | null;
  onViewDetail: (product: Product) => void;
  onOpenCreateProduct: () => void;
  onOpenAuth: () => void;
  onRefreshData?: () => void;
}

export const FreeSectionView: React.FC<FreeSectionViewProps> = ({
  products,
  currentUser,
  onViewDetail,
  onOpenCreateProduct,
  onOpenAuth,
  onRefreshData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Claim Modal State
  const [claimingProduct, setClaimingProduct] = useState<Product | null>(null);
  const [claimNote, setClaimNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Filter free / donation items
  const freeProducts = products.filter(p => {
    const isFreeListing = p.listingType === 'Free / Donation' || p.price === 0 || p.isFree;
    if (!isFreeListing) return false;

    const matchesCountry = selectedCountry === 'All' || p.location.country === selectedCountry;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location.city && p.location.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.location.province.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCountry && matchesCategory && matchesQuery;
  });

  const availableCountries = Array.from(
    new Set(products.filter(p => p.listingType === 'Free / Donation' || p.price === 0).map(p => p.location.country))
  );

  const categories = ['All', 'Home & Furniture', 'Toys & Hobbies', 'Garden & Outdoors', 'Musical Instruments', 'Electronics', 'Livestock & Pets', 'Clothing & Accessories'];

  const handleOpenClaimModal = (product: Product) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setClaimingProduct(product);
    setClaimNote(`Hello ${product.sellerUsername}, I would love to claim your free donation item "${product.title}". Is it still available for local pickup or shipping?`);
    setClaimSuccess(false);
  };

  const handleSendClaimRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !claimingProduct) return;

    setIsSubmitting(true);
    
    // Create conversation & message to donor
    const conversationId = [currentUser.id, claimingProduct.sellerId].sort().join('_');
    
    sendMessage({
      conversationId,
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      recipientId: claimingProduct.sellerId,
      recipientUsername: claimingProduct.sellerUsername,
      productId: claimingProduct.id,
      text: `🎁 [FREE DONATION REQUEST] ${claimNote}`,
      read: false
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setClaimSuccess(true);
      if (onRefreshData) onRefreshData();
      setTimeout(() => {
        setClaimSuccess(false);
        setClaimingProduct(null);
      }, 2000);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Community Donation Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#064E3B] via-[#0F172A] to-[#022C22] p-6 sm:p-10 border border-[#10B981]/40 shadow-2xl mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10B981]/20 border border-[#10B981]/50 text-[#34D399] rounded-full text-xs font-bold mb-3 shadow-inner">
              <Gift className="w-3.5 h-3.5" />
              <span>OmniBazaar Community Give & Share</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif italic">
              Free Goods & Donation Hub
            </h1>
            
            <p className="text-xs sm:text-sm text-[#A7F3D0] mt-2 leading-relaxed">
              Donate unused items to local neighbors or claim free community giveaways without cash or trade requirements. Zero fees, 100% direct peer-to-peer goodwill.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#10B981]/30 text-xs">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <Sparkles className="w-4 h-4 text-[#34D399]" />
                <span>{freeProducts.length} Items Available Now</span>
              </div>
              <span className="text-[#065F46]">•</span>
              <div className="flex items-center gap-1.5 text-[#A7F3D0]">
                <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>100% Free Peer-to-Peer</span>
              </div>
            </div>
          </div>

          {/* Action Card & Badge */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenCreateProduct}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Donate An Item</span>
            </button>

            <div className="hidden md:flex items-center gap-2 bg-[#065F46]/40 px-4 py-2 rounded-xl border border-[#10B981]/30 text-[11px] text-[#A7F3D0]">
              <LogoImage className="w-5 h-5 shrink-0" />
              <span>OmniBazaar Kindness Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-[#111111] p-4 rounded-2xl border border-[#222222]">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#666666]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search free items, books, furniture, seeds, cities..."
            className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#333333] focus:border-[#10B981] rounded-xl text-xs text-white placeholder-[#555555] focus:outline-none transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-[#1A1A1A] px-3 py-1.5 border border-[#333333] rounded-xl">
            <span className="font-bold text-[#888888]">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none pr-1"
            >
              {categories.map(c => (
                <option key={c} value={c} className="bg-[#1A1A1A] text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div className="flex items-center gap-1 bg-[#1A1A1A] px-3 py-1.5 border border-[#333333] rounded-xl">
            <MapPin className="w-3.5 h-3.5 text-[#34D399]" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none"
            >
              <option value="All" className="bg-[#1A1A1A] text-white">All Countries</option>
              {availableCountries.map(c => (
                <option key={c} value={c} className="bg-[#1A1A1A] text-white">{c}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Free Products Grid */}
      {freeProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#111111] rounded-3xl border border-[#222222] p-8 max-w-lg mx-auto">
          <Gift className="w-12 h-12 text-[#10B981] mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-white">No Free Items Match Your Search</h3>
          <p className="text-xs text-[#888888] mt-1 mb-4">
            Be the first to donate something to your local community or try broadening your location search filters.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('All');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-white text-xs font-bold rounded-xl transition-all"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenCreateProduct}
              className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-slate-950 text-xs font-black rounded-xl transition-all"
            >
              Donate An Item Now
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {freeProducts.map(product => (
            <div key={product.id} className="relative group">
              <ProductCard
                product={product}
                onViewDetail={onViewDetail}
                onInitiateTrade={() => handleOpenClaimModal(product)}
                isOwner={currentUser?.id === product.sellerId}
              />
              
              {/* Overlay button for direct Free Claim */}
              {currentUser?.id !== product.sellerId && (
                <div className="mt-2">
                  <button
                    onClick={() => handleOpenClaimModal(product)}
                    className="w-full py-2 bg-[#064E3B] hover:bg-[#047857] border border-[#10B981]/50 text-[#34D399] hover:text-white text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Claim Free Donation</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Claim Free Item Modal */}
      {claimingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111111] border border-[#10B981]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-[#222222] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#064E3B] flex items-center justify-center text-[#34D399]">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Claim Free Donation</h3>
                  <p className="text-[11px] text-[#A7F3D0]">From donor @{claimingProduct.sellerUsername}</p>
                </div>
              </div>
              <button
                onClick={() => setClaimingProduct(null)}
                className="text-[#666666] hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {claimSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle className="w-12 h-12 text-[#10B981] mx-auto mb-3 animate-bounce" />
                <h4 className="text-lg font-extrabold text-white">Donation Request Sent!</h4>
                <p className="text-xs text-[#888888] mt-1 max-w-xs mx-auto">
                  We sent a direct request to @{claimingProduct.sellerUsername}. You can view updates in your Messages inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendClaimRequest} className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-[#333333]">
                  <img
                    src={claimingProduct.imageUrl}
                    alt={claimingProduct.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{claimingProduct.title}</h4>
                    <p className="text-[10px] text-[#34D399] font-bold mt-0.5">FREE DONATION</p>
                    <p className="text-[10px] text-[#888888]">
                      {claimingProduct.location.city ? `${claimingProduct.location.city}, ` : ''}{claimingProduct.location.province}, {claimingProduct.location.country}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#888888] mb-1">
                    Message to Donor
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={claimNote}
                    onChange={(e) => setClaimNote(e.target.value)}
                    className="w-full p-3 bg-[#1A1A1A] border border-[#333333] focus:border-[#10B981] rounded-xl text-xs text-white focus:outline-none"
                    placeholder="Explain why you'd like to claim this item and specify your pickup availability..."
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setClaimingProduct(null)}
                    className="flex-1 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] text-white text-xs font-bold rounded-xl border border-[#333333]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-[#10B981] hover:bg-[#059669] text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Request'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
