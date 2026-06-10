import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import StatusBadge from '../../components/common/StatusBadge';
import { useTheme } from '../../context/ThemeContext';
import { CubeIcon, ClipboardDocumentListIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    api.get('/admin/dashboard').then(r => { setStats(r.data.data); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 dark:bg-dark-700 rounded-2xl" />)}
      </div>
      <div className="h-64 bg-gray-200 dark:bg-dark-700 rounded-2xl" />
    </div>
  );

  const statusColors = { pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' };
  const pieData = stats.statusCounts.map(s => ({
    name: s.status, value: parseInt(s.dataValues?.count || s.count || 0), fill: statusColors[s.status] || '#9ca3af'
  }));

  const statCards = [
    { icon: CubeIcon, label: 'Produits', value: stats.totalProducts, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', link: '/admin/products' },
    { icon: ClipboardDocumentListIcon, label: 'Commandes', value: stats.totalOrders, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40', link: '/admin/orders' },
    { icon: UsersIcon, label: 'Clients', value: stats.totalClients, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/40', link: '/admin/customers' },
    { icon: CurrencyDollarIcon, label: 'Revenu Total', value: `$${parseFloat(stats.revenue || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'text-accent-600 dark:text-accent-400', bg: 'bg-orange-50 dark:bg-orange-950/40', link: '/admin/orders' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bienvenue ! Voici l'aperçu de votre boutique.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, bg, link }) => (
          <Link key={label} to={link} className="stat-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5 truncate">{label}</div>
              <div className="font-display font-bold text-xl text-gray-900 dark:text-white truncate">{value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Order status pie */}
        <div className="card p-5 dark:bg-dark-800 dark:border-white/5">
          <h2 className="section-title mb-4">Statut des commandes</h2>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1e2330' : '#ffffff',
                      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                      color: darkMode ? '#e5e7eb' : '#111827',
                      borderRadius: '12px',
                    }}
                    formatter={(v, n) => [v, n.charAt(0).toUpperCase() + n.slice(1)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{d.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-gray-400 text-sm text-center py-8">Aucune commande pour l'instant</p>}
        </div>

        {/* Recent orders */}
        <div className="card p-5 lg:col-span-2 dark:bg-dark-800 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Commandes récentes</h2>
            <Link to="/admin/orders" className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">Voir tout →</Link>
          </div>
          <div className="space-y-2">
            {stats.recentOrders.length === 0 && <p className="text-gray-400 text-sm text-center py-6">Aucune commande pour l'instant</p>}
            {stats.recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-950 rounded-lg flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-xs flex-shrink-0">
                  {order.customerName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{order.customerName}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <StatusBadge status={order.status} />
                <span className="font-bold text-gray-900 dark:text-white text-sm flex-shrink-0">${parseFloat(order.totalAmount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
