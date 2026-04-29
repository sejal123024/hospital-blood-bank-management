"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, RefreshCw, Trash2, ShieldAlert, Download, Search, CheckCircle2, XCircle, Clock } from "lucide-react";

interface HubConnection {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  addedAt: string;
  lastFetched: string | null;
  lastStatus: "pending" | "online" | "offline" | "timeout";
  lastData: any;
}

interface AdminHubProps {
  onBack: () => void;
}

const ADMIN_PASSWORD = "sejal@123";
const STORAGE_KEY = "hospital_hub_connections";

export default function AdminHub({ onBack }: AdminHubProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [connections, setConnections] = useState<HubConnection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Add Form State
  const [addName, setAddName] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addKey, setAddKey] = useState("");
  
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);

  // Load connections from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setConnections(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load connections:", e);
    }
  }, []);

  const saveConnections = (newConns: HubConnection[]) => {
    setConnections(newConns);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConns));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Access denied.");
      setPasswordInput("");
    }
  };

  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addUrl.trim()) return;
    
    const newConn: HubConnection = {
      id: "h_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      name: addName.trim(),
      url: addUrl.trim().replace(/\/+$/, ""),
      apiKey: addKey.trim(),
      addedAt: new Date().toISOString(),
      lastFetched: null,
      lastStatus: "pending",
      lastData: null,
    };
    
    saveConnections([...connections, newConn]);
    setAddName("");
    setAddUrl("");
    setAddKey("");
  };

  const handleRemoveConnection = (id: string) => {
    if (window.confirm("Remove this hospital connection?")) {
      saveConnections(connections.filter(c => c.id !== id));
    }
  };

  const fetchHospital = async (conn: HubConnection): Promise<HubConnection> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      // Use Server-Side Proxy to bypass Browser CORS completely
      const res = await fetch(`/api/hub-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: conn.url,
          apiKey: conn.apiKey
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      let json;
      try {
        json = await res.json();
      } catch (e) {
        throw new Error(`HTTP ${res.status}: Failed to parse response`);
      }

      if (!res.ok) {
        throw new Error(`Proxy Error: ${json.error || `HTTP ${res.status}`}`);
      }

      return {
        ...conn,
        lastFetched: new Date().toISOString(),
        lastStatus: "online",
        lastData: json.data || json,
      };
    } catch (err: any) {
      console.error(`Fetch Error for ${conn.url}:`, err.message);
      return {
        ...conn,
        lastFetched: new Date().toISOString(),
        lastStatus: err.name === "AbortError" ? "timeout" : "offline",
        lastData: null,
      };
    }
  };

  const handleFetchOne = async (id: string) => {
    const conn = connections.find(c => c.id === id);
    if (!conn) return;
    
    const updatedConn = await fetchHospital(conn);
    saveConnections(connections.map(c => c.id === id ? updatedConn : c));
  };

  const handleFetchAll = async () => {
    if (connections.length === 0) return;
    
    setIsFetchingAll(true);
    setFetchProgress(0);
    
    const newConns = [...connections];
    let done = 0;
    
    // Batch processing
    const batchSize = 10;
    for (let i = 0; i < newConns.length; i += batchSize) {
      const batch = newConns.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(c => fetchHospital(c)));
      
      results.forEach(res => {
        const idx = newConns.findIndex(c => c.id === res.id);
        if (idx >= 0) newConns[idx] = res;
      });
      
      done += batch.length;
      setFetchProgress((done / newConns.length) * 100);
      saveConnections([...newConns]); // Save partial results
    }
    
    setIsFetchingAll(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(connections, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifelink_hospital_hub_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (window.confirm("WARNING: Are you sure you want to remove ALL connected hospitals?")) {
      saveConnections([]);
    }
  };

  // Aggregated Stats
  const stats = connections.reduce(
    (acc, c) => {
      acc.totalHospitals++;
      if (c.lastStatus === "online") acc.onlineCount++;
      if (c.lastData && c.lastData.beds) {
        const beds = c.lastData.beds;
        Object.values(beds).forEach((b: any) => {
          acc.totalBeds += b.total || 0;
          acc.totalAvailable += b.available || 0;
        });
        acc.totalICUAvail += beds.icu?.available || 0;
      }
      return acc;
    },
    { totalHospitals: 0, onlineCount: 0, totalBeds: 0, totalAvailable: 0, totalICUAvail: 0 }
  );

  const filteredConnections = connections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="bg-black/50 border border-white/10 rounded-2xl p-8 max-w-md w-full glass-panel shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
              <ShieldAlert size={32} className="text-red-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-white mb-2">Restricted Access</h2>
          <p className="text-gray-400 text-center mb-8 text-sm">Central Hub Admin Panel. Please verify your identity.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Admin Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                autoFocus
              />
              {authError && <p className="text-red-400 text-xs mt-2 font-medium">{authError}</p>}
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={onBack}
                className="flex-1 py-3 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
              >
                Back
              </button>
              <button 
                type="submit"
                className="flex-[2] py-3 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                Access Hub
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 font-sans">
      
      {/* Header & Back Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyanGlow transition-colors group"
          >
            <ArrowLeft size={20} className="text-gray-400 group-hover:text-cyanGlow" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-cyanGlow">🌐</span> Central Hospital Hub
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage and aggregate data from unlimited remote hospital APIs</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white rounded-lg transition-colors font-bold text-sm"
        >
          Logout Admin
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Connected Hospitals", val: stats.totalHospitals, col: "text-white" },
          { label: "Online Now", val: stats.onlineCount, col: "text-green-400" },
          { label: "Overall Total", val: stats.totalBeds, col: "text-blue-400" },
          { label: "Overall Avail", val: stats.totalAvailable, col: "text-cyanGlow" },
          { label: "ICU Available", val: stats.totalICUAvail, col: "text-pink-400" }
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center items-center text-center">
            <div className={`text-2xl font-bold ${s.col} mb-1`}>{s.val.toLocaleString()}</div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col: Add Form */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus size={18} className="text-cyanGlow" /> Add Connection
            </h2>
            
            <form onSubmit={handleAddConnection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Hospital Name</label>
                <input 
                  type="text" 
                  required
                  value={addName} onChange={e => setAddName(e.target.value)}
                  placeholder="e.g. City Hospital Pune"
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyanGlow outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">API Base URL</label>
                <input 
                  type="url" 
                  required
                  value={addUrl} onChange={e => setAddUrl(e.target.value)}
                  placeholder="https://your-hospital.vercel.app"
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-cyan-200 font-mono focus:border-cyanGlow outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">API Key (Optional)</label>
                <input 
                  type="password" 
                  value={addKey} onChange={e => setAddKey(e.target.value)}
                  placeholder="API key for secured endpoints"
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyanGlow outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-cyanGlow/20 border border-cyanGlow text-cyanGlow hover:bg-cyanGlow hover:text-black font-bold rounded-lg transition-colors mt-2"
              >
                Add Hospital
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: List & Actions */}
        <div className="lg:col-span-2 flex flex-col">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search hospitals..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-cyanGlow outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button onClick={handleFetchAll} disabled={isFetchingAll || connections.length===0} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap">
                <RefreshCw size={14} className={isFetchingAll ? "animate-spin" : ""} /> Fetch All
              </button>
              <button onClick={handleExport} disabled={connections.length===0} className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap">
                <Download size={14} /> Export
              </button>
              <button onClick={handleClearAll} disabled={connections.length===0} className="flex items-center gap-2 px-3 py-2 bg-red-900/40 hover:bg-red-800 border border-red-800 text-red-300 hover:text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap">
                <Trash2 size={14} /> Clear All
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {isFetchingAll && (
            <div className="w-full h-1.5 bg-gray-800 rounded-full mb-4 overflow-hidden">
              <div className="h-full bg-cyanGlow transition-all duration-300" style={{ width: `${fetchProgress}%` }}></div>
            </div>
          )}

          {/* Grid */}
          {connections.length === 0 ? (
            <div className="flex-1 border border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center p-12 text-center bg-black/20">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert size={32} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Hospitals Connected</h3>
              <p className="text-gray-400 text-sm max-w-md">Use the form on the left to add hospital API endpoints and start aggregating real-time bed data centrally.</p>
            </div>
          ) : filteredConnections.length === 0 ? (
            <div className="text-center p-8 text-gray-500">No hospitals match your search.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 auto-rows-max">
              {filteredConnections.map(c => {
                const isOnline = c.lastStatus === "online";
                const isPending = c.lastStatus === "pending";
                
                const StatusIcon = isOnline ? CheckCircle2 : isPending ? Clock : XCircle;
                const statusColor = isOnline ? "text-green-400" : isPending ? "text-gray-400" : "text-red-400";
                const badgeBg = isOnline ? "bg-green-400/10 border-green-400/20" : isPending ? "bg-gray-400/10 border-gray-400/20" : "bg-red-400/10 border-red-400/20";
                
                return (
                  <div key={c.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors flex flex-col">
                    <div className="p-4 border-b border-white/10 flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{c.name}</h4>
                        <p className="text-[10px] text-cyan-200/70 font-mono truncate mt-0.5">{c.url}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${badgeBg} ${statusColor} text-[10px] font-bold uppercase tracking-wider flex-shrink-0`}>
                        <StatusIcon size={12} /> {c.lastStatus}
                      </div>
                    </div>
                    
                    <div className="p-4 grid grid-cols-3 gap-y-4 gap-x-2 bg-black/20 flex-1">
                      {[
                        { label: "ICU", key: "icu" },
                        { label: "General", key: "general" },
                        { label: "Emergency", key: "emergency" },
                        { label: "Pediatric", key: "pediatric" },
                        { label: "Oxygen", key: "oxygen" },
                        { label: "Ventilator", key: "ventilator" }
                      ].map(bed => {
                        const b = c.lastData?.beds?.[bed.key] || { total: 0, available: 0 };
                        return (
                          <div key={bed.key} className="text-center border-r border-white/5 last:border-0">
                            <div className="text-xs font-black text-white">{b.available}<span className="text-[10px] text-gray-500 font-normal">/{b.total}</span></div>
                            <div className="text-[8px] text-gray-400 font-bold uppercase mt-1">{bed.label}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="px-4 py-2 bg-white/5 flex justify-between items-center">
                      <span className="text-[10px] text-gray-500">Last: {c.lastFetched ? new Date(c.lastFetched).toLocaleTimeString() : "Never"}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleFetchOne(c.id)} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold transition-colors">
                          Fetch
                        </button>
                        <button onClick={() => handleRemoveConnection(c.id)} className="px-2 py-1 hover:bg-red-900/30 text-red-400 rounded text-xs transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
