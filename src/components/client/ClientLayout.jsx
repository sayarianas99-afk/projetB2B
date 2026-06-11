import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon,
  MagnifyingGlassIcon, BuildingStorefrontIcon, SunIcon, MoonIcon, GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function ClientLayout() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { language, setLanguage, t, dir } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 transition-colors duration-200 dark:bg-dark-900 dark:text-gray-100 ${dir}`}>
      {/* Topbar */}
      <div className="bg-primary-950 text-primary-200 text-xs py-2 px-4 text-center font-medium dark:bg-black dark:text-gray-400">
        🎯 {t('freeShipping')} &nbsp;|&nbsp; {t('wholesaleHotline')} <a href="tel:29742267" className="underline hover:text-white">29742267</a>
      </div>

      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm dark:bg-dark-800 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-glow">
              <BuildingStorefrontIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-display font-bold text-base sm:text-xl text-gray-900 dark:text-white">Crea<span className="text-primary-600">Carte</span></span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <MagnifyingGlassIcon className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
              <input
                value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className={`w-full ${dir === 'rtl' ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all dark:bg-dark-700 dark:border-white/10 dark:text-white dark:focus:bg-dark-600`}
              />
            </div>
          </form>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/products" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${location.pathname === '/products' ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/40 dark:text-primary-400' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white'}`}>{t('products')}</Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 ms-auto">
            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="px-2 sm:px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all flex items-center gap-1 sm:gap-1.5 dark:border-white/10 dark:text-gray-350 dark:hover:bg-white/5 dark:hover:text-primary-400"
              aria-label="Change Language"
            >
              <GlobeAltIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="hidden sm:inline">{language === 'fr' ? 'العربية' : 'Français'}</span>
              <span className="inline sm:hidden">{language === 'fr' ? 'AR' : 'FR'}</span>
            </button>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="hidden sm:flex p-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-white/5" aria-label="Toggle Theme">
              {darkMode ? <SunIcon className="w-6 h-6 text-amber-500" /> : <MoonIcon className="w-6 h-6" />}
            </button>

            <Link to="/cart" className="relative p-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-primary-400">
              <ShoppingCartIcon className="w-6 h-6" />
              {count > 0 && <span className="absolute -top-0.5 -inline-end-0.5 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{count > 99 ? '99+' : count}</span>}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(v => !v)} className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:bg-white/5">
                  <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs dark:bg-primary-950 dark:text-primary-400">
                    {user.fullName?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block max-w-[100px] truncate">{user.fullName}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-gray-100 py-2 z-50 animate-slide-up dark:bg-dark-800 dark:border-white/10">
                    {user.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-200 dark:hover:bg-white/5" onClick={() => setUserMenuOpen(false)}>🛠️ {t('adminPanel')}</Link>}
                    <Link to="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-200 dark:hover:bg-white/5" onClick={() => setUserMenuOpen(false)}>👤 {t('myAccount')}</Link>
                    <hr className="my-1 border-gray-100 dark:border-white/5" />
                    <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30">🚪 {t('signOut')}</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-1.5 px-2.5 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-1" aria-label="Sign In">
                <UserIcon className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">{t('signIn')}</span>
              </Link>
            )}

            <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-150 dark:text-gray-300 dark:hover:bg-white/5">
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-3 dark:bg-dark-800 dark:border-white/5 animate-slide-up">
            <form onSubmit={handleSearch} className="mt-3">
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder={t('searchPlaceholder')} className="input" />
            </form>
            <Link to="/products" className="block py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200" onClick={() => setMobileOpen(false)}>{t('products')}</Link>
            
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">Settings</span>
              <div className="flex gap-2">
                <button onClick={toggleTheme} className="p-2 rounded-xl border border-gray-200 text-gray-600 dark:border-white/10 dark:text-gray-350" aria-label="Toggle Theme">
                  {darkMode ? <SunIcon className="w-5 h-5 text-amber-500" /> : <MoonIcon className="w-5 h-5" />}
                </button>
                <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')} className="px-3 py-1 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 dark:border-white/10 dark:text-gray-350">
                  {language === 'fr' ? 'العربية' : 'Français'}
                </button>
              </div>
            </div>

            {!user && <Link to="/login" className="block py-2.5 text-sm font-semibold text-primary-600" onClick={() => setMobileOpen(false)}>{t('signIn')}</Link>}
            {!user && <Link to="/register" className="block py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400" onClick={() => setMobileOpen(false)}>{t('register')}</Link>}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark-900 text-gray-400 mt-16 dark:bg-black dark:text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                <BuildingStorefrontIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">CreaCarte</span>
            </div>
            <p className="text-sm leading-relaxed">{t('descText')}</p>
            
            {/* Social Networks Links */}
            <div className="flex items-center gap-4 mt-6">
              <a href="https://www.instagram.com/b.m.w__drive/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-sm hover:scale-110" aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@sayari.anas" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-sm hover:scale-110" aria-label="TikTok">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.37-.28-.2-.53-.43-.77-.68v6.52c.02 2.1-.53 4.26-1.99 5.81-1.61 1.77-4.16 2.62-6.52 2.33-2.73-.25-5.32-2.22-6.04-4.89-.95-3.32.74-7.23 4.09-8.23.82-.26 1.71-.35 2.57-.29V13.6c-2.5-.27-5.06 1.4-5.58 3.86-.59 2.5 1.05 5.28 3.59 5.74 2.14.43 4.54-.77 5.09-2.91.13-.5.18-1.01.17-1.52V.02z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">{t('allProducts')}</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">{t('cart')}</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">{t('myAccount')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">{t('support')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="mailto:sayarianas@gmail.com" className="hover:text-white transition-colors flex items-center gap-1.5">{t('supportEmail')}</a></li>
              <li><a href="tel:29742267" className="hover:text-white transition-colors flex items-center gap-1.5">{t('hotlineNo')}</a></li>
              <li><a href="https://wa.me/29742267" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">🟢 WhatsApp: 29742267</a></li>
              <li><span className="block">{t('workingHours')}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">{t('whyChooseUs')}</h4>
            <ul className="space-y-2 text-sm">
              <li>✅ {t('verifiedSuppliers')}</li>
              <li>✅ {t('bulkDiscountPricing')}</li>
              <li>✅ {t('securePayments')}</li>
              <li>✅ {t('fastFulfillment')}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-gray-600">
          © 2026 CreaCarte. {t('rightsReserved')}
        </div>
      </footer>
    </div>
  );
}

