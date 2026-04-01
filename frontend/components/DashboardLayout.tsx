'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getToken } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getToken()) router.push('/login');
    else setChecked(true);
  }, [router]);

  if (!checked) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
