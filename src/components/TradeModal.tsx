import React, { useState } from 'react';
import { Product, User, ProductCondition, TradeItem } from '../types';
import { createTradeOffer } from '../utils/storage';
import { 
  X, 
  Repeat, 
  PlusCircle, 
  DollarSign, 
  Upload, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Package, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProduct: Product | null;
  currentUser: User;
  userProducts: Product[];
  onTradeSubmitted: () => void;
  onOpenCreateProduct: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  targetProduct,
  currentUser,
  userProducts,
  onTradeSubmitted,
  onOpenCreateProduct
}) => {
  const [offerSource, setOfferSource] = useState<'existing' | 'new'>('existing');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // New item state (if offering a custom unlisted item)
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newEstValue, setNewEstValue] = useState<number>(0);
  const [newCondition, setNewCondition] = useState<ProductCondition>('Like New');

  // Cash top up
  const [cashTopUp, setCashTopUp] = useState<number>(0);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !targetProduct) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let offeredItem: TradeItem;

    if (offerSource === 'existing') {
      if (!selectedProductId) {
        setError('Please select one of your items to trade.');
        return;
      }
      const existingProd = userProducts.find(p => p.id === selectedProductId);
      if (!existingProd) {
        setError('Selected product not found.');
        return;
      }
      offeredItem = {
        title: existingProd.title,
        description: existingProd.description,
        imageUrl: existingProd.imageUrl,
        estimatedValue: existingProd.price,
        condition: existingProd.condition,
        existingProductId: existingProd.id
      };
    } else {
      if (!newTitle.trim()) {
        setError('Please enter a title for your trade item.');
        return;
      }
      if (!newImageUrl) {
        setError('Please upload a picture of your item.');
        return;
      }
      offeredItem = {
        title: newTitle.trim(),
        description: newDescription.trim() || 'No description provided',
        imageUrl: newImageUrl,
        estimatedValue: Number(newEstValue) || 0,
        condition: newCondition
      };
    }

    createTradeOffer({
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      recipientId: targetProduct.sellerId,
      recipientUsername: targetProduct.sellerUsername,
      targetProductId: targetProduct.id,
      targetProductTitle: targetProduct.title,
      targetProductImageUrl: targetProduct.imageUrl,
      offeredItem,
      cashTopUp: Number(cashTopUp) || 0,
      note: note.trim() || 'Hi, I would like to propose this trade item exchange with you!'
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onTradeSubmitted();
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-[#0D0D0D] rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border border-[#222222] my-8 text-[#E5E5E5]">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-white p-2 rounded-full hover:bg-[#1A1A1A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-[#1A1A1A] border border-[#444444] text-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-serif italic text-white">
              Trade Offer Submitted!
            </h3>
            <p className="text-sm text-[#888888] mt-2 max-w-md mx-auto">
              Your trade proposal has been delivered to @{targetProduct.sellerUsername}. You can view the status and chat in your Messages Inbox.
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#222222]">
              <div className="w-11 h-11 rounded-2xl bg-[#1A1A1A] border border-[#444444] flex items-center justify-center text-white font-bold shadow-md">
                <Repeat className="w-6 h-6 text-slate-200" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Propose Trade Exchange</span>
                  <span className="px-2.5 py-0.5 bg-[#1A1A1A] border border-[#444444] text-slate-200 rounded-full text-[10px] font-bold">
                    Encrypted Barter
                  </span>
                </h2>
                <p className="text-xs text-[#888888]">
                  Direct item trade with @{targetProduct.sellerUsername} ({targetProduct.location.province}, {targetProduct.location.country})
                </p>
              </div>
            </div>

            {/* Target Item Card Preview */}
            <div className="bg-[#111111] border border-[#222222] p-4 rounded-2xl mb-6 flex items-center gap-4">
              <img
                src={targetProduct.imageUrl}
                alt={targetProduct.title}
                className="w-16 h-16 rounded-xl object-cover border border-[#333333]"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Target Item Requested:
                </span>
                <h4 className="text-sm font-medium text-white truncate">
                  {targetProduct.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-[#888888] mt-0.5">
                  <span className="font-bold text-white">${targetProduct.price} USD</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-[#666666]">
                    <MapPin className="w-3 h-3 text-slate-300" />
                    {targetProduct.location.province}, {targetProduct.location.country} ({targetProduct.location.postalCode})
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmitTrade} className="space-y-5">
              
              {/* Offer Source Tabs */}
              <div>
                <label className="block text-xs font-bold text-[#AAAAAA] mb-2 uppercase tracking-wider text-[10px]">
                  What item do you want to offer in exchange?
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#151515] rounded-xl border border-[#222222]">
                  <button
                    type="button"
                    onClick={() => setOfferSource('existing')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      offerSource === 'existing'
                        ? 'bg-slate-200 text-black shadow-sm font-bold'
                        : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>My Vault Items ({userProducts.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOfferSource('new')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      offerSource === 'new'
                        ? 'bg-slate-200 text-black shadow-sm font-bold'
                        : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Upload New Item</span>
                  </button>
                </div>
              </div>

              {/* Offer Source Content */}
              {offerSource === 'existing' ? (
                <div>
                  {userProducts.length === 0 ? (
                    <div className="p-4 bg-[#111111] rounded-xl text-center border border-dashed border-[#333333]">
                      <p className="text-xs text-[#888888] mb-2">
                        You don't have any listed products in your vault yet!
                      </p>
                      <button
                        type="button"
                        onClick={() => setOfferSource('new')}
                        className="px-4 py-2 bg-slate-200 text-black rounded-full text-xs font-bold"
                      >
                        Upload a Trade Picture & Item
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
                      {userProducts.map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => setSelectedProductId(prod.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                            selectedProductId === prod.id
                              ? 'border-slate-300 bg-[#1A1A1A] ring-1 ring-slate-300'
                              : 'border-[#222222] hover:border-[#333333] bg-[#111111]'
                          }`}
                        >
                          <img src={prod.imageUrl} alt={prod.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-medium text-white truncate">{prod.title}</h5>
                            <p className="text-[11px] font-bold text-slate-200">${prod.price} USD</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 bg-[#111111] p-4 rounded-2xl border border-[#222222]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                        Item Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Vintage Leica M6 Rangefinder"
                        className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                        Estimated Value ($)
                      </label>
                      <input
                        type="number"
                        value={newEstValue || ''}
                        onChange={(e) => setNewEstValue(Number(e.target.value))}
                        placeholder="2500"
                        className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  {/* Picture Upload */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                      Upload Picture of Item <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      {newImageUrl ? (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#333333]">
                          <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewImageUrl('')}
                            className="absolute top-1 right-1 p-1 bg-black/80 text-white rounded-full text-[10px]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex-1 border-2 border-dashed border-[#333333] hover:border-slate-400 bg-[#1A1A1A] p-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-xs text-[#888888] transition-colors">
                          <Upload className="w-4 h-4 text-slate-300" />
                          <span>Click to Upload Product Photo</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Condition & Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">Condition</label>
                      <select
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value as ProductCondition)}
                        className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white"
                      >
                        <option value="New" className="bg-[#111111]">New</option>
                        <option value="Like New" className="bg-[#111111]">Like New</option>
                        <option value="Good" className="bg-[#111111]">Good</option>
                        <option value="Fair" className="bg-[#111111]">Fair</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">Short Description</label>
                      <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Condition, accessories, box..."
                        className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cash Top-Up Option */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#888888] mb-1 flex items-center justify-between">
                  <span>Cash Top-Up Difference (Optional)</span>
                  <span className="text-[10px] text-[#666666] font-normal">
                    Positive = You add cash • Negative = Ask seller cash
                  </span>
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-[#555555]" />
                  <input
                    type="number"
                    value={cashTopUp || ''}
                    onChange={(e) => setCashTopUp(Number(e.target.value))}
                    placeholder="e.g. 50 (You add $50 to equalize trade)"
                    className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Personal Note */}
              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  Message to @{targetProduct.sellerUsername}
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Inquire about terms or describe your offer..."
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-slate-400"
                />
              </div>

              {/* Sender Location Confirmation */}
              <div className="p-3 bg-[#111111] border border-[#222222] rounded-xl text-[11px] text-[#888888] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                <span>
                  Your Verified Address: <strong className="text-white">{currentUser.location.address}, {currentUser.location.province}, {currentUser.location.country} ({currentUser.location.postalCode})</strong>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-slate-200 hover:bg-white text-black font-bold rounded-full transition-all text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Send Trade Offer Now</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
