"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setLoading(false);
          return;
        }

        const productDoc = querySnapshot.docs[0];
        const productData = { id: productDoc.id, ...productDoc.data() } as any;

        // Fetch variants
        const variantsSnapshot = await getDocs(collection(db, 'products', productDoc.id, 'variants'));
        const variants = variantsSnapshot.docs.map(v => ({ id: v.id, ...v.data() }));

        // Fetch category
        const categoryDoc = await getDocs(query(collection(db, 'categories'), where('id', '==', productData.categoryId)));
        const category = categoryDoc.docs[0]?.data() || { name: 'Uncategorized' };

        const fullProduct = { ...productData, variants, category };
        setProduct(fullProduct);
        setSelectedVariant(variants[0]);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToBag = () => {
    addItem({
      variantId: selectedVariant.id,
      name: product.name,
      price: selectedVariant.price || product.basePrice,
      quantity: quantity,
      image: `https://picsum.photos/seed/${product.slug}/800/1200`,
    });
    toast.success('Added to bag');
  };

  if (loading) return <div className="min-h-screen pt-32 px-24 animate-pulse bg-gray-50" />;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="pt-32 pb-24 px-6 lg:px-24">
      <a href="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-12 hover:opacity-60 transition-opacity">
        <ArrowLeft size={14} /> Back to Shop
      </a>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Image Gallery */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[3/4] bg-gray-50 overflow-hidden"
          >
            <img 
              src={`https://picsum.photos/seed/${product.slug}/1200/1600`} 
              className="w-full h-full object-cover grayscale"
              alt={product.name}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">{product.category.name} / Archival</span>
            <h1 className="text-6xl font-display uppercase tracking-tighter leading-none">{product.name}</h1>
            <p className="text-2xl font-bold tracking-tighter">${(selectedVariant?.price || product.basePrice).toFixed(2)}</p>
          </div>

          <div className="space-y-8">
            <p className="text-sm serif italic leading-relaxed opacity-70 max-w-md">
              {product.description}
            </p>

            {/* Variants */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest">Select Variant</h4>
              <div className="flex flex-wrap gap-4">
                {product.variants.map((v: any) => (
                  <button 
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      selectedVariant?.id === v.id ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest">Quantity</h4>
              <div className="flex items-center gap-6 border border-gray-200 w-fit px-4 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button>
                <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button>
              </div>
            </div>

            <button 
              onClick={handleAddToBag}
              className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors flex items-center justify-center gap-4"
            >
              <ShoppingBag size={16} /> Add to Bag
            </button>
          </div>

          {/* Details Accordion (Simplified) */}
          <div className="pt-12 border-t border-gray-100 space-y-6">
            <div className="flex justify-between items-center cursor-pointer group">
              <span className="text-[10px] font-bold uppercase tracking-widest">Composition & Care</span>
              <Plus size={14} className="group-hover:rotate-90 transition-transform" />
            </div>
            <div className="flex justify-between items-center cursor-pointer group">
              <span className="text-[10px] font-bold uppercase tracking-widest">Shipping & Returns</span>
              <Plus size={14} className="group-hover:rotate-90 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
