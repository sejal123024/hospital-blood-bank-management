"use client";

import dynamic from "next/dynamic";
import { Activity } from "lucide-react";

// Dynamically import the leaflet mapping component to prevent Next.js SSR "window is not defined" error
const MapWithNoSSR = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0B1C2C] border-l border-white/10">
      <div className="relative">
        <Activity size={40} className="text-cyanGlow animate-pulse" />
        <div className="absolute inset-0 border-2 border-cyanGlow rounded-full animate-ping opacity-20"></div>
      </div>
      <p className="mt-4 text-xs font-bold text-cyanGlow tracking-widest uppercase animate-pulse">
        Initializing Spatial Grid...
      </p>
    </div>
  )
});

export default function MapView() {
  return (
    <div className="w-full h-full bg-[#0B1C2C] relative z-0">
      <MapWithNoSSR />
      {/* Live tracking overlay indicator */}
      <div className="absolute top-4 right-4 z-10 glass-panel px-4 py-2 rounded-lg bg-black/60 backdrop-blur-md border border-cyanGlow/30 shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse border border-green-800"></span>
        <span className="text-[10px] text-white font-bold uppercase tracking-widest">
          Live Grid Connected
        </span>
      </div>
    </div>
  );
}
