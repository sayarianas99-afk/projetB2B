import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

const STATUSES = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    api.get(`/admin/orders?${params}`).then(r => {
      setOrders(r.data.data); setPagination(r.data.pagination);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, search, status]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      if (selected?.id === orderId) setSelected(prev => ({ ...prev, status: newStatus }));
      load();
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(false); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Commandes</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{pagination.total} commandes au total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3 dark:bg-dark-800 dark:border-white/5">
        <div className="flex-1 min-w-48 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher des commandes..." className="input pl-9" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="input w-auto">
          <option value="">Tous les statuts</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden dark:bg-dark-800 dark:border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-700/50 border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Commande</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Client</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Articles</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Date</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Statut</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Total</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[1,2,3,4,5,6,7].map(j => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-dark-700 rounded" /></td>)}
                </tr>
              )) : orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 dark:text-gray-500">Aucune commande trouvée</td></tr>
              ) : orders.map(o => (
                <tr key={o.id} className="table-row-hover">
                  <td className="px-5 py-3.5">
                    <div className="font-mono text-xs text-primary-600 dark:text-primary-400 font-semibold">{o.orderNumber}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{o.items?.length} article(s)</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-gray-900 dark:text-white">{o.customerName}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[140px]">{o.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-1 max-w-[200px]">
                      {o.items?.map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 truncate flex items-center gap-1.5" title={item.productName}>
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-350 text-[10px] font-bold min-w-[20px]">
                            {item.quantity}
                          </span>
                          <span className="truncate">{item.productName}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 text-xs hidden md:table-cell">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3.5 text-center"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3.5 text-right font-bold text-gray-900 dark:text-white">${parseFloat(o.totalAmount).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => setSelected(o)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} pages={pagination.pages} onChange={setPage} />

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
              <div>
                <h2 className="font-display font-bold text-lg dark:text-white">Détails de la commande</h2>
                <span className="font-mono text-xs text-primary-600 dark:text-primary-400">{selected.orderNumber}</span>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5">
                <XMarkIcon className="w-5 h-5 dark:text-gray-300" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Customer info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-400">Nom</span><div className="font-semibold dark:text-white">{selected.customerName}</div></div>
                <div><span className="text-gray-400">Email</span><div className="font-semibold truncate dark:text-white">{selected.customerEmail}</div></div>
                <div><span className="text-gray-400">Tél</span><div className="font-semibold dark:text-white">{selected.customerPhone}</div></div>
                <div><span className="text-gray-400">Date</span><div className="font-semibold dark:text-white">{new Date(selected.createdAt).toLocaleDateString()}</div></div>
                <div className="col-span-2"><span className="text-gray-400">Adresse</span><div className="font-semibold dark:text-white">{selected.customerAddress}</div></div>
                {selected.notes && <div className="col-span-2"><span className="text-gray-400">Notes</span><div className="font-semibold dark:text-white">{selected.notes}</div></div>}
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Articles</h3>
                <div className="space-y-2">
                  {selected.items?.map(item => (
                    <div key={item.id} className="flex justify-between text-sm p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">{item.productName}</div>
                        <div className="text-gray-400 text-xs">{item.quantity}× @ ${parseFloat(item.unitPrice).toFixed(2)}</div>
                      </div>
                      <span className="font-bold dark:text-white">${parseFloat(item.totalPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <span>Total</span>
                  <span>${parseFloat(selected.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              {/* Update status */}
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Modifier le statut</h3>
                <div className="grid grid-cols-3 gap-2">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)} disabled={updating || selected.status === s}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${selected.status === s ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
