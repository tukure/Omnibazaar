import React from 'react';
import { User, ActiveTab } from '../types';
import logoImg from '../assets/images/omnibazaar_logo_1784789812369.jpg';
import { 
  Store, 
  Repeat, 
  MessageSquare, 
  PlusCircle, 
  User as UserIcon, 
  Search, 
  MapPin, 
  Package, 
  LogOut,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
  onOpenCreateProduct: () => void;
  unreadCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenCreateProduct,
  unreadCount,
  searchQuery,
  setSearchQuery,
  onLogout
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0D] border-b border-[#222222] shadow-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-white p-0.5 border border-[#3A506B] flex items-center justify-center shrink-0 overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                <img 
                  src={logoImg} 
                  alt="OmniBazaar Logo" 
                  className="w-full h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white flex items-center font-sans">
                  <span className="text-white">Omni</span>
                  <span className="text-[#93ACCC]">Bazaar</span>
                </span>
                <span className="hidden sm:block text-[9px] font-bold text-[#888888] -mt-0.5 tracking-widest uppercase">
                  Buy • Sell • Trade
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#151515] p-1 rounded-xl border border-[#222222]">
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'explore'
                    ? 'bg-[#21303E] border border-[#3A506B] text-white font-bold shadow-sm'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-[#93ACCC]" />
                <span>Marketplace</span>
              </button>

              <button
                onClick={() => setActiveTab('trades')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'trades'
                    ? 'bg-[#21303E] border border-[#3A506B] text-white font-bold shadow-sm'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Repeat className="w-3.5 h-3.5 text-[#93ACCC]" />
                <span>Trade Hub</span>
              </button>

              <button
                onClick={() => setActiveTab('my-listings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'my-listings'
                    ? 'bg-[#21303E] border border-[#3A506B] text-white font-bold shadow-sm'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-[#93ACCC]" />
                <span>Vault</span>
              </button>
            </nav>
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[#555555]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, livestock, pets, regions..."
                className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#333333] focus:border-[#3A506B] rounded-full text-xs text-[#E5E5E5] placeholder-[#555555] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Create Product Button */}
            <button
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth();
                } else {
                  onOpenCreateProduct();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white rounded-full text-xs font-bold transition-all hover:scale-[1.02] shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-[#93ACCC]" />
              <span className="hidden sm:inline">Create Listing</span>
            </button>

            {/* Messages Inbox Button */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`relative p-2 rounded-xl border border-[#222222] transition-all ${
                activeTab === 'messages'
                  ? 'bg-[#21303E] border-[#3A506B] text-white'
                  : 'bg-[#151515] text-[#888888] hover:text-white hover:bg-[#1A1A1A]'
              }`}
              title="Messages & Inbox"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#21303E] border border-[#3A506B] text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Account / User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-[#333333] bg-[#1A1A1A] hover:border-slate-400 transition-all"
                >
                  <img
                    src={currentUser.avatarUrl || logoImg}
                    alt={currentUser.username}
                    className="w-7 h-7 rounded-full object-cover bg-white p-0.5 border border-[#444444] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-white leading-tight">
                      {currentUser.username}
                    </p>
                    <p className="text-[10px] text-[#555555] flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-slate-300" />
                      <span>{currentUser.location.province}, {currentUser.location.country}</span>
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#111111] border border-[#222222] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-[#222222]">
                      <p className="text-xs font-bold text-white">
                        {currentUser.username}
                      </p>
                      <p className="text-[11px] text-[#666666] mt-0.5 truncate">
                        {currentUser.location.address}, {currentUser.location.postalCode}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#CCCCCC] hover:bg-[#1A1A1A] flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-300" />
                      <span>View Profile & Verification</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('my-listings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#CCCCCC] hover:bg-[#1A1A1A] flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-slate-300" />
                      <span>My Active Listings</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenAuth();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-[#1A1A1A] flex items-center gap-2"
                    >
                      <Repeat className="w-4 h-4 text-slate-300" />
                      <span>Switch Profile</span>
                    </button>

                    <div className="border-t border-[#222222] my-1" />

                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-400 hover:bg-[#1A1A1A] flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#E5E5E5] text-black rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
