import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: user?.fullName || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    customerAddress: user?.address || '',
    notes: '',
  });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  if (items.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🛒</div>
      <h2 className="font-display text-xl font-bold mb-3 dark:text-white">{t('cartIsEmpty')}</h2>
      <Link to="/products" className="btn-primary mx-auto">{t('shopNow')}</Link>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.customerEmail || !form.customerPhone || !form.customerAddress) {
      return toast.error(t('fillAllFields'));
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      };
      const { data } = await api.post('/orders', payload);
      clearCart();
      toast.success(t('orderPlacedSuccess'));
      navigate(`/order-confirm/${data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in`}>
      <h1 className="page-title mb-6">{t('checkout')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6 dark:bg-dark-800 dark:border-white/5">
              <h2 className="section-title mb-4">{t('deliveryInfo')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">{t('fullNameLabel')}</label>
                  <input value={form.customerName} onChange={set('customerName')} className="input" required />
                </div>
                <div>
                  <label className="label">{t('emailLabel')}</label>
                  <input type="email" value={form.customerEmail} onChange={set('customerEmail')} className="input" required />
                </div>
                <div>
                  <label className="label">{t('phoneLabel')}</label>
                  <input value={form.customerPhone} onChange={set('customerPhone')} className="input" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">{t('addressLabel')}</label>
                  <textarea value={form.customerAddress} onChange={set('customerAddress')} className="input" rows={3} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">{t('notesLabel')}</label>
                  <textarea value={form.notes} onChange={set('notes')} className="input" rows={2} placeholder={t('notesPlaceholder')} />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24 dark:bg-dark-800 dark:border-white/5">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-4">{t('orderSummary')}</h2>
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <div>
                      <div className="text-gray-700 dark:text-gray-300 truncate max-w-[150px] font-medium">{item.name}</div>
                      <div className="text-gray-400 text-xs">{item.quantity}× @ {item.price.toFixed(2)} DT</div>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-white">{(item.price * item.quantity).toFixed(2)} DT</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-white/5 pt-3 mb-5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{t('total')}</span>
                  <span className="font-display text-xl font-bold text-gray-900 dark:text-white">{total.toFixed(2)} DT</span>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '📋'}
                {loading ? t('placingOrder') : t('placeOrder')}
              </button>
              <Link to="/cart" className="btn-ghost w-full justify-center mt-2 text-sm dark:text-gray-400 dark:hover:text-white">
                ← {t('shoppingCart')}
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
