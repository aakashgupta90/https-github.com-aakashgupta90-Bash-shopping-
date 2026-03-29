import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back to the collective');
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          role: 'customer',
          createdAt: new Date().toISOString()
        });
        toast.success('Your collection begins now');
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden bg-gray-900">
        <img src="https://picsum.photos/seed/auth/1200/1600" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 flex flex-col justify-center p-20 text-white space-y-8">
          <h2 className="text-7xl font-display uppercase tracking-tighter">The <br /> Collective</h2>
          <p className="text-xl serif italic max-w-sm opacity-80 leading-relaxed">Join our community of minimalists and gain access to exclusive releases and archival pieces.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-10 lg:px-24 py-20 bg-white">
        <div className="max-w-md w-full mx-auto space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">{isLogin ? 'Welcome Back' : 'Join Us'}</span>
            <h1 className="text-5xl font-display uppercase tracking-tighter">
              {isLogin ? 'Sign In' : 'Register'}
            </h1>
          </div>

          <form onSubmit={handleAuth} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Email Address</label>
                <Input 
                  type="email" 
                  className="rounded-none border-0 border-b border-gray-200 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black h-12"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Password</label>
                <Input 
                  type="password" 
                  className="rounded-none border-0 border-b border-gray-200 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black h-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full rounded-none h-14 uppercase text-xs tracking-widest font-bold" type="submit" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Access Account' : 'Create Account')}
              </Button>
              <Button variant="outline" className="w-full rounded-none h-14 uppercase text-xs tracking-widest font-bold" onClick={() => signInWithPopup(auth, new GoogleAuthProvider()).then(() => navigate('/'))}>
                Continue with Google
              </Button>
            </div>
          </form>

          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            {isLogin ? "New here? " : "Already a member? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-black underline underline-offset-4"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
