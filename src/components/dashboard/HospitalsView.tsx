"use client";

import { motion } from "framer-motion";
import { Building2, Bed, Droplet, Phone, Navigation, Info, Search, HeartPulse } from "lucide-react";

interface HospitalsViewProps {
  title: string;
}

export default function HospitalsView({ title }: HospitalsViewProps) {
  const isBloodView = title.toLowerCase().includes("blood");
  const isICUView = title.toLowerCase().includes("icu");

  const facilities = [
    {
      id: 1,
      name: "Central Memorial Hospital",
      distance: "2.4 miles",
      type: "Level 1 Trauma Center",
      status: "Active",
      icuBeds: 12,
      bloodStock: { "O-": "Critically Low", "A+": "Adequate" },
      contact: "555-0192",
    },
    {
      id: 2,
      name: "Westside Medical Complex",
      distance: "5.1 miles",
      type: "General Hospital",
      status: "Active",
      icuBeds: 4,
      bloodStock: { "O-": "Adequate", "A+": "High" },
      contact: "555-0211",
    },
    {
      id: 3,
      name: "St. John's Regional",
      distance: "8.7 miles",
      type: "Specialty Care",
      status: "Capacity Warning",
      icuBeds: 0,
      bloodStock: { "O-": "Low", "A+": "Adequate" },
      contact: "555-0304",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400">Search and filter available regional resources.</p>
        </div>
        
        <div className="relative w-full md:w-96 flex items-center">
          <Search className="absolute left-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full bg-black/40 border border-glass-border pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyanGlow focus:ring-1 focus:ring-cyanGlow transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((fac, idx) => (
          <motion.div
            key={fac.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 rounded-xl border border-glass-border hover:border-cyanGlow/50 hover:shadow-[0_4px_20px_rgba(0,229,255,0.1)] transition-all flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg flex items-center justify-center
                  ${isBloodView ? "bg-accentRed/20 text-accentRed border border-accentRed/30" : 
                    isICUView ? "bg-cyanGlow/20 text-cyanGlow border border-cyanGlow/30" : 
                    "bg-deepBlue/50 text-white border border-glass-border"}
                `}>
                  {isBloodView ? <Droplet size={24} /> : 
                   isICUView ? <Bed size={24} /> : 
                   <Building2 size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white leading-tight">{fac.name}</h3>
                  <p className="text-xs text-cyanGlow font-medium tracking-wide uppercase mt-1">{fac.type}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 py-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 flex items-center gap-2"><Navigation size={16}/> Distance</span>
                <span className="text-white font-medium">{fac.distance}</span>
              </div>
              
              {!isBloodView && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><Bed size={16}/> ICU Availability</span>
                  <span className={`font-bold px-2 py-1 rounded text-xs ${fac.icuBeds > 5 ? "bg-green-500/20 text-green-400" : fac.icuBeds > 0 ? "bg-orange-500/20 text-orange-400" : "bg-accentRed/20 text-accentRed"}`}>
                    {fac.icuBeds} Beds
                  </span>
                </div>
              )}

              {(!isICUView || isBloodView) && (
                <div className="pt-2 border-t border-white/5 border-dashed">
                  <span className="text-gray-400 flex items-center gap-2 text-sm mb-2"><Droplet size={16}/> Critical Blood Inventory</span>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded bg-black/40 border border-glass-border ${fac.bloodStock["O-"].includes("Low") ? "text-accentRed border-accentRed/50" : "text-green-400"}`}>
                      O- : {fac.bloodStock["O-"]}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-black/40 border border-glass-border text-green-400">
                      A+ : {fac.bloodStock["A+"]}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-glass-border flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black/40 hover:bg-white/10 text-white text-sm font-semibold rounded-lg border border-glass-border transition-colors">
                <Info size={16} /> Details
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyanGlow text-deepBlue text-sm font-bold rounded-lg hover:bg-white transition-all shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                <Phone size={16} /> Contact
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
