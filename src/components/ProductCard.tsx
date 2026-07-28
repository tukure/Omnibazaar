import React from 'react';
import { Product } from '../types';
import { Repeat, MapPin, Tag, Eye, ArrowUpRight, Gift } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  onInitiateTrade: (product: Product) => void;
  isOwner: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetail,
  onInitiateTrade,
  isOwner
}) => {
  const isTradeable = product.listingType === 'Sale & Trade' || product.listingType === 'Trade Only';

  return (
    <div className="group bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden shadow-xl hover:border-[#3A506B] transition-all duration-300 flex flex-col h-full">
      
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1A1A] cursor-pointer" onClick={() => onViewDetail(product)}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Listing Type Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {(product.listingType === 'Free / Donation' || product.price === 0) ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#064E3B] border border-[#10B981]/50 text-[#34D399] rounded-full text-[10px] font-bold shadow-md">
              <Gift className="w-3 h-3 text-[#34D399]" />
              <span>FREE / DONATION</span>
            </span>
          ) : product.listingType === 'Sale & Trade' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#21303E] border border-[#3A506B] text-white rounded-full text-[10px] font-bold shadow-md">
              <Repeat className="w-3 h-3 text-[#93ACCC]" />
              <span>For Sale & Trade</span>
            </span>
          ) : product.listingType === 'Trade Only' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#182533] border border-[#2D4158] text-[#93ACCC] rounded-full text-[10px] font-bold shadow-md">
              <Repeat className="w-3 h-3 text-[#93ACCC]" />
              <span>Trade Only</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] border border-[#333333] text-white rounded-full text-[10px] font-bold shadow-md">
              <Tag className="w-3 h-3 text-[#93ACCC]" />
              <span>For Sale Only</span>
            </span>
          )}
        </div>

        {/* Condition Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#E5E5E5] text-[10px] font-medium rounded-full border border-[#333333]">
            {product.condition}
          </span>
        </div>

        {/* Status Overlay if Sold/Traded */}
        {(product.isSold || product.isTraded) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center">
            <span className="px-4 py-2 bg-[#21303E] border border-[#3A506B] text-white font-black text-xs uppercase tracking-widest rounded-full shadow-2xl transform -rotate-3">
              {product.isTraded ? 'Traded' : 'Sold'}
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Views */}
          <div className="flex items-center justify-between text-[11px] text-[#666666] mb-1.5">
            <span className="font-semibold text-[#93ACCC] uppercase tracking-wider text-[10px]">{product.category}</span>
            <span className="flex items-center gap-1 text-[#555555]">
              <Eye className="w-3 h-3" />
              {product.viewsCount || 1} views
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetail(product)}
            className="text-sm font-medium text-white line-clamp-2 hover:text-[#93ACCC] cursor-pointer transition-colors"
          >
            {product.title}
          </h3>

          {/* Price */}
          <div className="mt-2.5 flex items-baseline gap-1.5">
            {(product.listingType === 'Free / Donation' || product.price === 0) ? (
              <span className="text-xl font-black text-[#34D399] tracking-tight flex items-center gap-1">
                <Gift className="w-4 h-4 text-[#34D399]" />
                FREE
              </span>
            ) : (
              <>
                <span className="text-xl font-bold text-white">
                  ${product.price}
                </span>
                <span className="text-[10px] text-[#555555] uppercase tracking-widest">USD</span>
              </>
            )}
          </div>

          {/* Location details (Country, Province, Postal Code) */}
          <div className="mt-3 pt-3 border-t border-[#222222] flex items-center justify-between text-[11px] text-[#666666]">
            <div className="flex items-center gap-1.5 truncate max-w-[200px]">
              <MapPin className="w-3 h-3 text-[#93ACCC] shrink-0" />
              <span className="truncate font-normal">
                {product.location.city ? `${product.location.city}, ` : ''}{product.location.province}, {product.location.country} ({product.location.postalCode})
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#555555] shrink-0">@{product.sellerUsername}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-[#222222] flex items-center gap-2">
          {/* Trade Button */}
          {isTradeable && !isOwner && !product.isSold && !product.isTraded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInitiateTrade(product);
              }}
              className="flex-1 py-2 px-3 border border-[#333333] hover:bg-[#1A1A1A] hover:border-[#3A506B] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Repeat className="w-3.5 h-3.5 text-[#93ACCC]" />
              <span>Trade</span>
            </button>
          )}

          {/* View Details / Buy Button */}
          <button
            onClick={() => onViewDetail(product)}
            className={`py-2 px-3 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-all ${
              !isTradeable || isOwner || product.isSold || product.isTraded ? 'flex-1' : ''
            }`}
          >
            <span>{isOwner ? 'Manage' : 'Buy Now'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
