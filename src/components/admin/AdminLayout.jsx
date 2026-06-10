import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  HomeIcon, CubeIcon, ClipboardDocumentListIcon, UsersIcon, TagIcon,
  ArrowRightOnRectangleIcon, Bars3Icon, BuildingStorefrontIcon,
  ChevronRightIcon, SunIcon, MoonIcon, GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { to: '/admin', icon: HomeIcon, label: t('adminDashboard'), end: true },
    { to: '/admin/products', icon: CubeIcon, label: t('products') },
    { to: '/admin/orders', icon: ClipboardDocumentListIcon, label: t('adminOrders') },
    { to: '/admin/customers', icon: UsersIcon, label: t('adminCustomers') },
    { to: '/admin/categories', icon: TagIcon, label: t('adminCategories') },
  ];

  const Sidebar = ({ mobile = false }) => (
    <aside className={`flex flex-col h-full ${mobile ? 'w-72' : (collapsed ? 'w-20' : 'w-64')} bg-dark-800 transition-all duration-300`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-white/10 ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow">
          <BuildingStorefrontIcon className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || mobile) && <span className="font-display font-bold text-white text-lg truncate">Wholesale<span className="text-primary-400">Hub</span></span>}
      </div>

      {/* Admin badge */}
      {(!collapsed || mobile) && (
        <div className="mx-4 mt-4 mb-2 px-3 py-2 bg-primary-900/60 rounded-xl">
          <div className="text-xs text-primary-300 font-medium">{t('adminPanel')}</div>
          <div className="text-sm font-semibold text-white truncate">{user?.fullName}</div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed && !mobile ? 'justify-center px-2' : ''}`}
            onClick={() => mobile && setMobileOpen(false)}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || mobile) && <span>{label}</span>}
            {(!collapsed || mobile) && <ChevronRightIcon className="w-3 h-3 ms-auto opacity-40" />}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-3">
        <NavLink to="/" className="sidebar-link" onClick={() => mobile && setMobileOpen(false)}>
          <BuildingStorefrontIcon className="w-5 h-5" />
          {(!collapsed || mobile) && <span>{t('viewStore')}</span>}
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900/30">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          {(!collapsed || mobile) && <span>{t('signOut')}</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-dark-800 border-b border-gray-100 dark:border-white/5 flex items-center px-4 sm:px-6 gap-4 shadow-sm flex-shrink-0">
          <button
            onClick={() => { setCollapsed(v => !v); setMobileOpen(v => !v); }}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <Bars3Icon className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-1.5 transition-all">
              <GlobeAltIcon className="w-4 h-4" />
              {language === 'fr' ? 'العربية' : 'Français'}
            </button>
            {/* Dark mode toggle */}
            <button onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              {darkMode ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.fullName}</span>
              <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{t('administrator')}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-sm">
              {user?.fullName?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 dark:bg-dark-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
