import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), limit(4));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-32 pb-32">
      {/* Editorial Hero - Recipe 11 style */}
      <section className="h-[90vh] grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-[#f5f5f4] flex flex-col justify-center px-10 lg:px-20 space-y-10">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Spring / Summer 2026</span>
            <h1 className="text-[12vw] lg:text-[8vw] leading-[0.85] font-display uppercase tracking-tighter">
              Pure <br /> Essence
            </h1>
          </div>
          <p className="text-xl serif text-gray-600 max-w-md leading-relaxed">
            A curation of minimalist essentials designed to transcend seasons and trends. Crafted with intention.
          </p>
          <div className="flex items-center gap-8">
            <Link to="/products">
              <div className="w-24 h-24 rounded-full border border-black flex items-center justify-center text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer">
                Shop Now
              </div>
            </Link>
            <div className="hidden md:block h-px w-32 bg-black/10" />
          </div>
        </div>
        <div className="relative overflow-hidden bg-gray-200">
          <img 
            src="https://picsum.photos/seed/minimal/1200/1600" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-10 right-10 flex flex-col items-end space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white mix-blend-difference">01 / 04</span>
            <div className="w-20 h-[1px] bg-white mix-blend-difference" />
          </div>
        </div>
      </section>

      {/* Featured Collection - Recipe 4 style */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <h2 className="text-5xl serif italic font-light">The Essentials</h2>
            <p className="text-gray-400 text-sm uppercase tracking-widest">Selected pieces from our archive</p>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-black pb-2">
            View All Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="space-y-6 animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 rounded-sm" />
                <div className="h-4 bg-gray-100 w-3/4" />
                <div className="h-4 bg-gray-100 w-1/4" />
              </div>
            ))
          ) : (
            products.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/products/${product.id}`} className="group block space-y-6">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm relative">
                    <img 
                      src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/800/1200`} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg serif">{product.title}</h3>
                      <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{product.category}</p>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Immersive Section - Recipe 7 style */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 atmosphere z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        </div>
        <div className="relative z-10 text-center space-y-12 px-6 max-w-4xl">
          <h2 className="text-6xl md:text-8xl serif italic font-light leading-tight">
            "Design is not just what it looks like and feels like. Design is how it works."
          </h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-px h-20 bg-black" />
            <span className="text-xs font-bold uppercase tracking-[0.4em]">The Philosophy</span>
          </div>
        </div>
      </section>

      {/* Bento Grid - Creative Tool style */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px]">
          <div className="md:col-span-7 relative group overflow-hidden rounded-sm">
            <img src="https://picsum.photos/seed/studio/1200/800" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
            <div className="absolute top-10 left-10 text-white space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest">01 / The Studio</span>
              <h3 className="text-5xl font-display uppercase">Craftsmanship</h3>
            </div>
          </div>
          <div className="md:col-span-5 grid grid-rows-2 gap-6">
            <div className="relative group overflow-hidden rounded-sm">
              <img src="https://picsum.photos/seed/detail/800/600" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-10 left-10 text-white">
                <h3 className="text-3xl font-display uppercase">Details</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-sm bg-accent flex flex-col justify-center p-12 text-white">
              <h3 className="text-4xl font-display uppercase mb-6">Join the <br /> Collective</h3>
              <p className="text-sm serif italic mb-8 opacity-80">Be the first to know about new drops and exclusive events.</p>
              <Button variant="outline" className="w-fit border-white text-white hover:bg-white hover:text-accent rounded-none uppercase text-xs tracking-widest px-10">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
