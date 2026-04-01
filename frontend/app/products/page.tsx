'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProductForm from '@/components/ProductForm';
import { api } from '@/lib/api';
import { Plus, Search, Edit, Trash2, AlertTriangle, Package } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number | null;
  sellingPrice?: number | null;
  lowStockThreshold?: number | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [globalThreshold, setGlobalThreshold] = useState(5);

  const fetchProducts = async () => {
    try {
      const [prods, settings] = await Promise.all([api.getProducts(), api.getSettings()]);
      setProducts(prods);
      setGlobalThreshold(settings.defaultLowStockThreshold);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: any) => {
    if (editing?.id) {
      await api.updateProduct(editing.id, data);
      toast.success('Product updated!');
    } else {
      await api.createProduct(data);
      toast.success('Product added!');
    }
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProduct(id);
      toast.success('Product deleted');
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const isLowStock = (p: Product) => p.quantityOnHand <= (p.lowStockThreshold ?? globalThreshold);

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Products</h1>
            <p className="text-slate-500 text-sm mt-1">{products.length} total products</p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Package className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">{search ? 'No products match your search' : 'No products yet'}</p>
              {!search && (
                <button onClick={() => setShowForm(true)} className="mt-3 text-indigo-600 text-sm font-semibold hover:underline">
                  Add your first product →
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-100">
                    <th className="text-left px-6 py-3 font-semibold">Name</th>
                    <th className="text-left px-6 py-3 font-semibold">SKU</th>
                    <th className="text-left px-6 py-3 font-semibold">Qty</th>
                    <th className="text-left px-6 py-3 font-semibold">Selling Price</th>
                    <th className="text-left px-6 py-3 font-semibold">Status</th>
                    <th className="text-right px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3">
                        <div className="font-medium text-slate-800">{p.name}</div>
                        {p.description && <div className="text-xs text-slate-400 truncate max-w-xs">{p.description}</div>}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-slate-500">{p.sku}</td>
                      <td className="px-6 py-3">
                        <span className={`font-bold ${isLowStock(p) ? 'text-orange-600' : 'text-slate-800'}`}>
                          {p.quantityOnHand}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-700">
                        {p.sellingPrice ? `₹${p.sellingPrice.toFixed(2)}` : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-6 py-3">
                        {isLowStock(p) ? (
                          <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full w-fit">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            ✓ In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setEditing(p); setShowForm(true); }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <ProductForm
            product={editing}
            onClose={() => { setShowForm(false); setEditing(null); }}
            onSave={handleSave}
          />
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Delete Product?</h3>
              <p className="text-sm text-slate-500 text-center mb-6">This action cannot be undone. The product will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition">
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
