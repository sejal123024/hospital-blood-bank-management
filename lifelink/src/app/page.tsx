"use client";

import { useState } from "react";
import LandingHero from "@/components/layout/LandingHero";
import AuthModal from "@/components/auth/AuthModal";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLoginSuccess = () => {
    setShowAuthModal(false);
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <main className="relative min-h-screen">
      <LandingHero onOpenAuth={openAuth} />
      
      {showAuthModal && (
        <AuthModal 
          mode={authMode} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </main>
  );
}
