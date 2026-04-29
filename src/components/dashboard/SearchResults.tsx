"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  Bed, 
  Droplet, 
  Phone, 
  Navigation, 
  ArrowLeft,
  Truck,
  Activity,
  HeartPulse
} from "lucide-react";
import MapView from "../map/MapView";
import { useStore, Hospital, BloodBank, Ambulance, ResourceData } from "../../data/store";

interface SearchResultsProps {
  onBack: () => void;
  searchType: string;
}

export default function SearchResults({ onBack, searchType }: SearchResultsProps) {
  const { searchResults, isLoading } = useStore();

  const renderCard = (item: ResourceData, idx: number) => {
    // Determine card type
    const isHospital = item.type === 'hospital';
    const isBloodBank = item.type === 'bloodbank';
    const isAmbulance = item.type === 'ambulance';

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        className="glass-panel p-5 rounded-xl border border-white/10 hover:border-cyanGlow/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all flex flex-col gap-4 bg-black/40"
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 ${
              isHospital ? "bg-cyanGlow/10 border-cyanGlow/30 text-cyanGlow" :
              isBloodBank ? "bg-accentRed/10 border-accentRed/30 text-accentRed" :
              "bg-orange-500/10 border-orange-500/30 text-orange-500"
            }`}>
              {isHospital ? <Building2 size={24} /> :
               isBloodBank ? <Droplet size={24} /> :
               <Truck size={24} />}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-cyanGlow transition-colors leading-tight">{item.name}</h4>
              <p className="text-xs text-gray-400 capitalize mt-1 flex items-center gap-1">
                {isAmbulance ? <Activity size={12}/> : <Navigation size={12}/>} 
                {item.location}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-bold text-white">{item.distance}</div>
            {isAmbulance && (
              <div className="text-xs text-orange-400 font-bold mt-1">ETA {(item as Ambulance).eta}</div>
            )}
          </div>
        </div>

        {/* Dynamic Details Area Based on Structure */}
        <div className={`bg-white/5 rounded-lg p-3 grid gap-2 border border-white/5 ${isBloodBank ? 'grid-cols-4' : 'grid-cols-2'}`}>
          {isHospital && (
            <div className="col-span-2 grid grid-cols-3 gap-y-3 gap-x-2">
              {[
                { label: "ICU", key: "icu" },
                { label: "General", key: "general" },
                { label: "Emergency", key: "emergency" },
                { label: "Pediatric", key: "pediatric" },
                { label: "Oxygen", key: "oxygen" },
                { label: "Ventilator", key: "ventilator" }
              ].map(bed => {
                const b = (item as Hospital).beds[bed.key as keyof Hospital['beds']];
                return (
                  <div key={bed.key} className="flex flex-col border-r border-white/5 last:border-0">
                    <span className="text-[9px] text-cyanGlow/70 uppercase font-bold tracking-tight">{bed.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-sm font-bold ${b.available > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {b.available}
                      </span>
                      <span className="text-[10px] text-gray-500">/ {b.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isBloodBank && Object.entries((item as BloodBank).blood_inventory).map(([type, count]) => {
            const num = Number(count) || 0;
            const colorClass = num > 20 ? 'text-green-400' : num > 5 ? 'text-orange-400' : 'text-accentRed';
            return (
              <div key={type} className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Type {type}</span>
                <span className={`text-xs font-bold ${colorClass}`}>
                  {num} Units
                </span>
              </div>
            );
          })}

          {isAmbulance && (
            <>
               <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Type</span>
                  <span className="text-xs font-bold text-gray-300">{(item as Ambulance).vehicleType}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Status</span>
                  <span className={`text-xs font-bold ${(item as Ambulance).available ? 'text-green-400' : 'text-accentRed'}`}>
                    {(item as Ambulance).available ? 'Available' : 'En Route'}
                  </span>
               </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-1">
          <button 
            onClick={() => window.open(item.mapLink, '_blank')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyanGlow/80 to-blue-500/80 hover:from-cyanGlow hover:to-blue-500 text-deepBlue text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]"
          >
            {isAmbulance ? <HeartPulse size={16} /> : <Navigation size={16} />}
            {isAmbulance ? "Dispatch Unit" : "Request Route"}
          </button>
          <a href={`tel:${item.contact}`} className="w-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 hover:border-white/30 transition-colors">
            <Phone size={16} />
          </a>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full flex-1 flex flex-col sm:min-h-[calc(100vh-70px)] bg-deepBlue">
      {/* Top Search Edit / Filter Bar */}
      <div className="h-[60px] bg-black/80 border-b border-glass-border flex items-center gap-4 px-6 shrink-0 z-20 sticky top-[70px] backdrop-blur-md">
        <button 
          onClick={onBack}
          className="w-10 h-10 shrink-0 rounded-full border border-white/20 bg-deepBlue/50 text-white flex items-center justify-center hover:bg-cyanGlow hover:text-deepBlue hover:border-cyanGlow transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-4 w-full">
          <div>
            <h2 className="text-white font-bold text-lg capitalize">{searchType.replace('-', ' ')} Results</h2>
            <p className="text-xs text-cyanGlow font-medium">Auto-radius: Nearest 5 Miles</p>
          </div>
          <div className="ml-auto hidden md:flex gap-3">
             <span className="text-xs font-semibold px-3 py-1 bg-white/10 border border-white/20 text-gray-300 rounded-lg">Response Layer Active</span>
          </div>
        </div>
      </div>

      {/* Main Responsive Split View using properly configured Grid with Spacing */}
      <div className="flex-1 w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[20px] p-[20px] relative z-10 items-start">
        
        {/* Left Side: Listing List Container */}
        <div className="w-full flex flex-col bg-deepBlue lg:border-r lg:border-glass-border">
          <div className="pb-2 shrink-0 border-b border-white/5 flex justify-between items-end mb-4 pr-6">
            <h3 className="text-xl font-bold text-white">Active Catalog</h3>
            {isLoading ? (
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-cyanGlow border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-sm text-cyanGlow">Scanning...</span>
               </div>
            ) : (
               <p className="text-sm text-gray-400">{searchResults.length} resources found</p>
            )}
          </div>

          <div className="flex flex-col gap-[20px] pb-10 pr-6">
            {isLoading ? (
              <div className="flex flex-col gap-[20px]">
                {[1, 2, 3].map(n => (
                  <div key={n} className="min-h-[160px] bg-white/5 animate-pulse rounded-xl border border-white/10"></div>
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No resources found for this category.</div>
            ) : (
              searchResults.map((item, idx) => renderCard(item, idx))
            )}
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="w-full h-[400px] lg:h-[calc(100vh-160px)] relative shrink-0 sticky top-[120px] rounded-xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-[#0B1C2C]">
           <MapView />
        </div>
      </div>
    </div>
  );
}

