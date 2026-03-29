import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, Menu, X, ArrowRight } from 'lucide-react';
import { auth, db } from './lib/firebase';
import { useCartStore } from './store/useCartStore';
import { Button } from './components/ui/Button';
import { Toaster, toast } from 'sonner';
import { User } from './types';

// Pages (Moved to src/app structure)
import Home from './app/page';
import ProductDetail from './app/products/[id]/page';
import ProductList from './app/products/page';
import Cart from './app/cart/page';
import Checkout from './app/checkout/page';
import AuthPage from './app/(auth)/page';
import AdminDashboard from './app/(admin)/dashboard/page';
import Profile from './app/profile/page';

const Navbar = ({ user, role }: { user: any, role: string | null }) => {
  const cartItemsCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-display tracking-tighter uppercase">BASH</Link>
        
        <nav className="hidden md:flex items-center space-x-10 text-xs font-bold uppercase tracking-widest">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <Link to="/products" className="hover:text-accent transition-colors">Collection</Link>
          {role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-1 hover:text-accent transition-colors">
              <LayoutDashboard size={14} /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <UserIcon size={20} />
              </Link>
              <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="rounded-full px-6">Login</Button>
            </Link>
          )}
          
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-6 bg-white space-y-6 animate-in slide-in-from-top duration-300">
          <Link to="/" className="block text-2xl font-display uppercase" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" className="block text-2xl font-display uppercase" onClick={() => setIsMenuOpen(false)}>Collection</Link>
          {role === 'admin' && (
            <Link to="/admin" className="block text-2xl font-display uppercase" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
          )}
          {!user && <Link to="/auth" className="block text-2xl font-display uppercase" onClick={() => setIsMenuOpen(false)}>Login</Link>}
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="border-t py-20 bg-white">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
      <div className="space-y-6">
        <h3 className="text-3xl font-display uppercase">BASH</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Crafting premium essentials for the modern minimalist. Quality over quantity, always.</p>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Shop</h4>
        <ul className="space-y-4 text-sm text-gray-500">
          <li><Link to="/products" className="hover:text-black transition-colors">New Arrivals</Link></li>
          <li><Link to="/products" className="hover:text-black transition-colors">Best Sellers</Link></li>
          <li><Link to="/products" className="hover:text-black transition-colors">Archive</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Support</h4>
        <ul className="space-y-4 text-sm text-gray-500">
          <li><Link to="/" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
          <li><Link to="/" className="hover:text-black transition-colors">Privacy Policy</Link></li>
          <li><Link to="/" className="hover:text-black transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Newsletter</h4>
        <p className="text-sm text-gray-500 mb-6">Join our list for exclusive releases.</p>
        <div className="flex gap-2">
          <input type="email" placeholder="Email Address" className="flex-1 px-4 py-3 border-b border-gray-200 focus:border-black outline-none text-sm bg-transparent" />
          <Button variant="ghost" className="uppercase text-xs font-bold tracking-widest">Join</Button>
        </div>
      </div>
    </div>
    <div className="container mx-auto px-6 mt-20 pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-gray-400">
      <span>© 2026 Bash E-Commerce. All rights reserved.</span>
      <div className="flex gap-8">
        <span>Instagram</span>
        <span>Twitter</span>
        <span>Pinterest</span>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser?.email);
      setUser(currentUser);
      
      if (currentUser) {
        const adminEmail = "guptaaakash2020123@gmail.com".toLowerCase();
        const isAdminEmail = currentUser.email?.toLowerCase() === adminEmail;
        console.log('Is admin email:', isAdminEmail, 'User email:', currentUser.email);
        
        // Optimistically set role to admin if email matches
        if (isAdminEmail) {
          console.log('Setting role to admin (optimistic)');
          setRole('admin');
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (userDoc.exists()) {
            const currentRole = userDoc.data().role;
            console.log('Current role from DB:', currentRole);
            
            // Upgrade to admin if email matches but role is not admin in DB
            if (isAdminEmail && currentRole !== 'admin') {
              console.log('Upgrading user to admin in DB');
              await setDoc(doc(db, 'users', currentUser.uid), { ...userDoc.data(), role: 'admin' });
              setRole('admin');
            } else if (!isAdminEmail) {
              setRole(currentRole);
            }
          } else {
            console.log('User doc does not exist, creating...');
            const newUserData: User = {
              uid: currentUser.uid,
              email: currentUser.email!,
              role: isAdminEmail ? 'admin' : 'customer',
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', currentUser.uid), newUserData);
            setRole(newUserData.role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          // Fallback to optimistic role if it was set
          if (!isAdminEmail) setRole('customer');
        }
      } else {
        console.log('No user logged in, clearing role');
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-t-2 border-black rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log('Rendering App, role:', role);

  return (
    <Router>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} role={role} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route 
              path="/admin/*" 
              element={
                role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <div className="container mx-auto px-6 py-20 text-center">
                    <h1 className="text-4xl font-display uppercase mb-4">Access Denied</h1>
                    <p className="text-gray-500 mb-8">You do not have permission to view this page.</p>
                    <Link to="/" className="text-black underline underline-offset-4 uppercase text-xs font-bold tracking-widest">Return Home</Link>
                  </div>
                )
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
