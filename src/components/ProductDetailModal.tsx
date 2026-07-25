import React, { useState } from 'react';
import { Product, User } from '../types';
import { 
  X, 
  Repeat, 
  MapPin, 
  Tag, 
  MessageSquare, 
  ShoppingBag, 
  Share2, 
  ShieldCheck, 
  Clock, 
  Eye, 
  User as UserIcon,
  CheckCircle2,
  Send
} from 'lucide-react';
import { sendMessage } from '../utils/storage';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  currentUser: User | null;
  onInitiateTrade: (product: Product) => void;
  onOpenAuth: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  currentUser,
  onInitiateTrade,
  onOpenAuth
}) => {
  const [quickMessage, setQuickMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  if (!isOpen || !product) return null;

  const isOwner = currentUser?.id === product.sellerId;
  const isTradeable = product.listingType === 'Sale & Trade' || product.listingType === 'Trade Only';

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!quickMessage.trim()) return;

    sendMessage({
      conversationId: `${currentUser.id}_${product.sellerId}_${product.id}`,
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      recipientId: product.sellerId,
      recipientUsername: product.sellerUsername,
      productId: product.id,
      text: quickMessage.trim()
    });

    setQuickMessage('');
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-[#0D0D0D] rounded-3xl shadow-2xl max-w-3xl w-full p-6 md:p-8 border border-[#222222] my-8 text-[#E5E5E5]">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-white p-2 rounded-full hover:bg-[#1A1A1A] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Left Column: Image */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#222222] shadow-sm">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-3 left-3 flex flex-col gap-1">
                <span className="px-3 py-1 bg-[#21303E] border border-[#3A506B] text-white font-bold text-xs rounded-full shadow-md">
                  {product.listingType}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#E5E5E5] font-semibold text-xs rounded-full border border-[#333333]">
                  {product.condition}
                </span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="mt-4 p-4 bg-[#111111] rounded-2xl border border-[#222222] text-xs space-y-2.5">
              <div className="flex items-center justify-between text-[#888888]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Tag className="w-3.5 h-3.5 text-[#93ACCC]" />
                  Category
                </span>
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">{product.category}</span>
              </div>

              <div className="flex items-center justify-between text-[#888888]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Eye className="w-3.5 h-3.5 text-[#93ACCC]" />
                  Views
                </span>
                <span className="font-bold text-white">{product.viewsCount || 1} views</span>
              </div>

              <div className="flex items-center justify-between text-[#888888]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#93ACCC]" />
                  Listed
                </span>
                <span className="font-bold text-white">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price, Location, Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#93ACCC] uppercase tracking-widest text-[10px]">
                  {product.category}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif italic text-white leading-tight">
                {product.title}
              </h2>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  ${product.price}
                </span>
                <span className="text-xs text-[#666666] font-semibold tracking-widest uppercase">USD</span>
              </div>

              {/* Description */}
              <div className="mt-4 pt-3 border-t border-[#222222]">
                <h4 className="text-[10px] font-bold text-[#555555] uppercase tracking-widest mb-1">
                  Item Details
                </h4>
                <p className="text-xs sm:text-sm text-[#AAAAAA] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Seller Location Breakdown */}
              <div className="mt-4 p-4 bg-[#151515] border border-[#222222] rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#21303E] to-[#111111] text-white flex items-center justify-center font-bold text-xs border border-[#3A506B]">
                      {product.sellerUsername.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        @{product.sellerUsername}
                      </p>
                      <p className="text-[10px] text-[#666666]">Verified Marketplace Seller</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#93ACCC] bg-[#182533] border border-[#2D4158] px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-[#93ACCC]" />
                    Verified
                  </span>
                </div>

                <div className="text-xs text-[#888888] space-y-1 mt-2 pt-2 border-t border-[#222222]">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#93ACCC] shrink-0" />
                    <span><strong className="text-white">Country:</strong> {product.location.country}</span>
                  </p>
                  <p className="flex items-center gap-1.5 pl-5">
                    <span><strong className="text-white">Province / State:</strong> {product.location.province}</span>
                  </p>
                  <p className="flex items-center gap-1.5 pl-5">
                    <span><strong className="text-white">Street Address:</strong> {product.location.address}</span>
                  </p>
                  <p className="flex items-center gap-1.5 pl-5">
                    <span><strong className="text-white">Postal / ZIP Code:</strong> {product.location.postalCode}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {isOwner ? (
                <div className="p-3 bg-[#151515] border border-[#222222] rounded-xl text-center text-xs font-bold text-[#666666]">
                  You are the seller of this item.
                </div>
              ) : (
                <>
                  {/* Trade Action */}
                  {isTradeable && !product.isSold && !product.isTraded && (
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          onOpenAuth();
                        } else {
                          onInitiateTrade(product);
                        }
                      }}
                      className="w-full py-3 px-4 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-full transition-all text-xs sm:text-sm flex items-center justify-center gap-2 hover:scale-[1.01] shadow-md"
                    >
                      <Repeat className="w-4 h-4 text-[#93ACCC]" />
                      <span>Propose Trade Exchange</span>
                    </button>
                  )}

                  {/* Direct Inquiry Form */}
                  <form onSubmit={handleSendQuickMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={quickMessage}
                      onChange={(e) => setQuickMessage(e.target.value)}
                      placeholder={`Send direct message to @${product.sellerUsername}...`}
                      className="flex-1 px-4 py-2.5 bg-[#1A1A1A] border border-[#333333] rounded-full text-xs text-white focus:outline-none focus:border-[#3A506B]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-full text-xs flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5 text-[#93ACCC]" />
                    </button>
                  </form>

                  {messageSent && (
                    <p className="text-[11px] font-semibold text-[#93ACCC] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Message sent to seller's inbox!
                    </p>
                  )}
                </>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
