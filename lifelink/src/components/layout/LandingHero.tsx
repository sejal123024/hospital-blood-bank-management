"use client";

import { motion } from "framer-motion";

interface LandingHeroProps {
  onOpenAuth: (mode: "login" | "signup") => void;
}

export default function LandingHero({ onOpenAuth }: LandingHeroProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center text-center px-4">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 min-w-full min-h-full object-cover z-0"
      >
        <source src="/bg-video-3.mp4" type="video/mp4" />
      </video>

      {/* Dark Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-deepBlue/50 to-deepBlue z-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Logo / Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-cyanGlow/20 border border-cyanGlow flex items-center justify-center glow-border">
              <span className="text-cyanGlow font-bold text-2xl">L</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight glow-text">
              LifeLink
            </h1>
          </div>

          <p className="text-xl md:text-3xl font-medium text-cyanGlow mb-6 tracking-wide">
            Connecting You to Life-Saving Care Instantly
          </p>
          
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            The advanced healthcare emergency platform that seamlessly aggregates 
            available hospital beds, ICU capacity, and blood banks to ensure immediate 
            and precise care when every second counts.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenAuth("login")}
              className="px-8 py-4 bg-cyanGlow/20 border border-cyanGlow text-white font-semibold rounded-lg w-full sm:w-auto hover:bg-cyanGlow/30 transition-all glow-border"
            >
              Login securely
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenAuth("signup")}
              className="px-8 py-4 bg-cyanGlow text-deepBlue font-bold rounded-lg w-full sm:w-auto hover:bg-white transition-all shadow-[0_0_15px_rgba(0,229,255,0.6)]"
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Pulse indicators at the bottom */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="absolute bottom-10 flex gap-8 z-10"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-3 h-3 bg-cyanGlow rounded-full animate-ping absolute"></div>
          <div className="w-3 h-3 bg-cyanGlow rounded-full relative z-10"></div>
          <p className="text-xs text-cyanGlow mt-2 uppercase tracking-widest font-semibold">Live Data</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-3 h-3 bg-accentRed rounded-full animate-ping absolute" style={{ animationDelay: "1s" }}></div>
          <div className="w-3 h-3 bg-accentRed rounded-full relative z-10"></div>
          <p className="text-xs text-accentRed mt-2 uppercase tracking-widest font-semibold">Active Alerts</p>
        </div>
      </motion.div>
    </div>
  );
}
