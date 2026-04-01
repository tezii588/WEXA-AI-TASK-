'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { Package, TrendingDown, AlertTriangle, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  quantityOnHand: number;
  lowStockThreshold: number | null;
}

interface DashboardData {
  totalProducts: number;
  totalQuantity: number;
  globalThreshold: number;
  lowStockItems: LowStockItem[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(setData)
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  const stats = [
    { label: 'Total Products', value: data?.totalProducts ?? 0, icon: Package, color: 'bg-blue-500', bg: 'bg-blue-50 text-blue-600' },
    { label: 'Total Units in Stock', value: data?.totalQuantity ?? 0, icon: BarChart3, color: 'bg-indigo-500', bg: 'bg-indigo-50 text-indigo-600' },
    { label: 'Low Stock Items', value: data?.lowStockItems.length ?? 0, icon: AlertTriangle, color: 'bg-orange-500', bg: 'bg-orange-50 text-orange-600' },
    { label: 'Global Low Stock Alert', value: `≤ ${data?.globalThreshold ?? 5} units`, icon: TrendingDown, color: 'bg-red-500', bg: 'bg-red-50 text-red-600' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of your inventory status</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.bg}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Low Stock Table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h2 className="font-semibold text-slate-800">Low Stock Items</h2>
              {data && data.lowStockItems.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                  {data.lowStockItems.length}
                </span>
              )}
            </div>
          </div>

          {!data?.lowStockItems.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Package className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">All items are well stocked! 🎉</p>
              <p className="text-sm mt-1">No products below their threshold.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-6 py-3 font-semibold">Product Name</th>
                    <th className="text-left px-6 py-3 font-semibold">SKU</th>
                    <th className="text-left px-6 py-3 font-semibold">Qty on Hand</th>
                    <th className="text-left px-6 py-3 font-semibold">Threshold</th>
                    <th className="text-left px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data?.lowStockItems.map(item => {
                    const threshold = item.lowStockThreshold ?? data.globalThreshold;
                    const critical = item.quantityOnHand === 0;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-3 font-medium text-slate-800">{item.name}</td>
                        <td className="px-6 py-3 text-slate-500 font-mono text-xs">{item.sku}</td>
                        <td className="px-6 py-3">
                          <span className={`font-bold ${critical ? 'text-red-600' : 'text-orange-600'}`}>
                            {item.quantityOnHand}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-500">{threshold}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${critical ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                            {critical ? '🚨 Out of Stock' : '⚠️ Low Stock'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
