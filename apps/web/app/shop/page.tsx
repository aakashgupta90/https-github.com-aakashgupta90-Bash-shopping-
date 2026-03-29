"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { apiFetch } from '@/lib/api';
import { ShoppingBag, Filter, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    apiFetch('/products')
      .then(setProducts)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToBag = (product: any) => {
    const variant = product.variants[0]; // Default to first variant
    addItem({
      variantId: variant.id,
      name: product.name,
      price: variant.price || product.basePrice,
      quantity: 1,
      image: `https://picsum.photos/seed/${product.slug}/800/1200`,
    });
    toast.success(`${product.name} added to bag`);
  };

  return (
    <div className="pt-32 px-6 lg:px-24 pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">All Collections</span>
          <h1 className="text-6xl font-display uppercase tracking-tighter">The Shop</h1>
        </div>
        
        <div className="flex items-center gap-8 border-b border-gray-100 pb-4 w-full lg:w-auto">
          <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            Filter <Filter size={12} />
          </button>
          <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            Sort By <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <a href={`/shop/${product.slug}`} className="block aspect-[3/4] bg-gray-50 mb-6 overflow-hidden relative">
                <img 
                  src={`https://picsum.photos/seed/${product.slug}/800/1200`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  alt={product.name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </a>
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-widest">
                    <a href={`/shop/${product.slug}`} className="hover:opacity-60 transition-opacity">{product.name}</a>
                  </h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{product.category.name}</p>
                </div>
                <div className="text-right space-y-2">
                  <span className="text-xs font-bold tracking-widest">${product.basePrice.toFixed(2)}</span>
                  <button 
                    onClick={() => handleAddToBag(product)}
                    className="block text-[8px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
