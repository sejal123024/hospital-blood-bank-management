"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, KeyRound } from "lucide-react";
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, googleProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from "@/lib/firebase";

interface AuthModalProps {
  mode: "login" | "signup";
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ mode: initialMode, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "phone" | "otp">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Email / Password Standard Methods
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Flow
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Phone Auth Methods
  const setUpRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      setUpRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      // Phone format requires country code eg +1234567890
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const confirmResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmResult);
      setMode("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Did you include your country code (e.g. +1)?");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setIsLoading(true);
    setError("");
    try {
      await confirmationResult.confirm(otp);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Invalid OTP Code.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => {
    switch (mode) {
      case "phone": return "Phone Access";
      case "otp": return "Verify Identity";
      case "login": return "Welcome Back";
      default: return "Join LifeLink";
    }
  };

  const renderSubtext = () => {
    switch (mode) {
      case "phone": return "Enter your mobile number to receive a secure code.";
      case "otp": return `Code sent to ${phoneNumber}.`;
      case "login": return "Secure access to emergency medical resources.";
      default: return "Register for immediate healthcare access.";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl p-8 glass-panel glow-border bg-black/80"
        >
          {/* Invisible Recaptcha required by Firebase Phone Auth */}
          <div id="recaptcha-container"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 glow-text">
              {renderHeader()}
            </h2>
            <p className="text-sm text-cyanGlow">
              {renderSubtext()}
            </p>
          </div>

          {/* Logic rendering based on current state mode */}
          {mode === "login" || mode === "signup" ? (
            <>
              {/* Form Standard */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="text-accentRed text-sm text-center bg-accentRed/10 border border-accentRed/20 py-2 rounded-lg font-medium">
                    {error}
                  </div>
                )}

                {mode === "signup" && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-deepBlue/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyanGlow focus:ring-1 focus:ring-cyanGlow transition-all"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-deepBlue/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyanGlow focus:ring-1 focus:ring-cyanGlow transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-deepBlue/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyanGlow focus:ring-1 focus:ring-cyanGlow transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-4 bg-cyanGlow text-deepBlue font-bold rounded-lg hover:bg-white hover:shadow-[0_0_15px_rgba(0,229,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Processing..." : mode === "login" ? "Authenticate" : "Create Account"}
                </button>
              </form>

              {/* Dividers & Alternative Auth */}
              <div className="mt-6 flex items-center justify-between">
                <span className="w-1/5 border-b border-gray-600"></span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">Or access via</span>
                <span className="w-1/5 border-b border-gray-600"></span>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="flex items-center justify-center w-full gap-3 py-3 border border-gray-600 rounded-lg text-sm text-white hover:bg-white/5 transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Google Security Key
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("phone"); setError(""); }}
                  disabled={isLoading}
                  className="flex items-center justify-center w-full gap-3 py-3 border border-gray-600 rounded-lg text-sm text-white hover:bg-white/5 transition-all disabled:opacity-50"
                >
                  <Phone size={18} />
                  Send OTP via SMS
                </button>
              </div>
            </>
          ) : mode === "phone" ? (
            /* Phone Auth Init Form */
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
               {error && (
                  <div className="text-accentRed text-sm text-center bg-accentRed/10 border border-accentRed/20 py-2 rounded-lg font-medium">
                    {error}
                  </div>
                )}
               <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-deepBlue/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyanGlow focus:ring-1 focus:ring-cyanGlow transition-all"
                  />
               </div>
               <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-4 bg-cyanGlow text-deepBlue font-bold rounded-lg hover:bg-white hover:shadow-[0_0_15px_rgba(0,229,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Validating & Sending..." : "Send Secure OTP"}
                </button>
                <div className="text-center mt-6">
                  <button type="button" onClick={() => setMode("login")} className="text-sm text-gray-400 hover:text-white transition underline underline-offset-4">Return to Login</button>
                </div>
            </form>
          ) : (
            /* Phone Auth Verify OTP Form */
            <form onSubmit={verifyOTP} className="space-y-4">
                {error && (
                  <div className="text-accentRed text-sm text-center bg-accentRed/10 border border-accentRed/20 py-2 rounded-lg font-medium">
                    {error}
                  </div>
                )}
               <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="6-digit code"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-deepBlue/50 font-mono tracking-[0.5em] text-center border border-gray-600 rounded-lg py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:border-cyanGlow focus:ring-1 focus:ring-cyanGlow transition-all"
                  />
               </div>
               <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-4 bg-cyanGlow text-deepBlue font-bold rounded-lg hover:bg-white hover:shadow-[0_0_15px_rgba(0,229,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Verifying..." : "Confirm & Access"}
                </button>
                <div className="text-center mt-6">
                  <button type="button" onClick={() => setMode("phone")} className="text-sm text-gray-400 hover:text-white transition underline underline-offset-4">Back or Edit Number</button>
                </div>
            </form>
          )}

          {/* Bottom Toggle Mode visible only on Email view */}
          {(mode === "login" || mode === "signup") && (
            <div className="mt-6 text-center text-sm text-gray-400">
              {mode === "login" ? "Don't have an ID? " : "Already registered? "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError("");
                }}
                className="text-cyanGlow hover:text-white transition-colors underline underline-offset-4"
              >
                {mode === "login" ? "Create LifeLink Profile" : "Access Console"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
