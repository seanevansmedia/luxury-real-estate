"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react"; 
import { useSaved } from "@/context/SavedContext"; 

const NavLink = ({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) => (
  <Link 
    href={href} 
    onClick={onClick}
    className="relative group py-2 whitespace-nowrap" // Added whitespace-nowrap to prevent text wrapping
  >
    <span className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-300 group-hover:text-white transition-colors duration-300">
      {label}
    </span>
    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
  </Link>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { savedIds } = useSaved();
  const [mounted, setMounted] = useState(false); 
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav 
        className={`
          fixed top-0 w-full z-50 border-b transition-all duration-500
          ${isScrolled 
            ? 'bg-black border-[#D4AF37]/50 py-4 shadow-[0_4px_30px_-5px_rgba(212,175,55,0.4)]' 
            : 'bg-black/80 border-[#D4AF37]/20 py-6 backdrop-blur-sm shadow-[0_4px_20px_-10px_rgba(212,175,55,0.2)]'
          }
        `}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* 1. Left: Logo */}
          <div className="flex-shrink-0 z-50">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-3 h-3 bg-[#D4AF37] rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
              OBSIDIAN
            </Link>
          </div>
            
          {/* 2. Center: Desktop Links */}
          {/* FIX: Changed lg:flex to xl:flex and added responsive gap */}
          <div className="hidden xl:flex absolute left-1/2 transform -translate-x-1/2 gap-8 2xl:gap-14 z-10">
            <NavLink href="/search?mode=buy" label="Buy" />
            <NavLink href="/sell" label="Sell" />
            <NavLink href="/search?mode=rent" label="Rent" />
            <NavLink href="/agents" label="Agents" />
            <NavLink href="/about" label="About Us" />
            <NavLink href="/contact" label="Contact" />
          </div>

          {/* 3. Right: Actions */}
          <div className="flex items-center gap-6 md:gap-8 z-50">
             
             {/* Saved Icon */}
             {mounted && (
               <Link href="/saved" className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="relative">
                      <Heart size={20} className="text-white group-hover:text-[#D4AF37] transition-colors" />
                      {savedIds.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-black">
                              {savedIds.length}
                          </span>
                      )}
                  </div>
                  {/* FIX: Changed lg:block to xl:block to match the menu visibility */}
                  <span className="hidden xl:block text-xs font-bold uppercase tracking-widest text-white group-hover:text-[#D4AF37] transition-colors">
                      Saved
                  </span>
               </Link>
             )}

             {/* Hamburger (Mobile) */}
             {/* FIX: Changed lg:hidden to xl:hidden */}
             <button 
                className="xl:hidden text-white hover:text-[#D4AF37] transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
             </button>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`
          fixed inset-0 bg-black z-40 flex flex-col justify-center items-center transition-all duration-500
          ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
      >
        <div className="flex flex-col gap-8 text-center">
            <Link href="/search?mode=buy" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif text-white hover:text-[#D4AF37]">Buy</Link>
            <Link href="/sell" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif text-white hover:text-[#D4AF37]">Sell</Link>
            <Link href="/search?mode=rent" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif text-white hover:text-[#D4AF37]">Rent</Link>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto my-4 opacity-50"></div>
            <Link href="/agents" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-sans uppercase tracking-[0.2em] text-neutral-400">Agents</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-sans uppercase tracking-[0.2em] text-neutral-400">About</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-sans uppercase tracking-[0.2em] text-neutral-400">Contact</Link>
        </div>
      </div>
    </>
  );
}