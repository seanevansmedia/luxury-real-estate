"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { Search, ChevronDown, ArrowRight, MapPin, Check, SlidersHorizontal, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PropertyImage from "@/components/PropertyImage";

// Options
const PROPERTY_TYPES = ["Estate", "Penthouse", "Villa", "Modern", "Alpine", "Historic", "Skyline", "Desert"];
const PRICE_RANGES = [
  { label: "$1M+", value: "1000000" },
  { label: "$2M+", value: "2000000" },
  { label: "$5M+", value: "5000000" },
  { label: "$10M+", value: "10000000" },
  { label: "$20M+", value: "20000000" },
  { label: "$50M+", value: "50000000" },
];
const NUMBER_OPTIONS = ["1+", "2+", "3+", "4+", "5+"];

export default function SearchWidget() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Added
  const supabase = createClient();
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Search States
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedBeds, setSelectedBeds] = useState(""); 
  const [selectedBaths, setSelectedBaths] = useState(""); 
  const [activeTab, setActiveTab] = useState("buy");
  
  // Sync tab with URL parameter
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode && (mode === "buy" || mode === "rent" || mode === "sold")) {
      setActiveTab(mode);
    }
  }, [searchParams]);

  // Mobile Toggle State
  const [showAdvancedMobile, setShowAdvancedMobile] = useState(false);

  // Dropdown Visibility
  const [activeMenu, setActiveMenu] = useState<"none" | "location" | "type" | "price" | "beds" | "baths">("none");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setActiveMenu("none");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autosuggest Logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (locationQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      const { data } = await supabase
        .from('properties')
        .select('location')
        .ilike('location', `%${locationQuery}%`)
        .limit(5);

      if (data) {
          const uniqueLocations = Array.from(new Set(data.map(item => item.location))).map(loc => ({ location: loc }));
          setSuggestions(uniqueLocations);
      }
    };
    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [locationQuery]);

  // Execute Search
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (activeTab) params.set("mode", activeTab);
    if (locationQuery) params.set("q", locationQuery.trim());
    if (selectedType) params.set("type", selectedType);
    if (selectedPrice) params.set("minPrice", selectedPrice);
    if (selectedBeds) params.set("beds", selectedBeds);   
    if (selectedBaths) params.set("baths", selectedBaths); 
    
    setActiveMenu("none");
    router.push(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div ref={searchRef} className="bg-black/40 backdrop-blur-xl border border-white/20 p-1 rounded-sm shadow-2xl animate-in fade-in zoom-in-95 duration-1000 delay-300 relative z-[1000] w-full max-w-5xl !overflow-visible">
        
        {/* Tabs */}
        <div className="flex gap-4 mb-2 px-4 pt-2 border-b border-white/10 pb-2">
          {['buy', 'rent', 'sold'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 cursor-pointer ${activeTab === tab ? 'text-white border-[#D4AF37]' : 'text-gray-500 border-transparent hover:text-white'}`}
              >
                  {tab}
              </button>
          ))}
        </div>

        {/* Inputs Container */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-px bg-white/10 border border-white/10 !overflow-visible">
          
          {/* 1. LOCATION (Order 1) - Z-Index 60 */}
          <div className="md:col-span-4 relative order-1 z-[60]">
              <div 
                className="bg-black/60 flex items-center px-4 py-4 hover:bg-black/80 transition-colors cursor-text backdrop-blur-md h-full"
                onClick={() => setActiveMenu("location")}
              >
                <Search size={18} className="text-gray-400 mr-3 group-hover:text-white" />
                <div className="w-full">
                    <label className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1 block">Location</label>
                    <input 
                        placeholder="City, Zip..." 
                        className="bg-transparent w-full outline-none text-white placeholder-gray-600 text-sm font-medium"
                        value={locationQuery}
                        onChange={(e) => { setLocationQuery(e.target.value); setActiveMenu("location"); }}
                        onFocus={() => setActiveMenu("location")}
                        onKeyDown={handleKeyDown}
                    />
                </div>
              </div>

              {activeMenu === "location" && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-px bg-[#111] border border-white/10 shadow-2xl z-[100] max-h-[400px] overflow-y-auto">
                    <p className="px-4 py-2 text-[10px] font-bold uppercase text-[#D4AF37] tracking-widest bg-black/50 sticky top-0">Suggestions</p>
                    {suggestions.map((s, i) => (
                      <div 
                          key={i}
                          onClick={() => {
                            setLocationQuery(s.location); 
                            setActiveMenu("none");
                          }}
                          className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 text-sm font-medium text-gray-300 border-b border-white/5 last:border-0"
                      >
                          <MapPin size={14} className="text-[#D4AF37]" /> {s.location}
                      </div>
                    ))}
                </div>
              )}
          </div>

          {/* 2. PRICE (Order 2) - Desktop Only - Z-Index 50 */}
          <div className="hidden md:block md:col-span-2 relative order-2 z-[50]">
              <div 
                className="bg-black/60 flex items-center justify-between px-4 py-4 hover:bg-black/80 transition-colors cursor-pointer border-l border-white/5 backdrop-blur-md h-full"
                onClick={() => setActiveMenu(activeMenu === "price" ? "none" : "price")}
              >
                <div className="overflow-hidden">
                    <label className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1 block">Price</label>
                    <span className="text-sm font-medium text-white block truncate">
                      {PRICE_RANGES.find(p => p.value === selectedPrice)?.label || "Any"}
                    </span>
                </div>
                <ChevronDown size={14} className="text-gray-500 shrink-0 ml-2" />
              </div>

              {activeMenu === "price" && (
                <div className="absolute top-full left-0 w-full mt-px bg-[#111] border border-white/10 shadow-2xl z-[100] max-h-[400px] overflow-y-auto">
                    <div onClick={() => { setSelectedPrice(""); setActiveMenu("none"); }} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">Any Price</div>
                    {PRICE_RANGES.map(price => (
                      <div 
                          key={price.value} 
                          onClick={() => { setSelectedPrice(price.value); setActiveMenu("none"); }} 
                          className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 flex justify-between items-center cursor-pointer last:border-0"
                      >
                          {price.label}
                          {selectedPrice === price.value && <Check size={14} className="text-[#D4AF37]"/>}
                      </div>
                    ))}
                </div>
              )}
          </div>

          {/* 🟢 MOBILE TOGGLE: More Filters (Order 3) - Z-Index 40 */}
          <div className="md:hidden order-3 border-t border-white/10 relative z-[40]">
             <button 
                onClick={() => setShowAdvancedMobile(!showAdvancedMobile)}
                className="w-full bg-black/60 text-gray-400 font-bold uppercase text-[10px] py-4 flex items-center justify-center gap-2 hover:text-white hover:bg-black/80 transition-colors"
             >
                {showAdvancedMobile ? <X size={12} /> : <SlidersHorizontal size={12} />} 
                {showAdvancedMobile ? "Close Filters" : "More Filters"}
             </button>
          </div>

          {/* 🟢 ANIMATED CONTAINER (Order 4) - Z-Index 30 */}
          <div 
             className={`
                order-4 md:col-span-6 md:grid md:grid-cols-6 md:gap-px relative z-[30]
                transition-all duration-500 ease-in-out
                md:!transition-none md:!max-h-none md:!opacity-100 md:!overflow-visible
                ${showAdvancedMobile ? 'max-h-[1200px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden md:overflow-visible'}
             `}
          >
              
              {/* PRICE (Mobile Only) */}
              <div className={`md:hidden relative border-t border-white/10 ${activeMenu === "price" ? "z-50" : "z-20"}`}>
                  <div 
                    className="bg-black/60 flex items-center justify-between px-4 py-4 hover:bg-black/80 transition-colors cursor-pointer backdrop-blur-md h-full"
                    onClick={() => setActiveMenu(activeMenu === "price" ? "none" : "price")}
                  >
                    <div className="overflow-hidden">
                        <label className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1 block">Price</label>
                        <span className="text-sm font-medium text-white block truncate">
                          {PRICE_RANGES.find(p => p.value === selectedPrice)?.label || "Any"}
                        </span>
                    </div>
                    <ChevronDown size={14} className="text-gray-500 shrink-0 ml-2" />
                  </div>

                  {activeMenu === "price" && (
                    <div className="absolute top-full left-0 w-full mt-px bg-[#111] border border-white/10 shadow-2xl z-[100] max-h-[400px] overflow-y-auto">
                        <div onClick={() => { setSelectedPrice(""); setActiveMenu("none"); }} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">Any Price</div>
                        {PRICE_RANGES.map(price => (
                          <div 
                              key={price.value} 
                              onClick={() => { setSelectedPrice(price.value); setActiveMenu("none"); }} 
                              className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 flex justify-between items-center cursor-pointer last:border-0"
                          >
                              {price.label}
                              {selectedPrice === price.value && <Check size={14} className="text-[#D4AF37]"/>}
                          </div>
                        ))}
                    </div>
                  )}
              </div>

              {/* 3. TYPE (Col-2) */}
              <div className={`md:col-span-2 relative border-t border-white/10 md:border-t-0 ${activeMenu === "type" ? "z-50" : "z-10"}`}>
                  <div 
                    className="bg-black/60 flex items-center justify-between px-4 py-4 hover:bg-black/80 transition-colors cursor-pointer md:border-l border-white/5 backdrop-blur-md h-full"
                    onClick={() => setActiveMenu(activeMenu === "type" ? "none" : "type")}
                  >
                    <div className="overflow-hidden">
                        <label className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1 block">Type</label>
                        <span className="text-sm font-medium text-white block truncate">{selectedType || "All"}</span>
                    </div>
                    <ChevronDown size={14} className="text-gray-500 shrink-0 ml-2" />
                  </div>

                  {activeMenu === "type" && (
                    <div className="absolute top-full left-0 w-full mt-px bg-[#111] border border-white/10 shadow-2xl z-[100] max-h-[400px] overflow-y-auto">
                        <div onClick={() => { setSelectedType(""); setActiveMenu("none"); }} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">All Types</div>
                        {PROPERTY_TYPES.map(type => (
                          <div 
                              key={type} 
                              onClick={() => { setSelectedType(type); setActiveMenu("none"); }} 
                              className="px-6 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 flex justify-between items-center cursor-pointer last:border-0"
                          >
                              {type} {selectedType === type && <Check size={14} className="text-[#D4AF37]"/>}
                          </div>
                        ))}
                    </div>
                  )}
              </div>

              {/* 4. BEDS (Col-2) */}
              <div className={`md:col-span-2 relative border-t border-white/10 md:border-t-0 ${activeMenu === "beds" ? "z-50" : "z-0"}`}>
                  <div 
                    className="bg-black/60 flex items-center justify-between px-3 py-4 hover:bg-black/80 transition-colors cursor-pointer md:border-l border-white/5 backdrop-blur-md h-full"
                    onClick={() => setActiveMenu(activeMenu === "beds" ? "none" : "beds")}
                  >
                    <div>
                        <label className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1 block">Beds</label>
                        <span className="text-sm font-medium text-white">{selectedBeds || "Any"}</span>
                    </div>
                    <ChevronDown size={14} className="text-gray-500 shrink-0" />
                  </div>

                  {activeMenu === "beds" && (
                    <div className="absolute top-full left-0 w-full mt-px bg-[#111] border border-white/10 shadow-2xl z-[100] max-h-[400px] overflow-y-auto">
                        <div onClick={() => { setSelectedBeds(""); setActiveMenu("none"); }} className="px-4 py-3 text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">Any</div>
                        {NUMBER_OPTIONS.map(num => (
                          <div 
                              key={num} 
                              onClick={() => { setSelectedBeds(num); setActiveMenu("none"); }} 
                              className="px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 flex justify-between items-center cursor-pointer last:border-0"
                          >
                              {num} {selectedBeds === num && <Check size={14} className="text-[#D4AF37]"/>}
                          </div>
                        ))}
                    </div>
                  )}
              </div>

              {/* 5. BATHS (Col-2) */}
              <div className={`md:col-span-2 relative border-t border-white/10 md:border-t-0 ${activeMenu === "baths" ? "z-50" : "z-0"}`}>
                  <div 
                    className="bg-black/60 flex items-center justify-between px-3 py-4 hover:bg-black/80 transition-colors cursor-pointer md:border-l border-white/5 backdrop-blur-md h-full"
                    onClick={() => setActiveMenu(activeMenu === "baths" ? "none" : "baths")}
                  >
                    <div>
                        <label className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1 block">Bath</label>
                        <span className="text-sm font-medium text-white">{selectedBaths || "Any"}</span>
                    </div>
                    <ChevronDown size={14} className="text-gray-500 shrink-0" />
                  </div>

                  {activeMenu === "baths" && (
                    <div className="absolute top-full left-0 w-full mt-px bg-[#111] border border-white/10 shadow-2xl z-[100] max-h-[400px] overflow-y-auto">
                        <div onClick={() => { setSelectedBaths(""); setActiveMenu("none"); }} className="px-4 py-3 text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">Any</div>
                        {NUMBER_OPTIONS.map(num => (
                          <div 
                              key={num} 
                              onClick={() => { setSelectedBaths(num); setActiveMenu("none"); }} 
                              className="px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 flex justify-between items-center cursor-pointer last:border-0"
                          >
                              {num} {selectedBaths === num && <Check size={14} className="text-[#D4AF37]"/>}
                          </div>
                        ))}
                    </div>
                  )}
              </div>
          </div>

          {/* 6. SEARCH BUTTON (Order 5) - Z-Index 10 */}
          <div className="order-5 md:col-span-12 border-t border-white/10 md:border-t-0 md:mt-2 relative z-[10]">
             <button 
                onClick={handleSearch}
                className="w-full h-full min-h-[60px] bg-white/5 backdrop-blur-2xl border-t border-l border-white/30 border-b border-r border-black/30 text-white hover:bg-[#D4AF37]/30 hover:border-[#D4AF37]/50 transition-all duration-300 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer py-4"
             >
                Search Portfolio <ArrowRight size={14}/>
             </button>
          </div>
        </div>
        
    </div>
  );
}