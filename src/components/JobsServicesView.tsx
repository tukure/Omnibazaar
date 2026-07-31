import React, { useState } from 'react';
import { JobServiceListing, User, JobServiceCategory, PayType } from '../types';
import { 
  Briefcase, 
  Wrench, 
  Search, 
  MapPin, 
  PlusCircle, 
  Star, 
  Filter, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Sparkles,
  Home,
  Code,
  Palette,
  GraduationCap,
  Heart,
  Truck,
  Camera,
  Building,
  UserCheck
} from 'lucide-react';

interface JobsServicesViewProps {
  items: JobServiceListing[];
  currentUser: User | null;
  onSelectItem: (item: JobServiceListing) => void;
  onOpenCreate: () => void;
  onOpenAuth: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Home Services & Repairs': <Home className="w-3.5 h-3.5 text-amber-400" />,
  'Skilled Trades & Labor': <Wrench className="w-3.5 h-3.5 text-[#38BDF8]" />,
  'Tech & Software': <Code className="w-3.5 h-3.5 text-blue-400" />,
  'Creative & Design': <Palette className="w-3.5 h-3.5 text-purple-400" />,
  'Tutoring & Education': <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />,
  'Caregiving & Pets': <Heart className="w-3.5 h-3.5 text-rose-400" />,
  'Delivery & Transport': <Truck className="w-3.5 h-3.5 text-orange-400" />,
  'Events & Hospitality': <Camera className="w-3.5 h-3.5 text-pink-400" />,
  'Business & Legal': <Building className="w-3.5 h-3.5 text-teal-400" />
};

export const JobsServicesView: React.FC<JobsServicesViewProps> = ({
  items,
  currentUser,
  onSelectItem,
  onOpenCreate,
  onOpenAuth
}) => {
  const [activeTypeTab, setActiveTypeTab] = useState<'all' | 'job_opening' | 'service_offered'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [filterPayType, setFilterPayType] = useState<string>('All');

  // Filter Logic
  const filteredItems = items.filter(item => {
    // Type tab filter
    if (activeTypeTab !== 'all' && item.type !== activeTypeTab) return false;

    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

    // Remote filter
    if (remoteOnly && !item.isRemote) return false;

    // Pay type filter
    if (filterPayType !== 'All' && item.payType !== filterPayType) return false;

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchPoster = item.posterUsername.toLowerCase().includes(query);
      const matchCategory = item.category.toLowerCase().includes(query);
      const matchSkills = item.skills.some(s => s.toLowerCase().includes(query));
      const matchCity = item.location.city?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchPoster && !matchCategory && !matchSkills && !matchCity) {
        return false;
      }
    }

    return true;
  });

  const jobCount = items.filter(i => i.type === 'job_opening').length;
  const serviceCount = items.filter(i => i.type === 'service_offered').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#0F172A] border border-[#334155] p-6 sm:p-10 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#21303E] border border-[#38BDF8]/60 text-[#38BDF8] text-xs font-black rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <Briefcase className="w-3.5 h-3.5" />
              Jobs & Services Hub
            </span>
            <span className="px-3 py-1 bg-[#064E3B] border border-[#10B981]/60 text-[#34D399] text-xs font-black rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <UserCheck className="w-3.5 h-3.5" />
              Verified Local Pros
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Local Jobs, Freelance Gigs & Professional Services
          </h1>

          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            Hire trusted local service providers, offer your professional skills, or apply for gigs and job openings across your region or remote.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreate}
              className="px-5 py-3 bg-[#38BDF8] hover:bg-[#0284C7] active:scale-95 text-slate-950 font-black rounded-full text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Job or Offer Service</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-[#94A3B8] font-bold px-3 py-2 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span>{jobCount} Job Openings</span>
              <span>•</span>
              <span>{serviceCount} Services Offered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter Tabs (All / Jobs / Services) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222222] pb-4">
        
        {/* Type Switcher */}
        <div className="flex items-center gap-2 bg-[#151515] p-1.5 rounded-2xl border border-[#222222]">
          <button
            onClick={() => setActiveTypeTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTypeTab === 'all'
                ? 'bg-[#21303E] border border-[#3A506B] text-white shadow-sm'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <span>All Listings</span>
            <span className="px-1.5 py-0.5 bg-[#333333] text-[10px] rounded-md text-white font-mono">{items.length}</span>
          </button>

          <button
            onClick={() => setActiveTypeTab('job_opening')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTypeTab === 'job_opening'
                ? 'bg-[#21303E] border border-[#38BDF8] text-[#38BDF8] shadow-sm'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Job Openings / Gigs</span>
            <span className="px-1.5 py-0.5 bg-[#21303E] border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] rounded-md font-mono">{jobCount}</span>
          </button>

          <button
            onClick={() => setActiveTypeTab('service_offered')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTypeTab === 'service_offered'
                ? 'bg-[#064E3B] border border-[#10B981] text-[#34D399] shadow-sm'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Services Offered</span>
            <span className="px-1.5 py-0.5 bg-[#064E3B] border border-[#10B981]/40 text-[#34D399] text-[10px] rounded-md font-mono">{serviceCount}</span>
          </button>
        </div>

        {/* Remote Checkbox & Pay Type Filter */}
        <div className="flex flex-wrap items-center gap-3">
          
          <label className="flex items-center gap-2 px-3 py-2 bg-[#151515] border border-[#222222] rounded-xl text-xs font-semibold text-[#888888] hover:text-white cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="rounded bg-[#1A1A1A] border-[#333333] text-[#38BDF8] focus:ring-0"
            />
            <span>Remote Only</span>
          </label>

          <select
            value={filterPayType}
            onChange={(e) => setFilterPayType(e.target.value)}
            className="px-3 py-2 bg-[#151515] border border-[#222222] rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="All">All Pay Types</option>
            <option value="Hourly">Hourly Rate</option>
            <option value="Fixed Price">Fixed Price</option>
            <option value="Salary">Salary</option>
            <option value="Barter / Service Trade">Service Trade</option>
          </select>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCategory === 'All'
              ? 'bg-white text-black border-white shadow-md'
              : 'bg-[#151515] border-[#222222] text-[#888888] hover:text-white hover:border-[#333333]'
          }`}
        >
          All Categories
        </button>

        {Object.keys(CATEGORY_ICONS).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
              selectedCategory === cat
                ? 'bg-[#21303E] border-[#38BDF8] text-[#38BDF8] shadow-md'
                : 'bg-[#151515] border-[#222222] text-[#888888] hover:text-white hover:border-[#333333]'
            }`}
          >
            {CATEGORY_ICONS[cat]}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#555555]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs, services, skills (e.g. Electrician, React, Plumbing, Tutor, Photography)..."
          className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-[#222222] rounded-2xl text-xs sm:text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#38BDF8] transition-all"
        />
      </div>

      {/* Grid of Listings */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group bg-[#111111] border border-[#222222] hover:border-[#3A506B] rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header Image Thumbnail */}
                <div className="relative h-40 bg-[#1A1A1A] overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/30" />

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    {item.type === 'job_opening' ? (
                      <span className="px-2.5 py-1 bg-[#21303E]/90 border border-[#38BDF8]/60 text-[#38BDF8] text-[10px] font-black rounded-full uppercase tracking-wider backdrop-blur-md flex items-center gap-1 shadow-md">
                        <Briefcase className="w-3 h-3" />
                        Job Opening
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#064E3B]/90 border border-[#10B981]/60 text-[#34D399] text-[10px] font-black rounded-full uppercase tracking-wider backdrop-blur-md flex items-center gap-1 shadow-md">
                        <Wrench className="w-3 h-3" />
                        Service Offered
                      </span>
                    )}
                  </div>

                  {/* Pay Rate Tag */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/80 border border-white/10 text-xs font-black text-[#38BDF8] rounded-xl backdrop-blur-md shadow-md">
                    {item.payRate}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5 space-y-3">
                  
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                    <span>{item.category}</span>
                    <span className="flex items-center gap-1 text-[#38BDF8]">
                      <MapPin className="w-3 h-3" />
                      {item.isRemote ? 'Remote' : `${item.location.city}`}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Skills tags */}
                  {item.skills && item.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#1A1A1A] border border-[#222222] text-[10px] font-medium text-[#93ACCC] rounded-md">
                          #{skill}
                        </span>
                      ))}
                      {item.skills.length > 3 && (
                        <span className="text-[10px] text-[#666666] self-center">+{item.skills.length - 3}</span>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-[#1F1F1F] mt-3 flex items-center justify-between text-xs pt-3">
                <div className="flex items-center gap-2">
                  <img
                    src={item.posterAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={item.posterUsername}
                    className="w-6 h-6 rounded-full object-cover border border-[#333333]"
                  />
                  <span className="text-xs font-semibold text-[#D1D5DB]">{item.posterUsername}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  className="px-3 py-1.5 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white text-xs font-bold rounded-xl transition-all"
                >
                  {item.type === 'job_opening' ? 'Apply Now' : 'Inquire'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#111111] border border-[#222222] rounded-3xl space-y-4">
          <Briefcase className="w-12 h-12 text-[#555555] mx-auto" />
          <h3 className="text-lg font-bold text-white">No Jobs or Services Found</h3>
          <p className="text-xs text-[#888888] max-w-md mx-auto">
            Try adjusting your search query, clearing filters, or be the first to post a job opening or service in this category!
          </p>
          <button
            onClick={onOpenCreate}
            className="px-5 py-2.5 bg-[#38BDF8] text-slate-950 font-bold text-xs rounded-full shadow-md"
          >
            Post a Listing Now
          </button>
        </div>
      )}

    </div>
  );
};
