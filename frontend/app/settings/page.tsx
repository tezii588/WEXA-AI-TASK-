'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { Settings, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(5);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings()
      .then(data => {
        setThreshold(data.defaultLowStockThreshold);
        setOrgName(data.orgName);
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({ defaultLowStockThreshold: threshold });
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your organization preferences</p>
        </div>

        {/* Org Info */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-4">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-500" />
            Organization
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Organization Name</label>
            <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">
              {loading ? '...' : orgName}
            </div>
          </div>
        </div>

        {/* Inventory Settings */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-500" />
            Inventory Defaults
          </h2>
          <p className="text-xs text-slate-400 mb-4">These defaults apply when a product has no specific threshold set.</p>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Default Low Stock Threshold
              </label>
              <input
                type="number"
                value={threshold}
                onChange={e => setThreshold(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Products with quantity ≤ this value will be flagged as low stock.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-60 shadow-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
