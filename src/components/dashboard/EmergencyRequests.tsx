"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, MapPin, Truck, CheckCircle2 } from "lucide-react";

export default function EmergencyRequests() {
  const requests = [
    {
      id: "REQ-901",
      type: "Mass Casualty Incident",
      location: "Interstate 405 NB",
      time: "2 minutes ago",
      priority: "CRITICAL",
      status: "Dispatching",
      needs: ["4 ICU Beds", "O- Blood (10 units)", "Trauma Surgeons"],
      color: "border-accentRed text-accentRed bg-accentRed/10",
    },
    {
      id: "REQ-902",
      type: "Cardiac Arrest",
      location: "1422 West Ave, Downtown",
      time: "8 minutes ago",
      priority: "HIGH",
      status: "In Transit",
      needs: ["Cath Lab", "Cardiologist"],
      color: "border-orange-500 text-orange-500 bg-orange-500/10",
    },
    {
      id: "REQ-903",
      type: "Severe Burn Victim",
      location: "Industrial District, Sector 4",
      time: "15 minutes ago",
      priority: "HIGH",
      status: "Arrived",
      needs: ["Burn Unit", "Plasma"],
      color: "border-orange-500 text-orange-500 bg-orange-500/10",
    },
    {
      id: "REQ-904",
      type: "Maternity Complication",
      location: "Northside Clinic Transfer",
      time: "32 minutes ago",
      priority: "MEDIUM",
      status: "Resolved",
      needs: ["NICU Bed", "Obstetrician"],
      color: "border-cyanGlow text-cyanGlow bg-cyanGlow/10",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full relative z-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <AlertTriangle className="text-accentRed animate-pulse" size={32} />
            Active Emergency Requests
          </h2>
          <p className="text-gray-400">Live feed of regional emergency service requests and dispatches.</p>
        </div>
        <button className="px-6 py-3 bg-accentRed/20 border border-accentRed text-accentRed font-bold rounded-lg hover:bg-accentRed hover:text-white transition-all shadow-[0_0_15px_rgba(255,59,59,0.3)]">
          Declare S.O.S
        </button>
      </div>

      <div className="space-y-6">
        {requests.map((req, idx) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-panel p-6 rounded-xl border-l-4 ${req.color.split(' ')[0]} border-t border-r border-b border-glass-border relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/10 transition-colors"></div>

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${req.color}`}>
                    {req.priority}
                  </span>
                  <span className="text-gray-400 text-sm font-mono">{req.id}</span>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <Clock size={14} /> {req.time}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white tracking-wide mb-2">{req.type}</h3>
                
                <p className="text-gray-300 flex items-center gap-2 mb-4">
                  <MapPin size={16} className="text-cyanGlow" /> {req.location}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-400 mr-2 flex items-center">Required:</span>
                  {req.needs.map((need, nId) => (
                    <span key={nId} className="px-3 py-1 bg-black/40 border border-glass-border rounded-full text-xs text-white">
                      {need}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end justify-center min-w-[200px] border-t md:border-t-0 md:border-l border-glass-border pt-4 md:pt-0 md:pl-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${req.status === 'Resolved' ? 'bg-cyanGlow' : req.status === 'Dispatching' ? 'bg-accentRed animate-ping' : 'bg-orange-500'}`}></div>
                  <span className="text-white font-semibold uppercase tracking-wider">{req.status}</span>
                </div>
                
                {req.status !== 'Resolved' ? (
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-cyanGlow/20 border border-cyanGlow hover:bg-cyanGlow hover:text-deepBlue text-cyanGlow text-sm font-bold rounded-lg transition-all glow-border">
                    <Truck size={18} /> Coordinate Response
                  </button>
                ) : (
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-black/40 border border-glass-border text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed">
                    <CheckCircle2 size={18} /> Closed
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
