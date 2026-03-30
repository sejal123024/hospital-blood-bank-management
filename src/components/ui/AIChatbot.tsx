"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, User } from "lucide-react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; content: string }[]>([
    { role: "bot", content: "Hi! I'm your LifeLink Assistant. How can I rapidly connect you with healthcare resources today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    setInput("");

    // Mock bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Searching the nearest available facilities... I found 3 level-1 trauma centers within 5 miles. Do you need immediate ambulance dispatch?" }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-cyanGlow rounded-full flex flex-col items-center justify-center text-deepBlue shadow-[0_0_20px_rgba(0,229,255,0.6)] hover:scale-110 transition-transform cursor-pointer overflow-hidden"
          >
            {/* Pulsing rings effect */}
            <div className="absolute inset-0 rounded-full border border-deepBlue/20 animate-ping"></div>
            <Bot size={28} className="z-10" />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1 z-10">AI Help</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 w-[350px] shadow-2xl rounded-2xl overflow-hidden glass-panel border border-cyanGlow/30"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-deepBlue to-black p-4 flex justify-between items-center border-b border-cyanGlow/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyanGlow/20 border border-cyanGlow rounded-full flex items-center justify-center relative shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                  <Bot size={20} className="text-cyanGlow" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-deepBlue animate-pulse"></span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">LifeLink AI</h3>
                  <p className="text-[10px] text-cyanGlow uppercase tracking-widest">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-80 bg-black/60 backdrop-blur-md p-4 overflow-y-auto flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "bot" ? "bg-cyanGlow/10 border border-cyanGlow/50 text-cyanGlow" : "bg-white/10 border border-white/20 text-white"}`}>
                    {msg.role === "bot" ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-cyanGlow text-deepBlue font-medium rounded-tr-none shadow-[0_0_10px_rgba(0,229,255,0.3)]" 
                      : "bg-deepBlue border border-glass-border text-gray-200 rounded-tl-none shadow-lg"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Suggestions / Options */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-black/40 flex gap-2 overflow-x-auto border-t border-glass-border no-scrollbar">
                <button 
                  onClick={() => setInput("Cheapest flight from Delhi to Spain")} // Easter egg to MMT screenshot
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 text-cyanGlow transition-colors"
                >
                  Nearest ICU Beds
                </button>
                <button 
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 text-cyanGlow transition-colors"
                >
                  Book Ambulance
                </button>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-deepBlue border-t border-cyanGlow/20 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Where do you need help?"
                className="w-full bg-black/40 border border-glass-border rounded-full py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-cyanGlow/50 placeholder-gray-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-cyanGlow rounded-full flex items-center justify-center text-deepBlue disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                disabled={!input.trim()}
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
