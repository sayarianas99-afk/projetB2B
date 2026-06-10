import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, CubeIcon } from '@heroicons/react/24/outline';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    api.get(`/admin/products?${params}`).then(r => {
      setProducts(r.data.data); setPagination(r.data.pagination);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { api.get('/categories').then(r => setCategories(r.data.data)); }, []);
  useEffect(() => { load(); }, [page, search, category]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer "${name}" ?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Produit supprimé');
      load();
    } catch { toast.error('Échec de la suppression'); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h1 className="page-title">Produits</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{pagination.total} produits au total</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          <PlusIcon className="w-4 h-4" /> Ajouter un produit
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3 dark:bg-dark-800 dark:border-white/5">
        <div className="flex-1 min-w-48 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher des produits..." className="input pl-9" />
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="input w-auto">
          <option value="">Toutes les catégories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden dark:bg-dark-800 dark:border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-700/50 border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Produit</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Catégorie</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Prix Unitaire</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Gros</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Stock</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Statut</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[1,2,3,4,5,6,7].map(j => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-dark-700 rounded" /></td>)}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 dark:text-gray-500">
                  <CubeIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  Aucun produit trouvé
                </td></tr>
              ) : products.map(p => (
                <tr key={p.id} className="table-row-hover">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-700 flex-shrink-0">
                        <img src={p.images?.[0]?.imageUrl} alt="" className="w-full h-full object-cover"
                          onError={e => { e.target.src = `https://picsum.photos/seed/${p.id}/80/80`; }} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white max-w-[200px] truncate">{p.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{p.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 hidden md:table-cell">{p.category?.name}</td>
                  <td className="px-4 py-3.5 text-right font-semibold text-gray-900 dark:text-white">${parseFloat(p.unitPrice).toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-right text-accent-600 dark:text-accent-400 font-semibold hidden sm:table-cell">${parseFloat(p.wholesalePrice).toFixed(2)}</td>
                  <td className={`px-4 py-3.5 text-right font-semibold ${p.stock > 100 ? 'text-green-600 dark:text-green-400' : p.stock > 10 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                    {p.stock.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`badge ${p.isActive ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'}`}>
                      ● {p.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/products/edit/${p.id}`} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(p.id, p.name)} disabled={deletingId === p.id}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-50">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} pages={pagination.pages} onChange={setPage} />
    </div>
  );
}
