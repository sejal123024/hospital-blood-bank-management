"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Bed, 
  Droplet, 
  ShieldAlert, 
  Truck,
  HeartPulse,
  Activity,
  MapPin,
  Calendar,
  User,
  Search,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useStore } from "../../data/store";

interface DashboardHomeProps {
  onSearch: (type: string) => void;
}

export default function DashboardHome({ onSearch }: DashboardHomeProps) {
  const [activeTab, setActiveTab] = useState("hospitals");
  const fetchData = useStore((state) => state.fetchData);

  const handleSearchClick = () => {
    fetchData(activeTab);
    onSearch(activeTab);
  };

  const tabs = [
    { id: "hospitals", label: "Hospitals", icon: <Building2 size={24} /> },
    { id: "icu", label: "ICU Beds", icon: <Bed size={24} /> },
    { id: "blood", label: "Blood Banks", icon: <Droplet size={24} /> },
    { id: "emergency", label: "Emergency", icon: <ShieldAlert size={24} className="text-accentRed animate-pulse" /> },
  ];

  return (
    <div className="w-full relative pb-20">
      
      {/* Hero Section with Video Background */}
      <div className="relative w-full min-h-[70vh] lg:min-h-[650px] flex justify-center pt-12 pb-32 px-4 overflow-hidden">
        {/* Background Video (Video Project 3) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/bg-video-3.mp4" type="video/mp4" />
        </video>

        {/* Clean minimal background overlay that fades at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#0B1C2C] z-0 pointer-events-none"></div>

        {/* Central MMT-style Floating Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-6xl glass-panel bg-black/50 border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col mt-4 backdrop-blur-xl"
        >
          {/* Top Tabs */}
          <div className="flex w-full flex-wrap sm:flex-nowrap border-b border-white/10 p-2 gap-2 bg-gradient-to-r from-white/5 to-transparent rounded-t-2xl overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl transition-all relative ${
                  activeTab === tab.id 
                    ? "bg-cyanGlow/10 text-cyanGlow border border-cyanGlow/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                <span className="text-sm font-bold tracking-wide">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-[9px] w-12 h-1 bg-cyanGlow rounded-t-full shadow-[0_0_10px_rgba(0,229,255,0.8)] z-10"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search Content Body */}
          <div className="p-6 md:p-8">
            {/* Search Flow (MMT Flight style) */}
            <div className="flex flex-col gap-6 relative">
              
              {/* Radio options representing MMT "One Way / Round Trip" equivalent */}
              <div className="flex gap-6 items-center">
                <label className="flex items-center gap-2 cursor-pointer text-white font-semibold text-sm group">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${activeTab !== 'emergency' ? 'border-cyanGlow' : 'border-gray-500'}`}>
                    {activeTab !== 'emergency' && <div className="w-2 h-2 rounded-full bg-cyanGlow"></div>}
                  </div>
                  Standard Booking
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white font-semibold text-sm group">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(255,59,59,0.5)] ${activeTab === 'emergency' ? 'border-accentRed' : 'border-gray-500'}`}>
                    {activeTab === 'emergency' && <div className="w-2 h-2 rounded-full bg-accentRed animate-ping"></div>}
                  </div>
                  Emergency Trauma Override
                </label>
              </div>

              {/* Main Inputs */}
              <div className="flex flex-col lg:flex-row border border-white/20 rounded-xl overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-white/20 bg-deepBlue/40">
                
                {/* Location / From */}
                <div className="flex-1 p-4 md:p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                  <span className="text-sm font-semibold text-gray-400 group-hover:text-cyanGlow flex items-center gap-2 mb-1">
                    <MapPin size={16} /> CURRENT LOCATION
                  </span>
                  <div className="text-3xl font-bold text-white mb-1">New York</div>
                  <div className="text-sm text-gray-500">NY, Times Square, Sector 4</div>
                </div>

                {/* Swap Icon */}
                <div className="hidden lg:flex items-center justify-center bg-transparent border-none -mx-3 z-10">
                  <div className="w-10 h-10 rounded-full bg-cyanGlow/20 border border-cyanGlow flex items-center justify-center text-cyanGlow shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                    <Activity size={20} className="animate-pulse" />
                  </div>
                </div>

                {/* To / Resource type */}
                <div className="flex-1 p-4 md:p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                  <span className="text-sm font-semibold text-gray-400 group-hover:text-cyanGlow flex items-center gap-2 mb-1">
                    <HeartPulse size={16} /> REQUIRED RESOURCE
                  </span>
                  <div className="text-3xl font-bold text-white mb-1">
                    {activeTab === 'hospitals' ? "Trauma Level 1" : activeTab === 'blood' ? "O- Negative" : "ICU Bed"}
                  </div>
                  <div className="text-sm text-gray-500">Must be within 5 miles radius</div>
                </div>

                {/* Date/Time */}
                <div className="lg:w-1/4 p-4 md:p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                  <span className="text-sm font-semibold text-gray-400 group-hover:text-cyanGlow flex items-center gap-2 mb-1">
                    <Calendar size={16} /> ETA / DEPARTURE
                  </span>
                  <div className="text-xl md:text-3xl font-bold text-white mb-1">
                    19 <span className="text-xl">Mar '26</span>
                  </div>
                  <div className="text-sm text-gray-500">Thursday, 10:45 PM</div>
                </div>

                {/* Passengers/Patients */}
                <div className="lg:w-1/4 p-4 md:p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                  <span className="text-sm font-semibold text-gray-400 group-hover:text-cyanGlow flex items-center gap-2 mb-1">
                    <User size={16} /> PATIENTS & TYPE
                  </span>
                  <div className="text-xl md:text-3xl font-bold text-white mb-1">
                    1 <span className="text-xl">Priority</span>
                  </div>
                  <div className="text-sm text-gray-500">Critical / First Responder</div>
                </div>
              </div>

              {/* Special options row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2">
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                  <Activity size={14} className="text-green-400" /> Active Network
                </span>
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                  <ShieldAlert size={14} className="text-orange-400" /> Insurance Validated
                </span>
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                  <Truck size={14} className="text-cyanGlow" /> Fleet Standby
                </span>
              </div>
            </div>

            {/* MMT Style Search Button using Flex */}
            <div className="mt-8 flex justify-center w-full pb-4">
              <button 
                onClick={handleSearchClick} 
                className="px-16 py-4 bg-gradient-to-r from-cyanGlow to-blue-500 hover:from-white hover:to-cyanGlow border-2 border-deepBlue ring-4 ring-cyanGlow/30 text-deepBlue uppercase font-black tracking-widest text-xl rounded-full shadow-[0_10px_30px_rgba(0,229,255,0.6)] hover:scale-105 transition-all"
              >
                Search Network
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* MMT Style Handpicked Collections & Offers below the fold */}
      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-12 relative z-10">
        
        {/* Urgent Requirements Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">Critical Alerts & Requirements</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-white/20 bg-deepBlue/50 text-white flex items-center justify-center hover:bg-cyanGlow hover:text-deepBlue hover:border-cyanGlow transition-colors"><ChevronLeft size={20}/></button>
              <button className="w-10 h-10 rounded-full border border-white/20 bg-deepBlue/50 text-white flex items-center justify-center hover:bg-cyanGlow hover:text-deepBlue hover:border-cyanGlow transition-colors"><ChevronRight size={20}/></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="glass-panel group overflow-hidden rounded-2xl border border-glass-border hover:border-accentRed/50 transition-all cursor-pointer bg-black/40 shadow-lg relative h-[250px]">
                <div className="absolute top-0 right-0 m-4 bg-white text-deepBlue text-[10px] font-black uppercase px-2 py-1 rounded-full z-10 tracking-widest shadow-md">
                  Priority 1
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/60 to-transparent z-0"></div>
                <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                  <p className="text-xs text-accentRed font-bold mb-1 uppercase tracking-widest flex items-center gap-1.5"><ShieldAlert size={14}/> MASS CASUALTY</p>
                  <h3 className="text-xl font-bold text-white mb-2 leading-snug">Multiple Vehicle Collision on I-405</h3>
                  <p className="text-sm text-gray-300 line-clamp-2">Requesting minimum 4 ICU beds, severe trauma surgeons on standby, and O- blood units.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated Hospitals Collections styled like MMT Collections */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">Top Rated Healthcare Networks</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-white/20 bg-deepBlue/50 text-white flex items-center justify-center hover:bg-cyanGlow hover:text-deepBlue hover:border-cyanGlow transition-colors"><ChevronLeft size={20}/></button>
              <button className="w-10 h-10 rounded-full border border-white/20 bg-deepBlue/50 text-white flex items-center justify-center hover:bg-cyanGlow hover:text-deepBlue hover:border-cyanGlow transition-colors"><ChevronRight size={20}/></button>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {[
              { title: "Level 1 Trauma Centers", sub: "Fully equipped for severe emergencies", img: "bg-gradient-to-br from-cyan-900 to-deepBlue" },
              { title: "Specialized Cardiac Units", sub: "Top ranked cardiology departments", img: "bg-gradient-to-br from-blue-900 to-indigo-900" },
              { title: "Pediatric Emergency", sub: "Dedicated 24/7 children's care", img: "bg-gradient-to-br from-teal-900 to-emerald-900" },
              { title: "Regional Blood Drives", sub: "Participate in local donation camps", img: "bg-gradient-to-br from-red-900 to-black" },
              { title: "Maternity Centers", sub: "High-risk pregnancy specialized", img: "bg-gradient-to-br from-purple-900 to-violet-900" },
            ].map((collection, idx) => (
              <div 
                key={idx} 
                className={`min-w-[280px] h-[320px] rounded-2xl relative overflow-hidden group cursor-pointer ${collection.img} border border-glass-border shadow-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all shrink-0`}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
                
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  Top {idx + 3} List
                </div>
                
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-cyanGlow transition-colors">{collection.title}</h3>
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{collection.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
