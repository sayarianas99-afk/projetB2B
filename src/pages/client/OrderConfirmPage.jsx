import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import StatusBadge from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function OrderConfirmPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { t, dir } = useLanguage();

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.data)).catch(() => {});
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-fade-in">
      <div className="card p-8 dark:bg-dark-800 dark:border-white/5">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('thankYou')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-1">{t('orderSuccessDesc')}</p>
        {order && (
          <p className="text-sm font-mono text-primary-600 dark:text-primary-400 font-semibold mb-6">
            {t('orderNumberLabel')} #{order.orderNumber}
          </p>
        )}

        {order && (
          <div className={`bg-gray-50 dark:bg-dark-700 rounded-2xl p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'} mb-6`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{t('statusLabel')}</span>
              <StatusBadge status={order.status} />
            </div>
            <div className="space-y-2">
              {order.items?.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{item.productName} ×{item.quantity}</span>
                  <span className="font-medium">${parseFloat(item.totalPrice).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-white/5 mt-3 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
              <span>{t('total')}</span>
              <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Link to="/products" className="btn-primary">{t('continueShopping')}</Link>
          <Link to="/account" className="btn-secondary dark:bg-dark-700 dark:border-white/10 dark:text-primary-400">{t('ordersTab')}</Link>
        </div>
      </div>
    </div>
  );
}
