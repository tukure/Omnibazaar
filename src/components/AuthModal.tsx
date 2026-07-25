import React, { useState } from 'react';
import { User, LocationInfo } from '../types';
import { registerUser, loginUser, getUsers, setCurrentUser } from '../utils/storage';
import { X, UserCheck, Lock, MapPin, Globe, Building2, Hash, AlertCircle, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialMode?: 'signin' | 'signup';
}

const COUNTRIES = [
  'Canada', 'United States', 'United Kingdom', 'Germany', 'Australia',
  'France', 'Japan', 'Brazil', 'South Africa', 'India', 'Mexico', 'Spain'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signup'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  // Compulsory location fields for sign up
  const [country, setCountry] = useState('Canada');
  const [province, setProvince] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    const res = loginUser(username, password);
    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Failed to sign in');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (!country.trim()) {
      setError('Country is required');
      return;
    }
    if (!province.trim()) {
      setError('Province/State is required');
      return;
    }
    if (!address.trim()) {
      setError('Address is required');
      return;
    }
    if (!postalCode.trim()) {
      setError('Postal Code / ZIP is required');
      return;
    }

    const location: LocationInfo = {
      country: country.trim(),
      province: province.trim(),
      address: address.trim(),
      postalCode: postalCode.trim()
    };

    const res = registerUser({
      username: username.trim(),
      password,
      email: email.trim() || undefined,
      location
    });

    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Failed to register account');
    }
  };

  const handleQuickDemoUser = (user: User) => {
    setCurrentUser(user);
    onAuthSuccess(user);
    onClose();
  };

  const allUsers = getUsers();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-[#0D0D0D] rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 border border-[#222222] my-8 text-[#E5E5E5]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-white p-2 rounded-full hover:bg-[#1A1A1A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#182533] border border-[#2D4158] text-[#93ACCC] rounded-full text-[10px] font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#93ACCC]" />
            <span>OmniBazaar Verified Identity</span>
          </div>
          <h2 className="text-2xl font-serif italic text-white">
            {mode === 'signup' ? 'Create Marketplace Account' : 'Welcome Back to OmniBazaar'}
          </h2>
          <p className="text-xs text-[#888888] mt-1">
            {mode === 'signup'
              ? 'Join the largest global marketplace to buy, sell, and trade items.'
              : 'Sign in with your username and password.'}
          </p>

          <div className="flex bg-[#151515] border border-[#222222] p-1 rounded-xl mt-5">
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-[#21303E] border border-[#3A506B] text-white shadow-sm font-bold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-[#21303E] border border-[#3A506B] text-white shadow-sm font-bold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'signup' ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                Username <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3 top-3 text-[#555555]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. JohnSeller99"
                  className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-[#555555]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>
            </div>

            {/* Address Requirements */}
            <div className="pt-2 border-t border-[#222222]">
              <p className="text-[10px] font-bold text-[#93ACCC] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#93ACCC]" />
                Location & Delivery Info (Required for Trading)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                    Country <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3 top-3 text-[#555555]" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c} className="bg-[#111111]">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                    Province / State <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-[#555555]" />
                    <input
                      type="text"
                      required
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="e.g. Ontario or California"
                      className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                    Street Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 123 Main St, Apt 4B"
                    className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                    Postal / ZIP Code <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 absolute left-3 top-3 text-[#555555]" />
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. M5B 1T8"
                      className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-full transition-all text-xs sm:text-sm mt-4 shadow-md"
            >
              Complete Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                Username
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3 top-3 text-[#555555]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#555555]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#3A506B]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-full transition-all text-xs sm:text-sm mt-2 shadow-md"
            >
              Sign In
            </button>
          </form>
        )}

        {/* Quick Demo Switcher */}
        <div className="mt-6 pt-4 border-t border-[#222222] text-center">
          <p className="text-[11px] text-[#888888] mb-2 font-medium">
            ⚡ Or test instantly with a pre-created demo profile:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {allUsers.slice(0, 4).map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickDemoUser(u)}
                className="text-left p-2.5 rounded-xl border border-[#222222] hover:border-[#3A506B] bg-[#111111] transition-all"
              >
                <div className="flex items-center gap-2">
                  <img src={u.avatarUrl} alt={u.username} className="w-7 h-7 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{u.username}</p>
                    <p className="text-[10px] text-[#666666] truncate">{u.location.province}, {u.location.country}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
