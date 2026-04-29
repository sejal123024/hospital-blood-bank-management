"use client";

import { useState, useEffect } from "react";
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
  const [liveHospitals, setLiveHospitals] = useState<any[]>([]);
  const [liveEmergency, setLiveEmergency] = useState<any[]>([]);

  // Fetch real-time data from Excel for the dashboard cards
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const [hospRes, emerRes] = await Promise.all([
          fetch(`/api/hospitals?t=${Date.now()}`, { cache: 'no-store' }),
          fetch(`/api/ambulance?t=${Date.now()}`, { cache: 'no-store' })
        ]);
        const hospitals = await hospRes.json();
        const emergency = await emerRes.json();
        setLiveHospitals(hospitals);
        setLiveEmergency(emergency);
      } catch (e) {
        console.error("Failed to fetch live dashboard data:", e);
      }
    };
    fetchLiveData();

    // Auto-refresh every 10 seconds for real-time feel
    const interval = setInterval(fetchLiveData, 10000);
    return () => clearInterval(interval);
  }, []);

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

  // Hospital image URLs from public sources
  const hospitalImages: Record<string, string> = {
    "Lilavati Hospital and Research Centre": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80",
    "Kokilaben Dhirubhai Ambani Hospital": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    "Hinduja Hospital": "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&q=80",
    "Nanavati Super Speciality Hospital": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80",
    "Breach Candy Hospital": "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&q=80",
  };

  const defaultImages = [
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&q=80",
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80",
    "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&q=80",
    "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=600&q=80",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
    "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&q=80",
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
                  <div className="text-3xl font-bold text-white mb-1">Mumbai</div>
                  <div className="text-sm text-gray-500">Maharashtra, Bandra West</div>
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

                {/* Date/Time - Live */}
                <div className="lg:w-1/4 p-4 md:p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                  <span className="text-sm font-semibold text-gray-400 group-hover:text-cyanGlow flex items-center gap-2 mb-1">
                    <Calendar size={16} /> LIVE TIME
                  </span>
                  <div className="text-xl md:text-3xl font-bold text-white mb-1">
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Patients/Patients */}
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
        
        {/* Live Emergency Services Status - Real-time from Excel */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white drop-shadow-md">Live Emergency Services</h2>
              <p className="text-sm text-gray-400 mt-1">Real-time status from Mumbai Emergency Directory • Auto-refreshes every 10s</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="flex items-center gap-2 text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {liveEmergency.filter((e: any) => e.available).length} Available
              </span>
              <span className="flex items-center gap-2 text-xs text-red-400 font-bold bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg">
                {liveEmergency.filter((e: any) => !e.available).length} Unavailable
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(liveEmergency.length > 0 ? liveEmergency.slice(0, 8) : []).map((item: any, idx: number) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel group overflow-hidden rounded-2xl border border-glass-border hover:border-cyanGlow/50 transition-all cursor-pointer bg-black/40 shadow-lg relative p-5 flex flex-col justify-between min-h-[200px]"
              >
                {/* Status indicator */}
                <div className="flex justify-between items-start">
                  <div className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-widest shadow-md ${
                    item.available 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {item.available ? '✅ Available' : '🔴 Unavailable'}
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">{item.vehicleType}</span>
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-base font-bold text-white mb-1 leading-snug group-hover:text-cyanGlow transition-colors">{item.name}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin size={12} /> {item.location}
                  </p>
                  {item.contact && item.contact !== "Unknown Address" && (
                    <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-1">{item.contact}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {liveEmergency.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(n => (
                <div key={n} className="min-h-[200px] bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
              ))}
            </div>
          )}
        </section>

        {/* Top Rated Hospitals Collections - Real-time from Excel with images */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white drop-shadow-md">Top Rated Healthcare Networks</h2>
              <p className="text-sm text-gray-400 mt-1">Live hospital data from Mumbai Healthcare Directory</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-white/20 bg-deepBlue/50 text-white flex items-center justify-center hover:bg-cyanGlow hover:text-deepBlue hover:border-cyanGlow transition-colors"><ChevronLeft size={20}/></button>
              <button className="w-10 h-10 rounded-full border border-white/20 bg-deepBlue/50 text-white flex items-center justify-center hover:bg-cyanGlow hover:text-deepBlue hover:border-cyanGlow transition-colors"><ChevronRight size={20}/></button>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {(liveHospitals.length > 0 ? liveHospitals : []).map((hospital: any, idx: number) => {
              const imgUrl = hospitalImages[hospital.name] || defaultImages[idx % defaultImages.length];
              return (
                <motion.div 
                  key={hospital.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="min-w-[280px] h-[320px] rounded-2xl relative overflow-hidden group cursor-pointer border border-glass-border shadow-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all shrink-0"
                  onClick={() => {
                    fetchData("hospitals");
                    onSearch("hospitals");
                  }}
                >
                  {/* Real hospital image */}
                  <img 
                    src={imgUrl}
                    alt={hospital.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Top badge */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-lg z-10">
                    Top Rated
                  </div>

                  {/* Bed availability badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur-md border ${
                      hospital.beds?.icu > 0 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      ICU: {hospital.beds?.icu || 0}
                    </div>
                  </div>
                  
                  {/* Info overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/90 to-transparent pt-16 z-10">
                    <h3 className="text-lg font-bold text-white mb-1 leading-tight group-hover:text-cyanGlow transition-colors">{hospital.name}</h3>
                    <p className="text-sm text-gray-300 flex items-center gap-1 mb-2">
                      <MapPin size={12} /> {hospital.location}
                    </p>
                    <div className="flex gap-3 text-[11px] font-bold">
                      <span className="text-cyanGlow bg-cyanGlow/10 px-2 py-0.5 rounded">General: {hospital.beds?.general || 0}</span>
                      <span className="text-gray-400">{hospital.distance}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {liveHospitals.length === 0 && [1,2,3,4,5].map(n => (
              <div key={n} className="min-w-[280px] h-[320px] bg-white/5 animate-pulse rounded-2xl border border-white/10 shrink-0"></div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
