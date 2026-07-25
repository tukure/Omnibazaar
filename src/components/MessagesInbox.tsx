import React, { useState } from 'react';
import { User, Message, TradeOffer } from '../types';
import { sendMessage, updateTradeOfferStatus } from '../utils/storage';
import { 
  MessageSquare, 
  Repeat, 
  CheckCircle2, 
  XCircle, 
  Send, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Package,
  DollarSign,
  User as UserIcon
} from 'lucide-react';

interface MessagesInboxProps {
  currentUser: User;
  messages: Message[];
  tradeOffers: TradeOffer[];
  onRefreshData: () => void;
}

export const MessagesInbox: React.FC<MessagesInboxProps> = ({
  currentUser,
  messages,
  tradeOffers,
  onRefreshData
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'trades' | 'messages'>('all');
  const [replyText, setReplyText] = useState('');
  const [selectedConvoUser, setSelectedConvoUser] = useState<string | null>(null);

  // Filter messages relevant to current user
  const userMessages = messages.filter(
    m => m.senderId === currentUser.id || m.recipientId === currentUser.id
  );

  // Filter trade offers relevant to current user
  const userOffers = tradeOffers.filter(
    o => o.senderId === currentUser.id || o.recipientId === currentUser.id
  );

  // Handle Accept / Decline
  const handleOfferStatus = (offerId: string, status: 'accepted' | 'declined') => {
    updateTradeOfferStatus(offerId, status);
    onRefreshData();
  };

  // Reply message handler
  const handleSendReply = (recipientId: string, recipientUsername: string, productId?: string) => {
    if (!replyText.trim()) return;

    sendMessage({
      conversationId: `${currentUser.id}_${recipientId}_${productId || 'general'}`,
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      recipientId,
      recipientUsername,
      productId,
      text: replyText.trim()
    });

    setReplyText('');
    onRefreshData();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-[#E5E5E5]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-slate-300" />
            <span>Messages & Trade Proposals</span>
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            View your item trade requests, buyer inquiries, and shipping addresses.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#151515] border border-[#222222] p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-200 text-black shadow-sm font-bold'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setActiveFilter('trades')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              activeFilter === 'trades'
                ? 'bg-slate-200 text-black shadow-sm font-bold'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Trade Offers ({userOffers.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Trade Proposals List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">
            Trade Proposals
          </h3>

          {userOffers.length === 0 ? (
            <div className="p-8 text-center bg-[#0D0D0D] rounded-2xl border border-[#222222] text-[#888888]">
              <Repeat className="w-10 h-10 text-slate-400/40 mx-auto mb-2" />
              <p className="text-sm font-serif italic text-white">No trade proposals yet.</p>
              <p className="text-xs mt-1 text-[#666666]">
                Propose a trade on any marketplace listing to start bartering!
              </p>
            </div>
          ) : (
            userOffers.map(offer => {
              const isIncoming = offer.recipientId === currentUser.id;
              const isPending = offer.status === 'pending';

              return (
                <div
                  key={offer.id}
                  className="bg-[#0D0D0D] rounded-2xl border border-[#222222] p-5 shadow-sm hover:border-slate-400 transition-all"
                >
                  {/* Status Banner */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#222222]">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        isIncoming 
                          ? 'bg-[#1A1A1A] border-[#444444] text-slate-200' 
                          : 'bg-[#151515] border-[#333333] text-white'
                      }`}>
                        {isIncoming ? '📥 Incoming Trade Offer' : '📤 Sent Trade Offer'}
                      </span>
                      <span className="text-xs font-semibold text-[#888888]">
                        {isIncoming ? `from @${offer.senderUsername}` : `to @${offer.recipientUsername}`}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      offer.status === 'accepted'
                        ? 'bg-[#1A1A1A] border border-[#444444] text-slate-200'
                        : offer.status === 'declined'
                        ? 'bg-red-950/40 border border-red-800 text-red-300'
                        : 'bg-[#1A1A1A] border border-[#444444] text-slate-300 animate-pulse'
                    }`}>
                      {offer.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />}
                      {offer.status === 'declined' && <XCircle className="w-3.5 h-3.5" />}
                      <span className="capitalize">{offer.status}</span>
                    </span>
                  </div>

                  {/* Item Swap Comparison Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#111111] p-3.5 rounded-2xl border border-[#222222]">
                    
                    {/* Item A: Target Product */}
                    <div className="p-2.5 bg-[#1A1A1A] rounded-xl border border-[#222222]">
                      <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Target Item:</span>
                      <div className="flex items-center gap-2.5 mt-1">
                        <img src={offer.targetProductImageUrl} alt={offer.targetProductTitle} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-white truncate">{offer.targetProductTitle}</p>
                        </div>
                      </div>
                    </div>

                    {/* Item B: Offered Item */}
                    <div className="p-2.5 bg-[#1A1A1A] rounded-xl border border-[#444444]">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Offered Exchange Item:</span>
                      <div className="flex items-center gap-2.5 mt-1">
                        <img src={offer.offeredItem.imageUrl} alt={offer.offeredItem.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-white truncate">{offer.offeredItem.title}</p>
                          <p className="text-[11px] font-bold text-slate-200">Est. Value: ${offer.offeredItem.estimatedValue} USD</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cash Top-Up & Message Note */}
                  <div className="mt-3 text-xs space-y-1 text-[#AAAAAA]">
                    {offer.cashTopUp !== 0 && (
                      <p className="font-bold text-slate-200 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Cash Top-Up: {offer.cashTopUp > 0 ? `+ $${offer.cashTopUp} added by offerer` : `Asking $${Math.abs(offer.cashTopUp)} cash`}</span>
                      </p>
                    )}
                    <p className="italic bg-[#111111] p-2.5 rounded-xl border border-[#222222] text-[#888888]">
                      "{offer.note}"
                    </p>
                  </div>

                  {/* Accept / Decline Action Buttons for Incoming Trades */}
                  {isIncoming && isPending && (
                    <div className="mt-4 pt-3 border-t border-[#222222] flex items-center gap-2">
                      <button
                        onClick={() => handleOfferStatus(offer.id, 'accepted')}
                        className="flex-1 py-2.5 px-4 bg-slate-200 hover:bg-white text-black font-bold rounded-full text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>Accept Trade Exchange</span>
                      </button>

                      <button
                        onClick={() => handleOfferStatus(offer.id, 'declined')}
                        className="py-2.5 px-4 bg-[#1A1A1A] hover:bg-red-950/40 text-[#888888] hover:text-red-400 font-bold rounded-full text-xs flex items-center justify-center gap-1.5 transition-all border border-[#333333]"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  {/* Shipping Address Confirmation when Trade Accepted */}
                  {offer.status === 'accepted' && (
                    <div className="mt-4 p-3 bg-[#1A1A1A] border border-[#444444] rounded-xl text-xs text-slate-200">
                      <p className="font-bold flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-300" />
                        Trade Confirmed! Arrange shipping/exchange with partner:
                      </p>
                      <p className="mt-1 pl-5 text-[11px] text-[#E5E5E5]">
                        Contact: <strong>@{isIncoming ? offer.senderUsername : offer.recipientUsername}</strong>
                      </p>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Direct Chat Log */}
        <div>
          <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">
            Direct Messages Log
          </h3>

          <div className="bg-[#0D0D0D] rounded-2xl border border-[#222222] p-4 shadow-sm h-[500px] flex flex-col">
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {userMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#666666] text-xs text-center p-4">
                  <MessageSquare className="w-8 h-8 text-[#444444] mb-2" />
                  <span>No direct messages yet.</span>
                </div>
              ) : (
                userMessages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-[#666666] mb-0.5 font-medium">
                        @{msg.senderUsername} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs whitespace-pre-line ${
                          isMe
                            ? 'bg-slate-200 text-black font-semibold rounded-br-none shadow-sm'
                            : 'bg-[#1A1A1A] text-[#E5E5E5] border border-[#222222] rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Reply Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Send reply to last active conversation partner
                const lastMsg = userMessages[userMessages.length - 1];
                if (lastMsg) {
                  const partnerId = lastMsg.senderId === currentUser.id ? lastMsg.recipientId : lastMsg.senderId;
                  const partnerUsername = lastMsg.senderId === currentUser.id ? lastMsg.recipientUsername : lastMsg.senderUsername;
                  handleSendReply(partnerId, partnerUsername, lastMsg.productId);
                }
              }}
              className="mt-3 pt-3 border-t border-[#222222] flex gap-2"
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type a message reply..."
                className="flex-1 px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-full text-xs text-white focus:outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                className="p-2 bg-white text-black rounded-full hover:bg-[#E5E5E5] transition-colors"
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};
