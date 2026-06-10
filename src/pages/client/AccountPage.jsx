import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [tab, setTab] = useState('orders');
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [saving, setSaving] = useState(false);

  const loadOrders = (page = 1) => {
    api.get(`/orders/my?page=${page}`).then(r => {
      setOrders(r.data.data);
      setPagination(r.data.pagination);
    });
  };

  useEffect(() => { loadOrders(); }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data.user);
      toast.success(t('profileUpdatedSuccess'));
    } catch {
      toast.error(t('profileUpdateFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="page-title mb-6">{t('myAccount')}</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-dark-700 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('orders')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'orders' ? 'bg-white dark:bg-dark-800 text-primary-700 dark:text-primary-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}>
          {t('ordersTab')}
        </button>
        <button onClick={() => setTab('profile')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'profile' ? 'bg-white dark:bg-dark-800 text-primary-700 dark:text-primary-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}>
          {t('profileTab')}
        </button>
      </div>

      {tab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div className="card p-12 text-center dark:bg-dark-800 dark:border-white/5">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-gray-500 dark:text-gray-400">{t('noOrdersYet')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="card p-5 dark:bg-dark-800 dark:border-white/5">
                  <div className="flex flex-wrap items-start gap-3 justify-between mb-3">
                    <div>
                      <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{order.orderNumber}</span>
                      <div className="font-semibold text-gray-900 dark:text-white">${parseFloat(order.totalAmount).toFixed(2)}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="space-y-1">
                    {order.items?.map(item => (
                      <div key={item.id} className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                        <span>{item.productName} ×{item.quantity}</span>
                        <span className="font-medium">${parseFloat(item.totalPrice).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Pagination page={pagination.page} pages={pagination.pages} onChange={loadOrders} />
            </div>
          )}
        </div>
      )}

      {tab === 'profile' && (
        <div className="card p-6 max-w-lg dark:bg-dark-800 dark:border-white/5">
          <h2 className="section-title mb-4">{t('editProfileTitle')}</h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="label">{t('fullNameInput')}</label>
              <input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="label">{t('emailInput')}</label>
              <input value={user?.email} disabled className="input bg-gray-50 dark:bg-dark-700 text-gray-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="label">{t('phoneInput')}</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="label">{t('addressLabel')}</label>
              <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="input" rows={3} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? t('placingOrder') : t('saveChangesBtn')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
