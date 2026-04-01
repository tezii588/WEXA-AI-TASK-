'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Boxes, Eye, EyeOff } from 'lucide-react';
import { api, setToken } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', organizationName: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await api.signup(form);
      setToken(data.token, data.orgName, data.email);
      toast.success(`Welcome to StockFlow, ${data.orgName}!`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">StockFlow</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-1">Create an account</h1>
          <p className="text-slate-500 text-sm mb-6">Get started with your inventory management.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Organization Name *</label>
              <input type="text" name="organizationName" value={form.organizationName} onChange={handleChange} className={inputClass} placeholder="My Store" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Password *</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className={`${inputClass} pr-10`} placeholder="Min 6 characters" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Confirm Password *</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className={inputClass} placeholder="Repeat password" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition disabled:opacity-60 mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
