import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../lib/utils';
import { motion } from 'motion/react';

const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-40 text-center space-y-10">
        <h1 className="text-7xl font-display uppercase tracking-tighter">Empty <br /> Archive</h1>
        <p className="text-xl serif italic text-gray-400">Your collection awaits its first piece.</p>
        <Link to="/products">
          <Button size="lg" className="rounded-none px-12 uppercase text-xs tracking-widest font-bold">Explore Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="flex flex-col space-y-4 mb-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Your Selection</span>
        <h1 className="text-7xl font-display uppercase tracking-tighter">Shopping <br /> Bag</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Items List */}
        <div className="lg:col-span-7 space-y-12">
          {items.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className="flex gap-10 pb-12 border-b border-gray-100 last:border-0"
            >
              <div className="w-32 h-40 sm:w-48 sm:h-64 rounded-sm overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-2xl serif">{item.title}</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Ref: {item.id.substring(0, 6)}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-300 hover:text-accent transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-lg font-medium">{formatPrice(item.price)}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-4 py-2 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xl font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
          <div className="bg-[#f5f5f4] p-12 space-y-10">
            <h2 className="text-2xl font-display uppercase tracking-widest">Summary</h2>
            <div className="space-y-6 text-sm uppercase tracking-widest font-bold">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-accent">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Tax</span>
                <span>{formatPrice(total * 0.08)}</span>
              </div>
              <div className="pt-8 border-t border-gray-200 flex justify-between text-xl">
                <span>Total</span>
                <span>{formatPrice(total * 1.08)}</span>
              </div>
            </div>
            <Button onClick={() => navigate('/checkout')} className="w-full rounded-none h-16 uppercase text-xs tracking-[0.2em] font-bold" size="lg">
              Checkout <ArrowRight size={18} className="ml-2" />
            </Button>
            <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">Secure encrypted checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
