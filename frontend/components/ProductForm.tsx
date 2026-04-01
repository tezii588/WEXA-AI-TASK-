'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Product {
  id?: string;
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number | null;
  sellingPrice?: number | null;
  lowStockThreshold?: number | null;
}

interface Props {
  product?: Product | null;
  onClose: () => void;
  onSave: (data: Product) => Promise<void>;
}

export default function ProductForm({ product, onClose, onSave }: Props) {
  const [form, setForm] = useState<Product>({
    name: '', sku: '', description: '',
    quantityOnHand: 0, costPrice: null, sellingPrice: null, lowStockThreshold: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.sku) { setError('Name and SKU are required.'); return; }
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {product?.id ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input className={inputClass} name="name" value={form.name} onChange={handleChange} placeholder="Product name" required />
            </div>
            <div>
              <label className={labelClass}>SKU *</label>
              <input className={inputClass} name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. PRD-001" required />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea className={inputClass} name="description" value={form.description || ''} onChange={handleChange} placeholder="Optional description" rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Quantity on Hand *</label>
              <input className={inputClass} type="number" name="quantityOnHand" value={form.quantityOnHand} onChange={handleChange} min="0" required />
            </div>
            <div>
              <label className={labelClass}>Low Stock Threshold</label>
              <input className={inputClass} type="number" name="lowStockThreshold" value={form.lowStockThreshold ?? ''} onChange={handleChange} placeholder="Uses global default" min="0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cost Price (₹)</label>
              <input className={inputClass} type="number" name="costPrice" value={form.costPrice ?? ''} onChange={handleChange} placeholder="0.00" step="0.01" min="0" />
            </div>
            <div>
              <label className={labelClass}>Selling Price (₹)</label>
              <input className={inputClass} type="number" name="sellingPrice" value={form.sellingPrice ?? ''} onChange={handleChange} placeholder="0.00" step="0.01" min="0" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
              {loading ? 'Saving...' : product?.id ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
