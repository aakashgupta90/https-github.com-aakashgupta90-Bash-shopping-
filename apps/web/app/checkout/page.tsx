"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ShoppingBag, ChevronRight, CheckCircle2, CreditCard, Truck, ArrowLeft } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Step = 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('shipping');
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          variantId: item.variantId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: total(),
        shippingAddress: shippingData,
        status: 'PAID', // In real world, this depends on payment success
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      toast.success('Order placed successfully!');
      clearCart();
      setStep('confirmation');
    } catch (error: any) {
      toast.error('Failed to place order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <ShoppingBag size={48} strokeWidth={1} />
        <h2 className="text-2xl font-display uppercase tracking-tighter">Your bag is empty</h2>
        <a href="/shop" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">Start Shopping</a>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Side: Checkout Steps */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-12">
            {['shipping', 'payment', 'confirmation'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${step === s ? 'text-black' : 'text-gray-300'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest`}>{s}</span>
                </div>
                {i < 2 && <ChevronRight size={12} className="text-gray-300" />}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'shipping' && (
              <motion.div 
                key="shipping"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8 bg-white p-10 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-black text-white rounded-xl"><Truck size={20} /></div>
                  <h3 className="text-xl font-bold tracking-tight">Shipping Information</h3>
                </div>

                <form onSubmit={handleShippingSubmit} className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">First Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full border-b border-gray-200 py-3 focus:border-black outline-none text-sm transition-colors"
                      value={shippingData.firstName}
                      onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Last Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full border-b border-gray-200 py-3 focus:border-black outline-none text-sm transition-colors"
                      value={shippingData.lastName}
                      onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Address</label>
                    <input 
                      required
                      type="text" 
                      className="w-full border-b border-gray-200 py-3 focus:border-black outline-none text-sm transition-colors"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">City</label>
                    <input 
                      required
                      type="text" 
                      className="w-full border-b border-gray-200 py-3 focus:border-black outline-none text-sm transition-colors"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Zip Code</label>
                    <input 
                      required
                      type="text" 
                      className="w-full border-b border-gray-200 py-3 focus:border-black outline-none text-sm transition-colors"
                      value={shippingData.zipCode}
                      onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="col-span-2 bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors mt-4"
                  >
                    Continue to Payment
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8 bg-white p-10 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-black text-white rounded-xl"><CreditCard size={20} /></div>
                    <h3 className="text-xl font-bold tracking-tight">Payment Method</h3>
                  </div>
                  <button onClick={() => setStep('shipping')} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2">
                    <ArrowLeft size={12} /> Edit Shipping
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-6 border-2 border-black rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px]">VISA</div>
                      <div>
                        <p className="text-xs font-bold tracking-widest">•••• •••• •••• 4242</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Expires 12/26</p>
                      </div>
                    </div>
                    <CheckCircle2 size={20} className="text-black" />
                  </div>

                  <div className="p-6 border border-gray-100 rounded-xl flex items-center justify-between opacity-50 grayscale">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px]">PAYPAL</div>
                      <p className="text-xs font-bold tracking-widest">bash.collector@gmail.com</p>
                    </div>
                  </div>

                  <button 
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : `Pay $${total().toFixed(2)}`}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'confirmation' && (
              <motion.div 
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 bg-white p-16 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={40} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-display uppercase tracking-tighter">Order Confirmed</h2>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Thank you for your purchase. We've sent a confirmation email to your inbox.
                  </p>
                </div>
                <button 
                  onClick={() => router.push('/shop')}
                  className="bg-black text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors"
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm sticky top-32 space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-gray-100 pb-4">Order Summary</h3>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover grayscale" alt={item.name} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                    <p className="text-xs font-bold tracking-widest">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-gray-100">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Subtotal</span>
                <span>${total().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold tracking-tighter pt-4">
                <span>Total</span>
                <span>${total().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
