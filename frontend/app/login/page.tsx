'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Boxes, Eye, EyeOff } from 'lucide-react';
import { api, setToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.login(form);
      setToken(data.token, data.orgName, data.email);
      toast.success(`Welcome back to ${data.orgName}!`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setForm({ email: 'demo@stockflow.com', password: 'password123' });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2 text-white">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold">StockFlow</span>
        </div>
        <h2 className="text-4xl font-bold mb-4 leading-tight">
          Manage your inventory<br />with confidence
        </h2>
        <p className="text-slate-400 text-lg max-w-sm">
          Track products, monitor stock levels, and never run out of what matters most.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm">
          {[
            { label: 'Total Products', value: '500+' },
            { label: 'Organizations', value: '100+' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Support', value: '24/7' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-indigo-300">{s.value}</div>
              <div className="text-sm text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <Boxes className="w-6 h-6 text-indigo-600" />
              <span className="text-xl font-bold text-slate-800">StockFlow</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Sign in</h1>
            <p className="text-slate-500 text-sm mb-6">Welcome back! Please enter your details.</p>

            <button
              type="button"
              onClick={fillDemo}
              className="w-full mb-4 px-4 py-2.5 rounded-lg border-2 border-dashed border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition"
            >
              🎯 Use Demo Credentials
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Email</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com" required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                    placeholder="••••••••" required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition disabled:opacity-60 mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link href="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
