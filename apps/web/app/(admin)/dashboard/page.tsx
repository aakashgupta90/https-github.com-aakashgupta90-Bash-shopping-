"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Bell,
  Database
} from 'lucide-react';
import { seedFirestore } from '@/lib/seed-firestore';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const handleSeed = async () => {
    const success = await seedFirestore();
    if (success) {
      toast.success('Database seeded successfully');
    } else {
      toast.error('Failed to seed database');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-8">
          <h2 className="text-2xl font-display tracking-tighter uppercase">BASH / ADMIN</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-sm font-bold uppercase tracking-widest">
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors">
            <Package size={18} /> Products
          </a>
          <a href="/admin/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors">
            <ShoppingBag size={18} /> Orders
          </a>
          <a href="/admin/users" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors">
            <Users size={18} /> Customers
          </a>
        </nav>

        <div className="p-8 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-600" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest">Admin User</p>
              <p className="text-[8px] text-gray-500 uppercase tracking-widest">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search analytics, orders, products..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-black"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={handleSeed}
              className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Database size={14} /> Seed DB
            </button>
            <button className="relative text-gray-400 hover:text-black transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="bg-black text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Plus size={14} /> New Product
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Revenue', value: '$128,430', change: '+12.5%', icon: TrendingUp, color: 'text-green-500' },
              { label: 'Active Orders', value: '432', change: '+8.2%', icon: ShoppingBag, color: 'text-blue-500' },
              { label: 'New Customers', value: '1,240', change: '-2.4%', icon: Users, color: 'text-red-500' },
              { label: 'Avg. Order Value', value: '$297', change: '+4.1%', icon: TrendingUp, color: 'text-green-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <stat.icon size={20} className="text-black" />
                  </div>
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${stat.color}`}>
                    {stat.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                <h4 className="text-2xl font-bold tracking-tight">{stat.value}</h4>
              </div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest">Recent Orders</h3>
              <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { id: '#ORD-7241', customer: 'Alex Rivera', product: 'Essential Watch No. 1', status: 'Processing', amount: '$240.00' },
                    { id: '#ORD-7240', customer: 'Sarah Chen', product: 'Archival Backpack', status: 'Shipped', amount: '$180.00' },
                    { id: '#ORD-7239', customer: 'Marcus Thorne', product: 'Minimalist Wallet', status: 'Delivered', amount: '$85.00' },
                    { id: '#ORD-7241', customer: 'Elena Gilbert', product: 'Essential Watch No. 2', status: 'Cancelled', amount: '$240.00' },
                  ].map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold tracking-widest">{order.id}</td>
                      <td className="px-6 py-4 text-xs font-medium">{order.customer}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{order.product}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-right">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
