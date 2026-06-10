import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Pagination from '../../components/common/Pagination';
import { MagnifyingGlassIcon, EyeIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set('search', search);
    api.get(`/admin/customers?${params}`).then(r => {
      setCustomers(r.data.data); setPagination(r.data.pagination);
    }).finally(() => setLoading(false));
  }, [page, search]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="page-title">Clients</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{pagination.total} clients enregistrés</p>
      </div>

      <div className="card p-4 dark:bg-dark-800 dark:border-white/5">
        <div className="relative max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par nom, email, téléphone..."
            className="input pl-9" />
        </div>
      </div>

      <div className="card overflow-hidden dark:bg-dark-800 dark:border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-700/50 border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Client</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Téléphone</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 hidden lg:table-cell">Adresse</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Commandes</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Total dépensé</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? Array(6).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[1,2,3,4,5,6].map(j => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-dark-700 rounded" /></td>)}
                </tr>
              )) : customers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400 dark:text-gray-500">
                  <UsersIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  Aucun client trouvé
                </td></tr>
              ) : customers.map(c => (
                <tr key={c.id} className="table-row-hover">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-sm flex-shrink-0">
                        {c.fullName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{c.fullName}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[160px]">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 hidden md:table-cell">{c.phone || '—'}</td>
                  <td className="px-4 py-3.5 text-gray-500 dark:text-gray-500 text-xs hidden lg:table-cell max-w-[180px] truncate">{c.address || '—'}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">{c.orderCount}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-gray-900 dark:text-white">${parseFloat(c.totalSpent).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Link to={`/admin/customers/${c.id}`} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors inline-flex">
                      <EyeIcon className="w-4 h-4" />
                    </Link>
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
