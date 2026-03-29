import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatPrice, cn } from '../../lib/utils';
import { toast } from 'sonner';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { CreditCard, Truck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Checkout = () => {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: auth.currentUser?.email || '',
    firstName: '', lastName: '', address: '', city: '', zip: '',
    cardNumber: '', expiry: '', cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/v1/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total * 100 })
      });
      const data = await response.json();

      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser?.uid || 'guest',
        items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
        total: total * 1.08,
        status: 'pending',
        shippingAddress: {
          firstName: formData.firstName, lastName: formData.lastName,
          address: formData.address, city: formData.city, zip: formData.zip
        },
        paymentId: data.clientSecret,
        createdAt: new Date().toISOString()
      });

      toast.success('Your collection has been secured');
      clearCart();
      setStep(3);
    } catch (error: any) {
      toast.error('Transaction failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="container mx-auto px-6 py-40 text-center space-y-10 max-w-2xl">
        <h1 className="text-7xl font-display uppercase tracking-tighter">Success <br /> Secured</h1>
        <p className="text-xl serif italic text-gray-400 leading-relaxed">Your order has been placed and is being prepared in our studio. A confirmation has been sent to your email.</p>
        <div className="flex justify-center pt-10">
          <Button onClick={() => navigate('/')} size="lg" className="rounded-none px-12 uppercase text-xs tracking-widest font-bold">Return to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-7 space-y-16">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Step {step} of 2</span>
            <h1 className="text-6xl font-display uppercase tracking-tighter">
              {step === 1 ? 'Shipping' : 'Payment'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest">First Name</label>
                      <Input name="firstName" className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black h-12" value={formData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest">Last Name</label>
                      <Input name="lastName" className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black h-12" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">Shipping Address</label>
                    <Input name="address" className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black h-12" value={formData.address} onChange={handleInputChange} required />
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest">City</label>
                      <Input name="city" className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black h-12" value={formData.city} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest">Postal Code</label>
                      <Input name="zip" className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black h-12" value={formData.zip} onChange={handleInputChange} required />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">Card Number</label>
                    <Input name="cardNumber" placeholder="0000 0000 0000 0000" className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black h-12" value={formData.cardNumber} onChange={handleInputChange} required />
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest">Expiry</label>
                      <Input name="expiry" placeholder="MM/YY" className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black h-12" value={formData.expiry} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest">CVV</label>
                      <Input name="cvv" placeholder="123" className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black h-12" value={formData.cvv} onChange={handleInputChange} required />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-6 pt-10">
              <Button className="w-full rounded-none h-16 uppercase text-xs tracking-[0.2em] font-bold" size="lg" type="submit" disabled={loading}>
                {loading ? 'Processing...' : (step === 1 ? 'Continue to Payment' : `Complete Transaction`)}
              </Button>
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)} className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                  <ArrowLeft size={12} /> Back to Shipping
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
          <div className="bg-[#f5f5f4] p-12 space-y-10">
            <h2 className="text-2xl font-display uppercase tracking-widest">Your Order</h2>
            <div className="space-y-6 max-h-[400px] overflow-auto pr-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-sm serif italic">{item.title}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-gray-200 space-y-4 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-accent">Complimentary</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span>
                <span>{formatPrice(total * 0.08)}</span>
              </div>
              <div className="pt-6 flex justify-between text-xl text-black">
                <span>Total</span>
                <span>{formatPrice(total * 1.08)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
