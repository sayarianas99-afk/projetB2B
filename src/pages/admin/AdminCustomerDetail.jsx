import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import StatusBadge from '../../components/common/StatusBadge';
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/customers/${id}`).then(r => {
      setCustomer(r.data.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-32 bg-gray-200 dark:bg-dark-700 rounded-2xl" />
      <div className="h-64 bg-gray-200 dark:bg-dark-700 rounded-2xl" />
    </div>
  );

  if (!customer) return (
    <div className="text-center py-20 text-gray-400 dark:text-gray-500">Client introuvable</div>
  );

  // Build product quantity map from all order items
  const productMap = {};
  customer.orders?.forEach(order => {
    order.items?.forEach(item => {
      if (!productMap[item.productName]) productMap[item.productName] = 0;
      productMap[item.productName] += item.quantity;
    });
  });

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/customers" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <h1 className="page-title">Profil Client</h1>
      </div>

      {/* Profile card */}
      <div className="card p-6 dark:bg-dark-800 dark:border-white/5">
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white font-display font-bold text-2xl shadow-glow flex-shrink-0">
            {customer.fullName?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">{customer.fullName}</h2>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <EnvelopeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {customer.email}
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {customer.phone}
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {customer.address}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-primary-50 dark:bg-primary-950/40 rounded-2xl px-5 py-3">
              <div className="font-display text-2xl font-bold text-primary-700 dark:text-primary-400">{customer.orderCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Commandes</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/40 rounded-2xl px-5 py-3">
              <div className="font-display text-xl font-bold text-green-700 dark:text-green-400">${parseFloat(customer.totalSpent).toFixed(2)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total dépensé</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product purchase summary */}
      {Object.keys(productMap).length > 0 && (
        <div className="card p-5 dark:bg-dark-800 dark:border-white/5">
          <h2 className="section-title mb-4">Produits achetés</h2>
          <div className="space-y-2">
            {Object.entries(productMap).sort((a, b) => b[1] - a[1]).map(([name, qty]) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-white/5 last:border-0">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[70%]">{name}</span>
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400 font-bold">
                  {qty.toLocaleString()} unités
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order history */}
      <div className="card p-5 dark:bg-dark-800 dark:border-white/5">
        <h2 className="section-title mb-4">Historique des commandes</h2>
        {customer.orders?.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-6">Aucune commande pour l'instant</p>
        ) : (
          <div className="space-y-3">
            {customer.orders?.map(order => (
              <div key={order.id} className="border border-gray-100 dark:border-white/5 rounded-2xl p-4 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                <div className="flex flex-wrap items-center gap-3 justify-between mb-3">
                  <div>
                    <span className="font-mono text-xs text-primary-600 dark:text-primary-400 font-semibold block">{order.orderNumber}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="font-bold text-gray-900 dark:text-white">${parseFloat(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{item.productName} ×{item.quantity}</span>
                      <span className="font-medium">${parseFloat(item.totalPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
