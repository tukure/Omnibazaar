import React, { useState } from 'react';
import { User, ProductCondition, ListingType, LocationInfo } from '../types';
import { addProduct, getCurrentUser } from '../utils/storage';
import { X, Upload, MapPin, Tag, Repeat, DollarSign, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onProductCreated: () => void;
}

const CATEGORIES = [
  'Livestock & Pets',
  'Electronics',
  'Fashion & Apparel',
  'Collectibles & Art',
  'Gaming & Toys',
  'Books & Music',
  'Sports & Outdoors',
  'Home & Garden',
  'Vehicles & Parts'
];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800'
];

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProductCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(100);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState<ProductCondition>('Like New');
  const [listingType, setListingType] = useState<ListingType>('Sale & Trade');
  const [imageUrl, setImageUrl] = useState('');

  // Location pre-filled from user profile safely
  const [country, setCountry] = useState(currentUser?.location?.country || 'United States');
  const [province, setProvince] = useState(currentUser?.location?.province || 'California');
  const [city, setCity] = useState(currentUser?.location?.city || 'Los Angeles');
  const [address, setAddress] = useState(currentUser?.location?.address || 'Central District');
  const [postalCode, setPostalCode] = useState(currentUser?.location?.postalCode || '90001');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (event) => {
        const rawDataUrl = event.target?.result as string;
        if (!rawDataUrl) return;

        // Compress large image data URLs using Canvas
        const img = new Image();
        img.onload = () => {
          const maxWidth = 600;
          const maxHeight = 600;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.7);
            setImageUrl(compressed);
          } else {
            setImageUrl(rawDataUrl);
          }
        };
        img.onerror = () => setImageUrl(rawDataUrl);
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a title for your product.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a product description.');
      return;
    }
    if (!country.trim() || !city.trim()) {
      setError('Please provide at least a Country and City for the item location.');
      return;
    }

    setIsSubmitting(true);

    const location: LocationInfo = {
      country: country.trim(),
      province: (province || 'General').trim(),
      city: city.trim(),
      address: (address || 'Central').trim(),
      postalCode: (postalCode || '00000').trim()
    };

    const finalImage = imageUrl || PRESET_IMAGES[0];
    const activeUser = currentUser || getCurrentUser();

    try {
      addProduct({
        sellerId: activeUser?.id || 'guest_user',
        sellerUsername: activeUser?.username || 'Trader',
        title: title.trim(),
        description: description.trim(),
        price: Number(price) || 0,
        category,
        condition,
        listingType,
        imageUrl: finalImage,
        location
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(false);
        onProductCreated();
        onClose();
      }, 500);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || 'Failed to post product. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-[#0D0D0D] rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border border-[#222222] my-8 text-[#E5E5E5]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-white p-2 rounded-full hover:bg-[#1A1A1A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
            <span>List a Product for Sale or Trade</span>
          </h2>
          <p className="text-xs text-[#888888] mt-1">
            Post your item to OmniBazaar's marketplace. Upload picture and item info below.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                Product Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5 Headphones"
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-[#111111]">{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, features, included accessories, and what you're willing to trade for..."
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
            />
          </div>

          {/* Price, Condition & Listing Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                Price / Est. Value ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-[#555555]" />
                <input
                  type="number"
                  disabled={listingType === 'Free / Donation'}
                  value={listingType === 'Free / Donation' ? 0 : price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className={`w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B] ${
                    listingType === 'Free / Donation' ? 'text-[#34D399] font-bold cursor-not-allowed opacity-80' : ''
                  }`}
                />
              </div>
              {listingType === 'Free / Donation' && (
                <p className="text-[10px] text-[#34D399] mt-1 font-semibold">
                  🎁 Free giveaway ($0.00)
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
              >
                <option value="New" className="bg-[#111111]">New</option>
                <option value="Like New" className="bg-[#111111]">Like New</option>
                <option value="Good" className="bg-[#111111]">Good</option>
                <option value="Fair" className="bg-[#111111]">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                Listing Type
              </label>
              <select
                value={listingType}
                onChange={(e) => {
                  const val = e.target.value as ListingType;
                  setListingType(val);
                  if (val === 'Free / Donation') {
                    setPrice(0);
                  }
                }}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#3A506B]"
              >
                <option value="Sale & Trade" className="bg-[#111111] text-white">For Sale & Trade</option>
                <option value="Trade Only" className="bg-[#111111] text-white">Trade Only</option>
                <option value="Sale Only" className="bg-[#111111] text-white">Sale Only</option>
                <option value="Free / Donation" className="bg-[#111111] text-[#34D399] font-bold">🎁 Free / Donation ($0)</option>
              </select>
            </div>
          </div>

          {/* Picture Upload Section */}
          <div className="pt-2">
            <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
              Upload Product Picture <span className="text-red-400">*</span>
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* File Uploader */}
              <label className="w-full sm:w-1/2 border-2 border-dashed border-[#333333] hover:border-[#3A506B] bg-[#111111] p-4 rounded-2xl cursor-pointer flex flex-col items-center justify-center text-center transition-colors">
                <Upload className="w-6 h-6 text-[#93ACCC] mb-1" />
                <span className="text-xs font-bold text-white">
                  Upload Image File
                </span>
                <span className="text-[10px] text-[#666666]">PNG, JPG, WEBP up to 10MB</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Preview or URL */}
              <div className="w-full sm:w-1/2">
                {imageUrl ? (
                  <div className="relative w-full h-24 rounded-2xl overflow-hidden border border-[#333333]">
                    <img src={imageUrl} alt="Uploaded product preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1 bg-black/80 text-white rounded-full text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-[#111111] rounded-2xl border border-[#222222] text-center">
                    <p className="text-[10px] text-[#666666] mb-1">Or pick a sample photo:</p>
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      {PRESET_IMAGES.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Preset"
                          onClick={() => setImageUrl(img)}
                          className="w-8 h-8 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-[#3A506B] transition-all"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Details (Pre-filled from profile) */}
          <div className="pt-3 border-t border-[#222222]">
            <p className="text-[10px] font-bold text-[#93ACCC] uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#93ACCC]" />
              Item Shipping Location
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  Country <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">Province / State</label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="e.g. California"
                  className="w-full px-3 py-1.5 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">Street Address (Optional)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 123 Market St"
                  className="w-full px-3 py-1.5 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">Postal Code / ZIP (Optional)</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 90001"
                  className="w-full px-3 py-1.5 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full py-3.5 px-4 font-bold rounded-full transition-all text-xs sm:text-sm mt-4 shadow-md flex items-center justify-center gap-2 ${
              isSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white'
            }`}
          >
            {isSuccess ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Posted Successfully to Marketplace!</span>
              </>
            ) : isSubmitting ? (
              <span>Publishing Item to Marketplace...</span>
            ) : (
              <span>Post Product to Marketplace</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
