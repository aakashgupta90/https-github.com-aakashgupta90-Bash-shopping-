import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Eye,
  LayoutGrid,
  List as ListIcon,
  Package,
  ShoppingBag,
  Users,
  Edit
} from 'lucide-react';

export default function AdminProducts() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar (Same as Dashboard) */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-8">
          <h2 className="text-2xl font-display tracking-tighter uppercase">BASH / ADMIN</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors">
            <LayoutGrid size={18} /> Dashboard
          </a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-sm font-bold uppercase tracking-widest">
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
          <h1 className="text-sm font-bold uppercase tracking-widest">Inventory Management</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-xs focus:ring-1 focus:ring-black"
              />
            </div>
            <button className="bg-black text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Plus size={14} /> Add Product
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Filters & Actions */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">
                <Filter size={14} /> Filter
              </button>
              <div className="h-4 w-[1px] bg-gray-200 mx-2" />
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button className="p-2 bg-white rounded-md shadow-sm"><ListIcon size={14} /></button>
                <button className="p-2 text-gray-400 hover:text-black transition-colors"><LayoutGrid size={14} /></button>
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Showing 12 of 48 Products</p>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'Essential Watch No. 1', category: 'Watches', price: '$240.00', stock: 12, status: 'In Stock', image: 'https://picsum.photos/seed/prod1/100/100' },
                  { name: 'Archival Backpack', category: 'Bags', price: '$180.00', stock: 4, status: 'Low Stock', image: 'https://picsum.photos/seed/prod2/100/100' },
                  { name: 'Minimalist Wallet', category: 'Accessories', price: '$85.00', stock: 0, status: 'Out of Stock', image: 'https://picsum.photos/seed/prod3/100/100' },
                  { name: 'Essential Watch No. 2', category: 'Watches', price: '$240.00', stock: 28, status: 'In Stock', image: 'https://picsum.photos/seed/prod4/100/100' },
                ].map((product, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                          <img src={product.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="text-xs font-bold tracking-widest uppercase">{product.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">SKU: BASH-00{i+1}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium uppercase tracking-widest text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 text-xs font-bold tracking-widest">{product.price}</td>
                    <td className="px-6 py-4 text-xs font-medium">{product.stock} units</td>
                    <td className="px-6 py-4">
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                        product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                        product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-black transition-colors"><Eye size={14} /></button>
                        <button className="p-2 text-gray-400 hover:text-black transition-colors"><Edit size={14} /></button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
