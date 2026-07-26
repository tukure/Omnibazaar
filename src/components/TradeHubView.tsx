import React, { useState } from 'react';
import { Product, User } from '../types';
import { LogoImage } from './LogoImage';
import { ProductCard } from './ProductCard';
import { Repeat, Sparkles, Filter, MapPin, Search } from 'lucide-react';

interface TradeHubViewProps {
  products: Product[];
  currentUser: User | null;
  onViewDetail: (product: Product) => void;
  onInitiateTrade: (product: Product) => void;
  onOpenCreateProduct: () => void;
}

export const TradeHubView: React.FC<TradeHubViewProps> = ({
  products,
  currentUser,
  onViewDetail,
  onInitiateTrade,
  onOpenCreateProduct
}) => {
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products that accept trades
  const tradeableProducts = products.filter(
    p => p.listingType === 'Sale & Trade' || p.listingType === 'Trade Only'
  );

  const filteredProducts = tradeableProducts.filter(p => {
    const matchesCountry = filterCountry === 'All' || p.location.country.toLowerCase() === filterCountry.toLowerCase();
    const matchesQuery = !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  const availableCountries = Array.from(new Set(tradeableProducts.map(p => p.location.country)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#E5E5E5]">
      
      {/* Trade Hub Banner */}
      <div className="bg-[#0D0D0D] border border-[#222222] rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#182533] border border-[#2D4158] rounded-full text-xs font-bold text-[#93ACCC] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#93ACCC]" />
            <span>Peer-to-Peer Barter Network</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif italic tracking-tight leading-tight text-white">
            Global Direct Trade Exchange
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-[#AAAAAA] leading-relaxed">
            Swap your luxury items, gadgets, timepieces, or collectibles with members across the globe. Click any listing's <strong className="text-[#93ACCC]">Trade</strong> button to propose an item-for-item exchange.
          </p>

          <button
            onClick={onOpenCreateProduct}
            className="mt-5 px-5 py-2.5 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-full text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md"
          >
            <Repeat className="w-4 h-4 text-[#93ACCC]" />
            <span>Post an Item for Trade</span>
          </button>
        </div>

        {/* OmniBazaar Logo Badge */}
        <div className="relative z-10 shrink-0 self-center md:self-auto">
          <div className="w-36 h-28 bg-[#0F172A] p-3 rounded-2xl overflow-hidden border border-[#3A506B] flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <LogoImage 
              alt="OmniBazaar Trading Network" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <Repeat className="w-64 h-64 absolute -right-10 -bottom-10 text-white/5 pointer-events-none transform rotate-12" />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          <span className="text-[10px] font-bold text-[#666666] uppercase tracking-widest shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#93ACCC]" /> Country:
          </span>
          <button
            onClick={() => setFilterCountry('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterCountry === 'All'
                ? 'bg-[#21303E] border border-[#3A506B] text-white shadow-sm font-bold'
                : 'bg-[#111111] border border-[#222222] text-[#888888] hover:text-white'
            }`}
          >
            All Countries
          </button>
          {availableCountries.map(country => (
            <button
              key={country}
              onClick={() => setFilterCountry(country)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterCountry === country
                  ? 'bg-[#21303E] border border-[#3A506B] text-white shadow-sm font-bold'
                  : 'bg-[#111111] border border-[#222222] text-[#888888] hover:text-white'
              }`}
            >
              {country}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#666666]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trade items..."
            className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-full text-xs text-white focus:outline-none focus:border-[#3A506B]"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#0D0D0D] rounded-3xl border border-[#222222] p-8">
          <Repeat className="w-12 h-12 text-[#444444] mx-auto mb-3" />
          <h3 className="text-base font-serif italic text-white">No trade items found</h3>
          <p className="text-xs text-[#888888] mt-1">
            Try resetting your country filter or search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={onViewDetail}
              onInitiateTrade={onInitiateTrade}
              isOwner={currentUser?.id === product.sellerId}
            />
          ))}
        </div>
      )}

    </div>
  );
};
