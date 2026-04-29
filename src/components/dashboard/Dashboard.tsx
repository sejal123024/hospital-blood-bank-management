"use client";

import { useState } from "react";
import { Search, Map as MapIcon, LogOut, Settings } from "lucide-react";

// Components
import DashboardHome from "./DashboardHome";
import SearchResults from "./SearchResults";
import AdminHub from "./AdminHub";
import AIChatbot from "../ui/AIChatbot";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [view, setView] = useState<"home" | "search" | "admin">("home");
  const [searchType, setSearchType] = useState<string>("hospitals");

  const handleSearch = (type: string) => {
    setSearchType(type);
    setView("search");
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-deepBlue font-sans">
      
      {/* MMT Style Top Header / Navigation (Fixed and very thin) */}
      <header className="h-[70px] w-full border-b border-white/10 glass-panel bg-black/60 flex items-center justify-between px-6 z-50 sticky top-0 backdrop-blur-md">
        {/* Left: Logo */}
        <div 
          onClick={() => setView("home")}
          className="flex flex-col cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-cyanGlow/20 border border-cyanGlow flex items-center justify-center glow-border group-hover:bg-cyanGlow/40 transition-colors">
              <span className="text-cyanGlow font-black text-lg">L</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-widest uppercase">
              Life<span className="text-cyanGlow drop-shadow-[0_0_8px_rgba(0,229,255,1)]">Link</span>
            </h1>
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-2 lg:gap-6">
          <button 
            onClick={() => handleSearch("hospitals")}
            className="hidden lg:flex items-center gap-2 bg-black/50 border border-white/10 px-4 py-1.5 rounded-lg hover:bg-white/10 hover:border-cyanGlow/50 transition-colors group"
          >
            <MapIcon size={16} className="text-gray-400 group-hover:text-cyanGlow" />
            <div className="text-left flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Live Routing</span>
              <span className="text-xs text-white font-black hover:text-cyanGlow transition-colors">Medical Map</span>
            </div>
          </button>
          
          <button 
            onClick={() => { setView("admin"); window.scrollTo({ top: 0 }); }}
            className="hidden md:flex items-center gap-2 bg-black/50 border border-white/10 px-4 py-1.5 rounded-lg hover:bg-white/10 hover:border-cyanGlow/50 transition-colors group"
          >
            <Settings size={16} className="text-gray-400 group-hover:text-cyanGlow" />
            <div className="text-left flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Manage Hub</span>
              <span className="text-xs text-white font-black hover:text-cyanGlow transition-colors">Admin Panel</span>
            </div>
          </button>

          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:border-red-500 px-4 py-1.5 rounded-lg transition-all group"
          >
            <LogOut size={16} className="text-red-400 group-hover:text-white" />
            <span className="text-xs text-red-400 font-bold group-hover:text-white transition-colors">Logout</span>
          </button>

        </div>
      </header>

      {/* Main Dynamic View Area (MakeMyTrip structured layout) */}
      <main className="flex-1 w-full flex flex-col relative z-0">
        {view === "home" ? (
          <DashboardHome onSearch={handleSearch} />
        ) : view === "search" ? (
          <SearchResults searchType={searchType} onBack={() => setView("home")} />
        ) : (
          <AdminHub onBack={() => setView("home")} />
        )}
      </main>

      {/* Footer Area */}
      {view === "home" && (
        <footer className="w-full bg-black py-12 px-6 border-t border-glass-border relative z-0 lg:mt-20">
          <div className="absolute inset-0 bg-gradient-to-t from-cyanGlow/5 to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded bg-cyanGlow/20 border border-cyanGlow flex items-center justify-center glow-border">
                  <span className="text-cyanGlow font-black text-lg">L</span>
                </div>
                <h1 className="text-xl font-bold text-white tracking-widest uppercase">
                  Life<span className="text-cyanGlow">Link</span>
                </h1>
              </div>
              <p className="text-xs text-gray-500 max-w-sm">Connecting emergency services, hospitals, and blood banks seamlessly to save lives during critical incidents.</p>
            </div>
            <div className="text-gray-400 text-xs text-center md:text-right space-y-2 font-semibold">
              <p>© 2026 LifeLink Medical Systems. All rights reserved.</p>
              <div className="flex gap-4 justify-center md:justify-end">
                <span className="hover:text-cyanGlow cursor-pointer transition-colors">Privacy Policy</span>
                <span className="border-l border-gray-600 pl-4 hover:text-cyanGlow cursor-pointer transition-colors">Security Response</span>
                <span className="border-l border-gray-600 pl-4 hover:text-cyanGlow cursor-pointer transition-colors">Contact Command Point</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Floating AI Assistant imported matching MMT's style */}
      <AIChatbot />
    </div>
  );
}
