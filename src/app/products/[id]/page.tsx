import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ShoppingCart, ArrowLeft, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { Button } from '../../../components/ui/Button';
import { useCartStore } from '../../../store/useCartStore';
import { formatPrice } from '../../../lib/utils';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        setProduct({
          id,
          title: 'Premium Minimalist Watch',
          price: 199.99,
          description: 'A timeless piece crafted with precision and elegance. Perfect for any occasion, this watch combines classic design with modern functionality. Every detail has been considered, from the brushed steel casing to the hand-stitched leather strap.',
          category: 'Accessories',
          images: [`https://picsum.photos/seed/${id}/1200/1600`],
          stock: 15
        });
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.images?.[0] || `https://picsum.photos/seed/${product.id}/800/1200`
    });
    toast.success('Added to your collection');
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Large Image - Editorial Style */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[3/4] rounded-sm overflow-hidden bg-gray-50"
          >
            <img 
              src={product.images?.[0]} 
              alt={product.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="grid grid-cols-2 gap-8">
            <div className="aspect-[3/4] rounded-sm overflow-hidden bg-gray-50">
              <img src={`https://picsum.photos/seed/${id}-1/800/1200`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="aspect-[3/4] rounded-sm overflow-hidden bg-gray-50">
              <img src={`https://picsum.photos/seed/${id}-2/800/1200`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>

        {/* Product Info - Sticky Sidebar */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">{product.category}</span>
              <h1 className="text-5xl font-display uppercase tracking-tighter">{product.title}</h1>
            </div>
            <p className="text-2xl serif italic">{formatPrice(product.price)}</p>
          </div>

          <div className="space-y-6 text-gray-600 serif text-lg leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="space-y-8 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-6 py-3 hover:bg-gray-50">-</button>
                <span className="px-6 py-3 font-bold text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-6 py-3 hover:bg-gray-50">+</button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1 rounded-none h-14 uppercase text-xs tracking-widest font-bold">
                Add to Cart
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <Truck size={14} /> Free Express Shipping
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <RotateCcw size={14} /> 30-Day Returns
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <ShieldCheck size={14} /> Lifetime Warranty
              </div>
            </div>
          </div>

          <div className="pt-12 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest">Details</h4>
            <ul className="space-y-3 text-sm text-gray-500 serif italic">
              <li>• Sustainably sourced materials</li>
              <li>• Handcrafted in our local studio</li>
              <li>• Limited edition release</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
