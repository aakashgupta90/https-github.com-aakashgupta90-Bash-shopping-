import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Plus, Trash2, Package, ShoppingCart as OrdersIcon, BarChart3, ChevronRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '../../../lib/utils';
import { motion } from 'motion/react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    title: '', price: '', category: '', description: '', stock: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodSnap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
      setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const orderSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      setOrders(orderSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    setIsSeeding(true);
    const dummyProducts = [
      { title: 'Minimalist Watch', price: 199, category: 'Accessories', description: 'A timeless piece crafted with precision.', stock: 15 },
      { title: 'Leather Backpack', price: 149, category: 'Bags', description: 'Durable and stylish for every journey.', stock: 10 },
      { title: 'Wireless Headphones', price: 299, category: 'Tech', description: 'Immersive sound with zero cables.', stock: 20 },
      { title: 'Smart Speaker', price: 99, category: 'Tech', description: 'The heart of your modern home.', stock: 25 },
      { title: 'Cotton T-Shirt', price: 35, category: 'Apparel', description: 'Soft, breathable, and perfectly cut.', stock: 50 },
      { title: 'Denim Jacket', price: 89, category: 'Apparel', description: 'A classic layer for any season.', stock: 12 },
    ];

    try {
      for (const p of dummyProducts) {
        await addDoc(collection(db, 'products'), {
          ...p,
          slug: p.title.toLowerCase().replace(/ /g, '-'),
          vendorId: 'admin',
          createdAt: new Date().toISOString(),
          images: [`https://picsum.photos/seed/${p.title}/800/1200`]
        });
      }
      toast.success('Catalog seeded successfully');
      fetchData();
    } catch (error: any) {
      toast.error('Seeding failed: ' + error.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        slug: newProduct.title.toLowerCase().replace(/ /g, '-'),
        vendorId: 'admin',
        createdAt: new Date().toISOString(),
        images: [`https://picsum.photos/seed/${Math.random()}/800/1200`]
      });
      toast.success('Product added to catalog');
      setNewProduct({ title: '', price: '', category: '', description: '', stock: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfc]">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-xl font-display uppercase tracking-widest">Admin Console</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search inventory or orders..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-xs outline-none w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={seedData} 
              disabled={isSeeding}
              className="text-[10px] font-bold uppercase tracking-widest"
            >
              {isSeeding ? 'Seeding...' : 'Seed Data'}
            </Button>
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">AD</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Hardware Tool Style */}
          <aside className="w-full lg:w-64 space-y-1">
            <button 
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'stats' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <BarChart3 size={16} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'products' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <Package size={16} /> Inventory
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'orders' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <OrdersIcon size={16} /> Orders
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-12">
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 border border-gray-100 rounded-sm space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Revenue</span>
                  <p className="text-4xl font-display">{formatPrice(orders.reduce((acc, o) => acc + o.total, 0))}</p>
                </div>
                <div className="bg-white p-10 border border-gray-100 rounded-sm space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Orders</span>
                  <p className="text-4xl font-display">{orders.length}</p>
                </div>
                <div className="bg-white p-10 border border-gray-100 rounded-sm space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Active Stock</span>
                  <p className="text-4xl font-display">{products.length}</p>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-12">
                <div className="bg-white p-10 border border-gray-100 rounded-sm">
                  <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-10">Add New Item</h2>
                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Title</label>
                      <Input className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Price</label>
                      <Input type="number" step="0.01" className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Category</label>
                      <Input className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Stock</label>
                      <Input type="number" className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Description</label>
                      <Input className="rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required />
                    </div>
                    <Button type="submit" className="md:col-span-2 rounded-none h-14 uppercase text-xs tracking-widest font-bold">Create Product</Button>
                  </form>
                </div>

                <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <tr>
                        <th className="px-8 py-6">Item</th>
                        <th className="px-8 py-6">Category</th>
                        <th className="px-8 py-6">Price</th>
                        <th className="px-8 py-6">Stock</th>
                        <th className="px-8 py-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-6 font-bold text-sm">{p.title}</td>
                          <td className="px-8 py-6 text-xs text-gray-500">{p.category}</td>
                          <td className="px-8 py-6 text-sm">{formatPrice(p.price)}</td>
                          <td className="px-8 py-6 text-sm">{p.stock}</td>
                          <td className="px-8 py-6 text-right">
                            <button onClick={() => deleteDoc(doc(db, 'products', p.id)).then(fetchData)} className="text-gray-300 hover:text-accent">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="px-8 py-6">Order ID</th>
                      <th className="px-8 py-6">Customer</th>
                      <th className="px-8 py-6">Total</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6 font-bold text-sm">#{o.id.substring(0, 8)}</td>
                        <td className="px-8 py-6 text-xs text-gray-500">{o.shippingAddress?.firstName} {o.shippingAddress?.lastName}</td>
                        <td className="px-8 py-6 text-sm">{formatPrice(o.total)}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            o.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-xs text-gray-400">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
