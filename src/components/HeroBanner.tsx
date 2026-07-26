import React from 'react';
import { Repeat, ShieldCheck, Globe, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { LogoImage } from './LogoImage';

interface HeroBannerProps {
  onOpenCreateProduct: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const CATEGORIES = [
  'All',
  'Livestock & Pets',
  'Electronics',
  'Fashion & Apparel',
  'Collectibles & Art',
  'Gaming & Toys',
  'Books & Music',
  'Sports & Outdoors',
  'Home & Garden'
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenCreateProduct,
  onSelectCategory,
  selectedCategory
}) => {
  return (
    <div className="bg-[#0D0D0D] border-b border-[#222222] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Content & Showcase Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#182533] border border-[#2D4158] text-[#93ACCC] rounded-full text-xs font-bold mb-4 animate-in fade-in slide-in-from-bottom-2 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-white p-0.5 border border-[#3A506B] flex items-center justify-center shrink-0 overflow-hidden">
                <LogoImage alt="OmniBazaar Logo" className="w-full h-full object-contain" />
              </div>
              <span className="uppercase tracking-widest text-[10px] text-white">OmniBazaar P2P Barter & Direct Trading Network</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif italic text-white tracking-tight leading-tight">
              Curated Global Marketplace & <span className="text-[#93ACCC] not-italic font-sans font-bold">Direct Trades</span>
            </h1>

            <p className="mt-3.5 text-sm sm:text-base text-[#888888] leading-relaxed max-w-2xl">
              List premium products with verified location details. Swap luxury cameras, silk apparel, rare vintage gear & design objects directly with verified members worldwide.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenCreateProduct}
                className="px-6 py-3 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-full text-xs sm:text-sm transition-all flex items-center gap-2 hover:scale-[1.02] shadow-md"
              >
                <Repeat className="w-4 h-4 text-[#93ACCC]" />
                <span>+ Create Trade Listing</span>
              </button>

              <a
                href="#marketplace-grid"
                className="px-6 py-3 bg-[#1A1A1A] border border-[#333333] text-white font-medium rounded-full text-xs sm:text-sm hover:border-[#3A506B] transition-all flex items-center gap-2"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4 text-[#888888]" />
              </a>
            </div>

            {/* Value Props Pills with OmniBazaar Logo */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-semibold text-[#666666]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-white p-0.5 border border-[#444444] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  <LogoImage alt="OmniBazaar Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-[#888888]">Global & Regional Regions</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-white p-0.5 border border-[#444444] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  <LogoImage alt="OmniBazaar Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-[#888888]">End-to-End Encrypted Trades</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-white p-0.5 border border-[#444444] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  <LogoImage alt="OmniBazaar Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-[#888888]">Instant Product Vault</span>
              </div>
            </div>
          </div>

          {/* Right Column: OmniBazaar Featured Logo Emblem Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-[#444444] transition-all">
              
              {/* Decorative Subtle Ambient Glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#222222]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">Official Partner Network</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#182533] border border-[#2D4158] text-[#93ACCC]">
                  Verified Engine
                </span>
              </div>

              {/* Logo Presentation Frame */}
              <div className="w-full h-52 rounded-2xl overflow-hidden bg-white my-2 shadow-md group-hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center border border-[#3A506B]">
                <LogoImage alt="OmniBazaar Official Network Logo" className="w-full h-full object-cover" />
              </div>

              <div className="mt-4 space-y-2 text-center">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Powered by OmniBazaar Trading Protocol
                </h3>
                <p className="text-xs text-[#888888]">
                  Zero-fee peer-to-peer item exchanges, verified member profiles & shipping address matching.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-around text-[11px] text-[#AAAAAA] font-mono">
                <div><span className="text-[#93ACCC] font-bold">100%</span> Verified</div>
                <div className="text-[#333333]">|</div>
                <div><span className="text-[#93ACCC] font-bold">24/7</span> Direct Swap</div>
                <div className="text-[#333333]">|</div>
                <div><span className="text-[#93ACCC] font-bold">Global</span> Escrow</div>
              </div>

            </div>
          </div>

        </div>

        {/* Categories Bar */}
        <div id="marketplace-grid" className="mt-8 pt-6 border-t border-[#222222]">
          <p className="text-[10px] font-bold text-[#555555] uppercase tracking-widest mb-3">
            Browse Categories:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-[#21303E] border border-[#3A506B] text-white font-bold shadow-sm'
                    : cat === 'Livestock & Pets'
                    ? 'bg-[#182533] border border-[#2D4158] text-[#93ACCC] font-semibold hover:border-[#3A506B]'
                    : 'bg-[#151515] border border-[#222222] text-[#888888] hover:text-white hover:border-[#333333]'
                }`}
              >
                {cat === 'Livestock & Pets' && <span className="text-xs">🐾</span>}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
