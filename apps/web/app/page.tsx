"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Search, Menu } from 'lucide-react';

import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function HomePage() {
  const { user, logout } = useAuthStore();
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/products?limit=3')
      .then(setFeatured)
      .catch(console.error);
  }, []);

  const handleAddQuick = (product: any) => {
    addItem({
      variantId: product.variants[0].id,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
      image: `https://picsum.photos/seed/${product.slug}/800/1200`,
    });
    toast.success('Added to bag');
  };
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button className="lg:hidden"><Menu size={20} /></button>
            <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
              <a href="/shop" className="hover:text-gray-500 transition-colors">Shop</a>
              <a href="/collections" className="hover:text-gray-500 transition-colors">Collections</a>
              <a href="/admin/dashboard" className="hover:text-gray-500 transition-colors">Admin</a>
              <a href="/about" className="hover:text-gray-500 transition-colors">About</a>
            </div>
          </div>
          
          <h1 className="text-2xl font-display uppercase tracking-tighter absolute left-1/2 -translate-x-1/2">BASH</h1>
          
          <div className="flex items-center gap-6">
            <button className="hover:text-gray-500 transition-colors"><Search size={20} /></button>
            {user ? (
              <div className="flex items-center gap-6">
                <a href="/profile" className="text-[10px] font-bold uppercase tracking-widest hover:text-gray-500">{user.name}</a>
                <button onClick={logout} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">Logout</button>
              </div>
            ) : (
              <a href="/login" className="text-[10px] font-bold uppercase tracking-widest hover:text-gray-500">Login</a>
            )}
            <button className="hover:text-gray-500 transition-colors relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 h-screen flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          <img 
            src="https://picsum.photos/seed/hero/1920/1080" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Hero"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-12 lg:p-24 text-white">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <span className="text-xs font-bold uppercase tracking-[0.4em] mb-6 block">New Arrival / SS26</span>
              <h2 className="text-7xl lg:text-9xl font-display uppercase tracking-tighter leading-[0.85] mb-8">
                The Art of <br /> Essentialism
              </h2>
              <p className="text-xl serif italic max-w-md opacity-90 mb-10">
                A curated collection of archival pieces designed for the modern minimalist.
              </p>
              <button className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest border-b border-white pb-2 hover:gap-6 transition-all">
                Explore Collection <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-6 lg:px-24">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Curated Selection</span>
            <h3 className="text-5xl font-display uppercase tracking-tighter">The Essentials</h3>
          </div>
          <a href="/shop" className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-8">View All</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {featured.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <a href={`/shop/${product.slug}`} className="aspect-[3/4] bg-gray-100 mb-6 overflow-hidden relative block">
                <img 
                  src={`https://picsum.photos/seed/${product.slug}/800/1200`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  alt={product.name}
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddQuick(product);
                  }}
                  className="absolute bottom-6 left-6 right-6 bg-white py-4 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Add to Bag
                </button>
              </a>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-1">{product.name}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{product.category.name}</p>
                </div>
                <span className="text-xs font-bold tracking-widest">${product.basePrice.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-24 px-6 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-4xl font-display uppercase tracking-tighter">BASH</h2>
            <p className="text-sm serif italic opacity-60 max-w-xs leading-relaxed">
              We believe in the power of less. Our pieces are designed to last a lifetime, transcending trends and seasons.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Navigation</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><a href="/shop" className="hover:opacity-60 transition-opacity">Shop</a></li>
              <li><a href="/collections" className="hover:opacity-60 transition-opacity">Collections</a></li>
              <li><a href="/journal" className="hover:opacity-60 transition-opacity">Journal</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Contact</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:opacity-60 transition-opacity">Instagram</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Twitter</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Email</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/10 flex flex-col lg:flex-row justify-between gap-8 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
          <p>© 2026 BASH Collective. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
