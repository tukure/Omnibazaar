import React, { useState } from 'react';
import { User, Product, LocationInfo } from '../types';
import { updateUserProfile, deleteProduct } from '../utils/storage';
import { 
  User as UserIcon, 
  MapPin, 
  Globe, 
  Building2, 
  Hash, 
  Package, 
  Trash2, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Star,
  Repeat
} from 'lucide-react';

interface UserProfileModalProps {
  currentUser: User;
  userProducts: Product[];
  onProfileUpdated: (updatedUser: User) => void;
  onRefreshData: () => void;
  onOpenCreateProduct: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  userProducts,
  onProfileUpdated,
  onRefreshData,
  onOpenCreateProduct
}) => {
  const [country, setCountry] = useState(currentUser.location.country);
  const [province, setProvince] = useState(currentUser.location.province);
  const [address, setAddress] = useState(currentUser.location.address);
  const [postalCode, setPostalCode] = useState(currentUser.location.postalCode);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedLoc: LocationInfo = {
      country: country.trim(),
      province: province.trim(),
      address: address.trim(),
      postalCode: postalCode.trim()
    };

    const res = updateUserProfile(currentUser.id, updatedLoc, avatarUrl.trim());
    if (res) {
      onProfileUpdated(res);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleDeleteItem = (productId: string) => {
    deleteProduct(productId);
    onRefreshData();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-[#E5E5E5]">
      
      {/* Profile Header Card */}
      <div className="bg-[#0D0D0D] border border-[#222222] rounded-3xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
            alt={currentUser.username}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#3A506B] shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-serif italic text-white">
                @{currentUser.username}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#182533] border border-[#2D4158] text-[#93ACCC]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#93ACCC]" />
                Verified Trader
              </span>
            </div>

            <p className="text-xs text-[#888888] mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#93ACCC]" />
              {currentUser.location.province}, {currentUser.location.country} ({currentUser.location.postalCode})
            </p>

            <div className="flex items-center gap-4 mt-2 text-xs text-[#666666]">
              <span className="flex items-center gap-1 font-bold text-[#93ACCC]">
                <Star className="w-3.5 h-3.5 fill-[#93ACCC] text-[#93ACCC]" />
                {currentUser.rating || 5.0} Rating
              </span>
              <span>•</span>
              <span className="font-semibold text-[#888888]">
                {currentUser.tradesCompleted || 0} Trades Completed
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenCreateProduct}
          className="px-5 py-3 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-full text-xs sm:text-sm transition-all hover:scale-[1.02] flex items-center gap-2 shadow-md"
        >
          <Package className="w-4 h-4 text-[#93ACCC]" />
          <span>Post New Item for Sale/Trade</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Edit Address & Account Details */}
        <div className="lg:col-span-1">
          <div className="bg-[#0D0D0D] border border-[#222222] rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-serif italic text-white mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#93ACCC]" />
              <span>Registered Shipping Location</span>
            </h3>

            {savedSuccess && (
              <div className="mb-4 p-3 bg-[#182533] border border-[#2D4158] text-[#93ACCC] text-xs rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#93ACCC]" />
                <span>Profile location updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  Province / State
                </label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  Postal / ZIP Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-full text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4 text-[#93ACCC]" />
                <span>Save Address Changes</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Active Listed Products */}
        <div className="lg:col-span-2">
          <div className="bg-[#0D0D0D] border border-[#222222] rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-serif italic text-white mb-4 flex items-center justify-between">
              <span>My Active Listings ({userProducts.length})</span>
              <button
                onClick={onOpenCreateProduct}
                className="text-xs text-[#93ACCC] font-bold hover:underline not-italic font-sans"
              >
                + Add Another Product
              </button>
            </h3>

            {userProducts.length === 0 ? (
              <div className="text-center py-10 text-[#666666] text-xs">
                <Package className="w-10 h-10 mx-auto mb-2 text-[#444444]" />
                <p>You haven't listed any products yet.</p>
                <button
                  onClick={onOpenCreateProduct}
                  className="mt-3 px-4 py-2 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-full text-xs"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userProducts.map(prod => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between gap-4 p-3.5 bg-[#111111] rounded-2xl border border-[#222222]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={prod.imageUrl} alt={prod.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-medium text-white truncate">
                          {prod.title}
                        </h4>
                        <p className="text-[11px] font-bold text-[#93ACCC]">
                          ${prod.price} USD • {prod.listingType}
                        </p>
                        <p className="text-[10px] text-[#666666] truncate">
                          {prod.location.province}, {prod.location.country} ({prod.location.postalCode})
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteItem(prod.id)}
                      className="p-2 text-[#666666] hover:text-red-400 hover:bg-red-950/40 rounded-xl transition-colors shrink-0"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
