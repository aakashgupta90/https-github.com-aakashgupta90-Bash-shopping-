import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link, useSearchParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { formatPrice } from '../../lib/utils';
import { motion } from 'motion/react';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let q = collection(db, 'products');
      if (category) {
        // @ts-ignore
        q = query(q, where('category', '==', category));
      }
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (items.length === 0 && !category) {
        setProducts([
          { id: '1', title: 'Minimalist Watch', price: 199, category: 'Accessories', images: ['https://picsum.photos/seed/watch/800/1000'] },
          { id: '2', title: 'Leather Backpack', price: 149, category: 'Bags', images: ['https://picsum.photos/seed/bag/800/1000'] },
          { id: '3', title: 'Wireless Headphones', price: 299, category: 'Tech', images: ['https://picsum.photos/seed/audio/800/1000'] },
          { id: '4', title: 'Smart Speaker', price: 99, category: 'Tech', images: ['https://picsum.photos/seed/speaker/800/1000'] },
          { id: '5', title: 'Cotton T-Shirt', price: 35, category: 'Apparel', images: ['https://picsum.photos/seed/shirt/800/1000'] },
          { id: '6', title: 'Denim Jacket', price: 89, category: 'Apparel', images: ['https://picsum.photos/seed/jacket/800/1000'] },
        ]);
      } else {
        setProducts(items);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [category]);

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="flex flex-col space-y-12 mb-20">
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">The Collection</span>
          <h1 className="text-7xl font-display uppercase tracking-tighter">
            {category ? category : 'All Pieces'}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-8 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-12">
            <div className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer">
              Category <ChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform" />
            </div>
            <div className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer">
              Price Range <ChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform" />
            </div>
            <div className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer text-gray-400">
              Clear All
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="text-gray-400">Sort by:</span>
            <span className="cursor-pointer hover:text-accent transition-colors">Featured</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="space-y-6 animate-pulse">
              <div className="aspect-[3/4] bg-gray-50 rounded-sm" />
              <div className="h-4 bg-gray-50 w-3/4" />
              <div className="h-4 bg-gray-50 w-1/4" />
            </div>
          ))
        ) : (
          products.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to={`/products/${product.id}`} className="group block space-y-6">
                <div className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm relative">
                  <img 
                    src={product.images?.[0]} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg serif group-hover:text-accent transition-colors">{product.title}</h3>
                    <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{product.category}</p>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
