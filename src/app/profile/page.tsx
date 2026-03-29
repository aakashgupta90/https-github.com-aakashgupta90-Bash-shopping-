import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { formatPrice } from '../../lib/utils';
import { Package, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/Button';

const Profile = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="container mx-auto px-6 py-20 max-w-5xl">
      <div className="space-y-20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
          <div className="w-32 h-32 rounded-full bg-black text-white flex items-center justify-center text-5xl font-display">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Member Profile</span>
            <h1 className="text-6xl font-display uppercase tracking-tighter">{user?.displayName || 'The Collective'}</h1>
            <p className="text-xl serif italic text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-display uppercase tracking-widest">Order Archive</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{orders.length} Total Orders</span>
          </div>

          {loading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-32 text-center space-y-8 border border-dashed border-gray-200 rounded-sm">
              <p className="text-xl serif italic text-gray-400">Your collection is currently empty.</p>
              <Link to="/products">
                <Button variant="outline" className="rounded-none px-10 uppercase text-[10px] font-bold tracking-widest">Explore Collection</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group block p-10 border border-gray-100 hover:border-black transition-all bg-white"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest">Order #{order.id.substring(0, 8)}</span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm serif italic text-gray-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          month: 'long', day: 'numeric', year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-right space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Value</p>
                        <p className="text-xl font-bold">{formatPrice(order.total)}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
