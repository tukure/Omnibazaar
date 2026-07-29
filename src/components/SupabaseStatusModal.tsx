import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, X, Shield, Layers, Settings, RotateCcw, WifiOff } from 'lucide-react';
import { 
  SUPABASE_PROJECT_ID, 
  SUPABASE_URL, 
  SUPABASE_SQL_SCHEMA, 
  getStoredSupabaseUrl, 
  getStoredSupabaseAnonKey, 
  updateSupabaseConfig, 
  resetSupabaseConfig 
} from '../lib/supabase';

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
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'settings'>('status');

  const [inputUrl, setInputUrl] = useState(getStoredSupabaseUrl());
  const [inputKey, setInputKey] = useState(getStoredSupabaseAnonKey());
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseConfig(inputUrl, inputKey);
    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 2500);
    onTriggerSync();
  };

  const handleResetCredentials = () => {
    resetSupabaseConfig();
    setInputUrl(getStoredSupabaseUrl());
    setInputKey(getStoredSupabaseAnonKey());
    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 2500);
    onTriggerSync();
  };

  const isFailedToFetch = syncState.error && (
    syncState.error.includes('Failed to fetch') || 
    syncState.error.includes('TypeError') ||
    syncState.error.includes('Network failure')
  );

  const getDiagnosis = (error?: string) => {
    if (!error) return null;
    const lower = error.toLowerCase();

    if (lower.includes('row-level security') || lower.includes('rls') || lower.includes('policy')) {
      return {
        title: 'Row Level Security (RLS) is Blocking Access',
        explanation: 'You created the tables in Supabase, but Row Level Security (RLS) is enabled without a public access policy, so Supabase blocks queries.',
        sqlToCopy: `-- RUN THIS IN SUPABASE SQL EDITOR TO ALLOW PUBLIC ACCESS:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read/write users" ON public.users;
DROP POLICY IF EXISTS "Public read/write products" ON public.products;
DROP POLICY IF EXISTS "Public read/write trade_offers" ON public.trade_offers;
DROP POLICY IF EXISTS "Public read/write messages" ON public.messages;

CREATE POLICY "Public read/write users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write trade_offers" ON public.trade_offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);`
      };
    }

    if (lower.includes('uuid') || lower.includes('type uuid')) {
      return {
        title: 'Primary Key Type Mismatch (UUID vs TEXT)',
        explanation: 'When creating tables manually in the Supabase Table Editor, the primary key "id" defaults to UUID. OmniBazaar uses string IDs (e.g. "user-1", "prod-101"), so "id" must be TEXT.',
        sqlToCopy: null
      };
    }

    if (lower.includes('column') || lower.includes('does not exist')) {
      return {
        title: 'Table Missing Required Columns',
        explanation: 'Your manually created table is missing expected snake_case columns (like seller_id, is_sold, location, or is_system_notification).',
        sqlToCopy: null
      };
    }

    return null;
  };

  const diagnosis = getDiagnosis(syncState.error);

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
                  {getStoredSupabaseUrl().includes('qulfvekxkttplcmtanwo') ? 'Default Project' : 'Custom Project'}
                </span>
              </div>
              <p className="text-xs text-[#888888] font-mono truncate max-w-sm">{getStoredSupabaseUrl()}</p>
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
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'border-[#10B981] text-[#10B981]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Project Credentials
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'status' && (
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
                        : isFailedToFetch
                          ? 'Supabase Endpoint Unreachable (Network / Paused Project)'
                          : diagnosis
                            ? diagnosis.title
                            : 'Supabase Database Awaiting Tables or RLS Setup'}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">
                      {syncState.lastSynced ? `Synced: ${new Date(syncState.lastSynced).toLocaleTimeString()}` : 'Not synced yet'}
                    </span>
                  </div>
                  <p className="text-xs mt-1 opacity-90 leading-relaxed">
                    {syncState.connected
                      ? 'All products, users, trade offers, and messages are automatically mirrored to your Supabase PostgreSQL cloud backend.'
                      : isFailedToFetch
                        ? 'The browser cannot reach the Supabase host domain. Your project may be paused in Supabase, blocked by browser policy, or requires your custom credentials.'
                        : diagnosis
                          ? 'Supabase rejected database queries for your tables. See the detailed diagnosis below.'
                          : 'Connected to Supabase endpoint, but SQL tables or Row Level Security (RLS) policies need setup.'}
                  </p>
                  
                  {syncState.error && !syncState.connected && (
                    <div className="mt-2 p-2.5 bg-[#1A0A0B] border border-[#EF4444]/40 rounded-lg text-xs font-mono text-[#FCA5A5] break-words">
                      <span className="font-bold text-[#F87171]">Supabase Response: </span>
                      {syncState.error}
                    </div>
                  )}

                  {isFailedToFetch && (
                    <div className="mt-3 p-3.5 bg-[#18212D] border border-[#2B3B4E] rounded-xl text-xs space-y-2 text-[#CBD5E1]">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <WifiOff className="w-4 h-4 text-[#F87171]" />
                        <span>How to resolve "Failed to fetch":</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-[#93ACCC]">
                        <li>
                          <strong className="text-white">Project Paused?</strong> Log into <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] underline">Supabase Dashboard</a> and click "Restore project" if paused.
                        </li>
                        <li>
                          <strong className="text-white">Connect Your Own Supabase?</strong> Go to the <button onClick={() => setActiveTab('settings')} className="text-[#10B981] font-bold underline">Project Credentials</button> tab to enter your own Supabase URL and Anon Key.
                        </li>
                        <li>
                          <strong className="text-white">Ran SQL script?</strong> Ensure your project is active and click <button onClick={() => setActiveTab('sql')} className="text-[#10B981] font-bold underline">SQL Table Setup</button> to copy the table creation script.
                        </li>
                      </ul>
                    </div>
                  )}

                  {!syncState.connected && diagnosis && (
                    <div className="mt-3 p-3.5 bg-[#1C1300] border border-[#F59E0B]/50 rounded-xl text-xs space-y-2 text-[#FDE68A]">
                      <div className="font-bold text-[#FBBF24] flex items-center gap-1.5 text-sm">
                        <AlertCircle className="w-4 h-4 text-[#FBBF24]" />
                        <span>{diagnosis.title}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#FEF3C7]">
                        {diagnosis.explanation}
                      </p>
                      {diagnosis.sqlToCopy && (
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(diagnosis.sqlToCopy!);
                              setCopiedSchema(true);
                              setTimeout(() => setCopiedSchema(false), 2000);
                            }}
                            className="px-3.5 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
                          >
                            {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedSchema ? 'Copied RLS Fix!' : 'Copy RLS Policy Fix SQL'}
                          </button>
                          <a
                            href="https://supabase.com/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#2B2313] hover:bg-[#3D321A] text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1"
                          >
                            <span>Open Supabase SQL Editor</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {!syncState.connected && !isFailedToFetch && !diagnosis && (
                    <div className="mt-3 p-3 bg-[#131B24] border border-[#21303E] rounded-xl text-xs space-y-1.5 text-[#93ACCC]">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>💡 Created tables manually? Need Row Level Security (RLS) policies</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#CBD5E1]">
                        When tables are created in Supabase, Supabase turns on <strong className="text-white">Row Level Security (RLS)</strong> by default which blocks client API reads/writes until policies are added.
                      </p>
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('sql')}
                          className="px-3 py-1 bg-[#10B981] hover:bg-[#059669] text-black font-bold text-[11px] rounded-lg transition-all"
                        >
                          View & Copy SQL Setup Script
                        </button>
                        <a
                          href="https://supabase.com/dashboard"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-[#21303E] hover:bg-[#2C4054] text-white font-medium text-[11px] rounded-lg transition-all flex items-center gap-1"
                        >
                          <span>Open Supabase SQL Editor</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
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
                  <span className="text-[#888888]">REST Base URL:</span>
                  <span className="font-mono text-white font-semibold truncate max-w-[280px]">{getStoredSupabaseUrl()}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#888888]">Authentication Mode:</span>
                  <span className="font-semibold text-[#10B981]">Anon Key / Row Level Security</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#0D201A] border border-[#10B981]/30 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-[#10B981] flex items-center gap-1.5">
                  <span>📋 Quick 3-Step Supabase Database Setup & Repair</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[#CBD5E1] text-[11px] leading-relaxed">
                  <li>Click <strong className="text-white">"Copy SQL Script"</strong> below to copy the complete schema script.</li>
                  <li>Click <strong className="text-white">"Open Supabase SQL Editor"</strong> to open your project's query editor in a new tab.</li>
                  <li>Paste the script in the SQL editor, click <strong className="text-white">"Run"</strong>, then return here and click <strong className="text-[#10B981]">"Sync Now"</strong>.</li>
                </ol>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#888888]">
                    Complete Database Schema & RLS Repair Script
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySql}
                      className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-black rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedSchema ? 'Copied All SQL!' : 'Copy SQL Script'}
                    </button>
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-[#21303E] hover:bg-[#2C4054] text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
                    >
                      <span>Open SQL Editor</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <p className="text-xs text-[#888888] mb-2">
                  This script drops any existing mismatched tables (`users`, `products`, `trade_offers`, `messages`) and recreates them with exact column names and public permissions.
                </p>
                <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 font-mono text-xs text-[#10B981] overflow-x-auto max-h-64 selection:bg-[#21303E]">
                  <pre>{SUPABASE_SQL_SCHEMA}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div className="p-3.5 bg-[#18212D] border border-[#2B3B4E] rounded-xl text-xs space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-[#38BDF8]" />
                  <span>Connect Your Own Supabase Instance</span>
                </h4>
                <p className="text-[#93ACCC] text-[11px] leading-relaxed">
                  You can paste your own project's Supabase URL and anon API key below (found under project Settings &gt; API in Supabase).
                </p>
              </div>

              {savedSuccessMsg && (
                <div className="p-3 bg-[#062419] border border-[#10B981]/40 rounded-xl text-xs font-bold text-[#10B981] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Credentials saved! Attempting connection sync...</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#888888]">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://your-project-id.supabase.co"
                  className="w-full px-3.5 py-2.5 bg-[#161616] border border-[#2A2A2A] focus:border-[#10B981] rounded-xl text-xs text-white font-mono outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#888888]">
                  Supabase Anon API Key
                </label>
                <textarea
                  rows={3}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2.5 bg-[#161616] border border-[#2A2A2A] focus:border-[#10B981] rounded-xl text-xs text-white font-mono outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetCredentials}
                  className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333333] text-[#AAAAAA] hover:text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Default
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Check className="w-4 h-4" />
                  Save & Connect
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#222222] bg-[#141414] flex items-center justify-between">
          <a
            href="https://supabase.com/dashboard"
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

