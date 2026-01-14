import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; 
import { 
  ArrowLeft, MapPin, Bed, Bath, Square, 
  Check, Calendar, Phone, Mail, Share2, Heart, User
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Helper to fetch data
async function getProperty(id: string) {
  const supabase = await createClient();
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
  
  return property;
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return notFound();
  }

  return (
    <main className="bg-[#050505] text-white min-h-screen font-sans selection:bg-[#D4AF37] selection:text-black">
      <Navbar />

      {/* ================= HEADER IMAGE ================= */}
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        <Image 
          src={property.image_url} 
          alt={property.title} 
          fill 
          className="object-cover"
          priority 
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30"></div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10 pointer-events-none">
          
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pointer-events-auto">
            
            {/* Left Content (Title/Location) */}
            <div className="w-full">
              
              {/* 🟢 MOVED: Back to Search (Aligned vertically above tags) */}
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white hover:text-[#D4AF37] transition-all bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-black hover:border-[#D4AF37] mb-6"
              >
                <ArrowLeft size={14} /> Back to Search
              </Link>

              <div className="flex gap-4 mb-4">
                <span className="bg-[#D4AF37] text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {property.tag || 'Exclusive'}
                </span>
                <span className="bg-white/10 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/20">
                  Active Listing
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-serif mb-2 drop-shadow-lg leading-tight">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-300 text-sm uppercase tracking-wider font-medium">
                <MapPin size={16} className="text-[#D4AF37]" /> {property.location}
              </div>
            </div>
            
            {/* Right Content (Price) */}
            <div className="text-left md:text-right pb-2 md:pb-0 w-full md:w-auto"> 
              <p className="text-4xl md:text-5xl font-light text-[#D4AF37] drop-shadow-lg">{property.price}</p>
              <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">
                {property.type || 'Luxury Residence'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Specs Bar */}
            <div className="flex flex-wrap gap-8 md:gap-16 border-y border-white/10 py-8">
              <div className="flex items-center gap-3">
                <Bed className="text-[#D4AF37]" size={24} />
                <div>
                  <span className="block text-2xl font-light">{property.beds}</span>
                  <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Bedrooms</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bath className="text-[#D4AF37]" size={24} />
                <div>
                  <span className="block text-2xl font-light">{property.baths}</span>
                  <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Bathrooms</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Square className="text-[#D4AF37]" size={24} />
                <div>
                  <span className="block text-2xl font-light">{property.sqft?.toLocaleString()}</span>
                  <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Sq Ft</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-[#D4AF37]" size={24} />
                <div>
                  <span className="block text-2xl font-light">2024</span>
                  <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Year Built</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-2xl font-serif mb-6 text-[#D4AF37]">The Residence</h3>
              <div className="space-y-6 text-gray-400 leading-relaxed font-light text-lg">
                <p>
                  Experience the pinnacle of luxury living in this architectural masterpiece. 
                  Every detail has been meticulously curated to offer an unparalleled lifestyle of elegance and comfort.
                </p>
              </div>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="text-xl font-serif mb-6 text-white">Features & Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Wine Cellar', 'Infinity Pool', 'Home Theater', 'Smart Home', 'Gated Entry', 'Guest House'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-gray-400">
                    <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center">
                      <Check size={10} className="text-[#D4AF37]" />
                    </div>
                    <span className="text-sm tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32 space-y-6">
              
              {/* Agent Card */}
              <div className="bg-[#111] border border-white/10 p-8 rounded-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-[#D4AF37] flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1">Listing Agent</p>
                    <h4 className="text-xl font-serif">Jonathan Black</h4>
                    <p className="text-gray-500 text-xs uppercase">Obsidian Senior Partner</p>
                  </div>
                </div>
                
                <form className="space-y-4">
                  <input placeholder="Your Name" className="w-full bg-black border border-white/20 p-4 text-sm text-white outline-none focus:border-[#D4AF37]" />
                  <input placeholder="Email Address" className="w-full bg-black border border-white/20 p-4 text-sm text-white outline-none focus:border-[#D4AF37]" />
                  <button className="w-full bg-[#D4AF37] text-black font-bold uppercase text-xs tracking-widest py-4 hover:bg-white transition-colors">
                    Schedule Viewing
                  </button>
                </form>

                <div className="mt-6 flex justify-center gap-6 text-gray-500">
                   <button className="flex items-center gap-2 hover:text-white transition-colors text-xs uppercase font-bold"><Phone size={14}/> Call</button>
                   <button className="flex items-center gap-2 hover:text-white transition-colors text-xs uppercase font-bold"><Mail size={14}/> Email</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 border border-white/20 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors">
                  <Share2 size={16} /> Share
                </button>
                <button className="flex-1 border border-white/20 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors">
                  <Heart size={16} /> Save
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}