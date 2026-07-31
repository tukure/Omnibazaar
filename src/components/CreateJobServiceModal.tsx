import React, { useState } from 'react';
import { User, JobServiceType, JobServiceCategory, PayType, LocationInfo } from '../types';
import { addJobServiceListing, getCurrentUser } from '../utils/storage';
import { X, Briefcase, Wrench, DollarSign, MapPin, Tag, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';

interface CreateJobServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onCreated: () => void;
}

const CATEGORIES: JobServiceCategory[] = [
  'Home Services & Repairs',
  'Skilled Trades & Labor',
  'Tech & Software',
  'Creative & Design',
  'Tutoring & Education',
  'Caregiving & Pets',
  'Delivery & Transport',
  'Events & Hospitality',
  'Business & Legal'
];

const PAY_TYPES: PayType[] = ['Hourly', 'Fixed Price', 'Salary', 'Barter / Service Trade'];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800'
];

export const CreateJobServiceModal: React.FC<CreateJobServiceModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreated
}) => {
  const [listingType, setListingType] = useState<JobServiceType>('job_opening');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobServiceCategory>('Home Services & Repairs');
  const [description, setDescription] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [payRate, setPayRate] = useState('');
  const [payType, setPayType] = useState<PayType>('Hourly');
  const [isRemote, setIsRemote] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent' | 'Flexible'>('Standard');
  const [imageUrl, setImageUrl] = useState('');

  // Location pre-filled
  const [country, setCountry] = useState(currentUser?.location?.country || 'United States');
  const [province, setProvince] = useState(currentUser?.location?.province || 'California');
  const [city, setCity] = useState(currentUser?.location?.city || 'Los Angeles');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a descriptive title.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a detailed description of the job or service.');
      return;
    }
    if (!payRate.trim()) {
      setError('Please specify the pay rate or fee structure (e.g., $45/hr or $500 fixed).');
      return;
    }
    if (!isRemote && (!country.trim() || !city.trim())) {
      setError('Please enter Country and City for local or on-site listings.');
      return;
    }

    setIsSubmitting(true);

    const activeUser = currentUser || getCurrentUser();
    const parsedSkills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const parsedRequirements = requirementsInput
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const location: LocationInfo = {
      country: country.trim() || 'United States',
      province: (province || 'General').trim(),
      city: (city || 'Online').trim(),
      address: 'Local Area',
      postalCode: '00000'
    };

    try {
      addJobServiceListing({
        posterId: activeUser?.id || 'guest_user',
        posterUsername: activeUser?.username || 'Trader',
        posterAvatar: activeUser?.avatarUrl,
        posterRating: activeUser?.rating || 4.9,
        type: listingType,
        title: title.trim(),
        category,
        description: description.trim(),
        requirements: parsedRequirements.length > 0 ? parsedRequirements : undefined,
        payRate: payRate.trim(),
        payType,
        isRemote,
        location,
        skills: parsedSkills.length > 0 ? parsedSkills : [category.split(' ')[0]],
        urgency,
        imageUrl: imageUrl || PRESET_IMAGES[0]
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(false);
        onCreated();
        onClose();
      }, 500);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || 'Failed to publish listing. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#111111] border border-[#222222] rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white relative shadow-2xl my-8 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#888888] hover:text-white bg-[#1A1A1A] rounded-full border border-[#333333] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#21303E] border border-[#3A506B] rounded-2xl text-[#38BDF8]">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Post Job or Offer Service</h2>
            <p className="text-xs text-[#888888]">Connect with local clients, freelancers, and service providers.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Listing Type Selector */}
          <div>
            <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2">Listing Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setListingType('job_opening')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  listingType === 'job_opening'
                    ? 'bg-[#21303E] border-[#38BDF8] text-[#38BDF8] shadow-lg scale-[1.02]'
                    : 'bg-[#1A1A1A] border-[#333333] text-[#888888] hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Job Opening / Gig Needed</span>
              </button>

              <button
                type="button"
                onClick={() => setListingType('service_offered')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  listingType === 'service_offered'
                    ? 'bg-[#064E3B] border-[#10B981] text-[#34D399] shadow-lg scale-[1.02]'
                    : 'bg-[#1A1A1A] border-[#333333] text-[#888888] hover:text-white'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Service I Offer (Provider)</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
              Listing Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={listingType === 'job_opening' ? "e.g., Senior React Developer for 2-Month Project" : "e.g., Licensed Residential Plumbing & Pipe Leak Specialist"}
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333333] rounded-2xl text-xs sm:text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#38BDF8] transition-all"
            />
          </div>

          {/* Category & Pay Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobServiceCategory)}
                className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333333] rounded-2xl text-xs text-white focus:outline-none focus:border-[#38BDF8]"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">Pay Structure</label>
              <select
                value={payType}
                onChange={(e) => setPayType(e.target.value as PayType)}
                className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333333] rounded-2xl text-xs text-white focus:outline-none focus:border-[#38BDF8]"
              >
                {PAY_TYPES.map(pt => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pay Rate & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                Pay Rate / Fee <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-3 text-[#555555]" />
                <input
                  type="text"
                  required
                  value={payRate}
                  onChange={(e) => setPayRate(e.target.value)}
                  placeholder="e.g. $50 / hr, $1,500 fixed, or $80k/yr"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#333333] rounded-2xl text-xs sm:text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333333] rounded-2xl text-xs text-white focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="Standard">Standard Priority</option>
                <option value="Urgent">🔥 Urgent / Immediate Start</option>
                <option value="Flexible">Flexible Schedule</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
              Detailed Description <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the scope of work, tasks involved, experience required, or services offered..."
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333333] rounded-2xl text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          {/* Requirements & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                Requirements (One per line)
              </label>
              <textarea
                rows={2}
                value={requirementsInput}
                onChange={(e) => setRequirementsInput(e.target.value)}
                placeholder="Licensed & Insured&#10;5+ years experience&#10;Available weekends"
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-2xl text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                Skills / Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. React, Plumbing, Figma, Tutoring, Electrical"
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-2xl text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
          </div>

          {/* Work Style & Location */}
          <div className="p-4 bg-[#161616] border border-[#222222] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#38BDF8]" />
                Location & Remote Preferences
              </span>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#888888] hover:text-white">
                <input
                  type="checkbox"
                  checked={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                  className="rounded bg-[#1A1A1A] border-[#333333] text-[#38BDF8] focus:ring-0"
                />
                <span>Remote / Anywhere</span>
              </label>
            </div>

            {!isRemote && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-[#888888] uppercase mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#888888] uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#1A1A1A] border border-[#333333] rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full py-3.5 px-4 font-bold rounded-full transition-all text-xs sm:text-sm mt-4 shadow-md flex items-center justify-center gap-2 ${
              isSuccess
                ? 'bg-emerald-600 text-white'
                : listingType === 'job_opening'
                ? 'bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white'
                : 'bg-[#064E3B] hover:bg-[#065F46] border border-[#10B981] text-white'
            }`}
          >
            {isSuccess ? (
              <span>Published Successfully to Jobs & Services!</span>
            ) : isSubmitting ? (
              <span>Publishing Listing...</span>
            ) : (
              <span>{listingType === 'job_opening' ? 'Post Job Opening' : 'List Your Service'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
