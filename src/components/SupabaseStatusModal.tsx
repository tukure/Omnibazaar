import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, X, Shield, Layers } from 'lucide-react';
import { SUPABASE_PROJECT_ID, SUPABASE_URL, SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { syncWithSupabase } from '../utils/storage';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncState: {
    connected: boolean;
    syncing: boolean;
    lastSynced: string | null;
    counts?: { users: number; products: number; offers: number; messages: number };
    error?: string;
  };
  onTriggerSync: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({
  isOpen,
  onClose,
  syncState,
  onTriggerSync,
}) => {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'sql'>('status');

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111111] border border-[#2A3F55] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-[#E5E5E5] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#222222] bg-[#161B22] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00382B] border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Supabase Backend</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  {SUPABASE_PROJECT_ID}
                </span>
              </div>
              <p className="text-xs text-[#888888]">{SUPABASE_URL}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#888888] hover:text-white hover:bg-[#222222] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#222222] bg-[#12161D] px-5 gap-4">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'status'
                ? 'border-[#10B981] text-[#10B981]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Connection & Live Sync
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'sql'
                ? 'border-[#10B981] text-[#10B981]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            SQL Table Setup Script
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'status' ? (
            <>
              {/* Connection Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  syncState.connected
                    ? 'bg-[#062419] border-[#10B981]/30 text-[#A7F3D0]'
                    : 'bg-[#2D1617] border-[#EF4444]/30 text-[#FCA5A5]'
                }`}
              >
                {syncState.connected ? (
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      {syncState.connected
                        ? 'Supabase REST & PostgreSQL Backend Active'
                        : 'Supabase Database Awaiting Tables or RLS Setup'}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">
                      {syncState.lastSynced ? `Synced: ${new Date(syncState.lastSynced).toLocaleTimeString()}` : 'Not synced yet'}
                    </span>
                  </div>
                  <p className="text-xs mt-1 opacity-90 leading-relaxed">
                    {syncState.connected
                      ? 'All products, users, trade offers, and messages are automatically mirrored to your Supabase PostgreSQL cloud backend.'
                      : 'Connected to Supabase endpoint, but SQL tables may need initialization. Check the SQL tab to create tables if needed.'}
                  </p>
                </div>
              </div>

              {/* Record Counts */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#888888] mb-3">
                  Live Database Table Record Metrics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-[#181818] border border-[#282828] rounded-xl text-center">
                    <span className="block text-2xl font-bold text-white">
                      {syncState.counts?.products ?? 0}
                    </span>
                    <span className="text-[11px] text-[#888888] font-medium">Products</span>
                  </div>
                  <div className="p-3.5 bg-[#181818] border border-[#282828] rounded-xl text-center">
                    <span className="block text-2xl font-bold text-white">
                      {syncState.counts?.users ?? 0}
                    </span>
                    <span className="text-[11px] text-[#888888] font-medium">User Profiles</span>
                  </div>
                  <div className="p-3.5 bg-[#181818] border border-[#282828] rounded-xl text-center">
                    <span className="block text-2xl font-bold text-white">
                      {syncState.counts?.offers ?? 0}
                    </span>
                    <span className="text-[11px] text-[#888888] font-medium">Trade Offers</span>
                  </div>
                  <div className="p-3.5 bg-[#181818] border border-[#282828] rounded-xl text-center">
                    <span className="block text-2xl font-bold text-white">
                      {syncState.counts?.messages ?? 0}
                    </span>
                    <span className="text-[11px] text-[#888888] font-medium">Messages</span>
                  </div>
                </div>
              </div>

              {/* Connection Details */}
              <div className="p-4 bg-[#181818] border border-[#262626] rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[#222222]">
                  <span className="text-[#888888]">Supabase Project ID:</span>
                  <span className="font-mono text-white font-semibold">{SUPABASE_PROJECT_ID}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#222222]">
                  <span className="text-[#888888]">REST Base URL:</span>
                  <span className="font-mono text-white font-semibold truncate max-w-[280px]">{SUPABASE_URL}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#888888]">Authentication Mode:</span>
                  <span className="font-semibold text-[#10B981]">Anon Key / Row Level Security</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#888888]">
                    Supabase SQL Editor Initialization Script
                  </label>
                  <button
                    onClick={handleCopySql}
                    className="px-3 py-1 bg-[#21303E] hover:bg-[#2C4054] text-[#93ACCC] hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {copiedSchema ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSchema ? 'Copied to Clipboard!' : 'Copy SQL Script'}
                  </button>
                </div>
                <p className="text-xs text-[#888888] mb-3">
                  Paste this script into your Supabase Dashboard SQL Editor to ensure all tables (`users`, `products`, `trade_offers`, `messages`) and RLS policies are created.
                </p>
                <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 font-mono text-xs text-[#10B981] overflow-x-auto max-h-60 selection:bg-[#21303E]">
                  <pre>{SUPABASE_SQL_SCHEMA}</pre>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#222222] bg-[#141414] flex items-center justify-between">
          <a
            href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#888888] hover:text-white flex items-center gap-1 transition-colors"
          >
            Open Supabase Dashboard
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerSync}
              disabled={syncState.syncing}
              className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncState.syncing ? 'animate-spin' : ''}`} />
              {syncState.syncing ? 'Syncing with Supabase...' : 'Sync Now'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
