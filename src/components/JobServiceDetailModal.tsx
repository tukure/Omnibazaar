import React, { useState } from 'react';
import { JobServiceListing, User } from '../types';
import { sendMessage, getCurrentUser } from '../utils/storage';
import { X, MapPin, DollarSign, Clock, Briefcase, Wrench, Send, CheckCircle, Star, AlertCircle, ShieldCheck } from 'lucide-react';

interface JobServiceDetailModalProps {
  item: JobServiceListing | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onInquirySent: () => void;
}

export const JobServiceDetailModal: React.FC<JobServiceDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  onInquirySent
}) => {
  const [inquiryText, setInquiryText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!inquiryText.trim()) return;

    setIsSending(true);

    const activeUser = currentUser || getCurrentUser();

    // Construct conversation message
    const msgText = `[${item.type === 'job_opening' ? 'Job Application' : 'Service Inquiry'}: "${item.title}"]\n\n${inquiryText.trim()}`;

    sendMessage({
      conversationId: [activeUser.id, item.posterId].sort().join('_'),
      senderId: activeUser.id,
      senderUsername: activeUser.username,
      recipientId: item.posterId,
      recipientUsername: item.posterUsername,
      text: msgText
    });

    setSentSuccess(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(false);
      setInquiryText('');
      onInquirySent();
    }, 1200);
  };

  const isPoster = currentUser?.id === item.posterId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#111111] border border-[#222222] rounded-3xl max-w-2xl w-full text-white relative shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Banner / Header Image */}
        <div className="relative h-48 sm:h-56 bg-[#1A1A1A]">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white bg-black/60 hover:bg-black rounded-full border border-white/20 transition-all backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Type Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {item.type === 'job_opening' ? (
              <span className="px-3 py-1 bg-[#21303E] border border-[#38BDF8]/60 text-[#38BDF8] text-xs font-black rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Job Opening / Hiring
              </span>
            ) : (
              <span className="px-3 py-1 bg-[#064E3B] border border-[#10B981]/60 text-[#34D399] text-xs font-black rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Service Offered
              </span>
            )}

            {item.urgency === 'Urgent' && (
              <span className="px-2.5 py-1 bg-red-600/90 text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-md">
                🔥 Urgent
              </span>
            )}
          </div>

          {/* Pay Rate Floating Box */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888]">{item.category}</span>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">{item.title}</h1>
            </div>
            <div className="bg-[#1A1A1A]/90 border border-[#333333] backdrop-blur-md px-4 py-2 rounded-2xl text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-[#888888] block">{item.payType}</span>
              <span className="text-lg font-black text-[#38BDF8]">{item.payRate}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Poster Profile Bar */}
          <div className="p-4 bg-[#161616] border border-[#222222] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={item.posterAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={item.posterUsername}
                className="w-12 h-12 rounded-full object-cover border border-[#333333]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{item.posterUsername}</span>
                  <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold rounded flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#888888] mt-0.5">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {item.posterRating || 4.9}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                    {item.isRemote ? 'Remote / Online' : `${item.location.city}, ${item.location.province}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-[#666666]">
              <span>Posted {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">Description & Scope</h3>
            <p className="text-sm text-[#D1D5DB] leading-relaxed whitespace-pre-line">{item.description}</p>
          </div>

          {/* Requirements list */}
          {item.requirements && item.requirements.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">Requirements & Details</h3>
              <ul className="space-y-2">
                {item.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#E5E7EB]">
                    <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills / Tags */}
          {item.skills && item.skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">Skills & Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#1E1E1E] border border-[#333333] text-xs font-medium text-[#93ACCC] rounded-full">
                    #{skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action / Apply Form */}
          {!isPoster ? (
            <div className="p-5 bg-[#161616] border border-[#222222] rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-[#38BDF8]" />
                <span>{item.type === 'job_opening' ? 'Apply for this Job / Gig' : 'Inquire / Request Service'}</span>
              </h3>
              
              {sentSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Your message has been sent directly to {item.posterUsername}'s inbox! Check your Messages tab for replies.</span>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-3">
                  <textarea
                    required
                    rows={3}
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    placeholder={
                      item.type === 'job_opening'
                        ? "Introduce yourself, highlight relevant experience, availability, or rate..."
                        : "Describe what service you need, timeline, or ask any questions..."
                    }
                    className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333333] rounded-2xl text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#38BDF8]"
                  />

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 px-4 bg-[#21303E] hover:bg-[#2C3E52] border border-[#3A506B] text-white font-bold rounded-full text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4 text-[#38BDF8]" />
                    <span>{isSending ? 'Sending Inquiry...' : 'Send Message to Poster'}</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-blue-400 text-xs text-center font-bold">
              You are the creator of this listing.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
