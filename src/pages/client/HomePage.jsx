import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from '../../components/client/ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import useScrollReveal from '../../utils/useScrollReveal';
import { MagnifyingGlassIcon, ArrowRightIcon, TruckIcon, ShieldCheckIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  useScrollReveal();

useEffect(() => {
  api.get('/products?featured=true&limit=8')
    .then(r => {
      console.log('PRODUCTS RESPONSE', r.data);
      setFeatured(r?.data?.data ?? []);
    })
    .catch(err => {
      console.error(err);
      setFeatured([]);
    });

  api.get('/categories')
    .then(r => {
      console.log('CATEGORIES RESPONSE', r.data);
      setCategories(r?.data?.data ?? []);
    })
    .catch(err => {
      console.error(err);
      setCategories([]);
    });
}, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  const stats = [
    { icon: UserGroupIcon, label: t('businessesStat'), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { icon: CurrencyDollarIcon, label: t('volumeStat'), color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/40' },
    { icon: TruckIcon, label: t('shippingStat'), color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' },
    { icon: ShieldCheckIcon, label: t('suppliersStat'), color: 'text-accent-500 dark:text-accent-400', bg: 'bg-orange-50 dark:bg-orange-950/40' },
  ];
      console.log('featured', featured);
      console.log('categories', categories);
      console.log('dir', dir);
      console.log('t', typeof t);
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="hero-gradient hero-mesh min-h-[460px] sm:min-h-[520px] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary-400 blur-3xl animate-float" />
          <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full bg-accent-400 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-primary-200 text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
              {t('trustedBy')}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t('heroTitle1')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-400">{t('heroTitle2')}</span>
            </h1>
            <p className="text-primary-200 text-base sm:text-lg mb-8 leading-relaxed">
              {t('heroDesc')}
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl w-full">
              <div className="relative w-full">
                <MagnifyingGlassIcon className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchPlaceholder')}
                  className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-lg`} />
              </div>
              <button type="submit" className="w-full sm:w-auto btn-accent py-3.5 px-6 rounded-2xl text-sm font-bold justify-center">{t('searchBtn')}</button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 dark:bg-dark-800 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, label, color, bg }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 reveal">
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-full opacity-10">
            <div className="w-full h-full bg-gradient-to-l from-white rounded-full transform translate-x-1/2" />
          </div>
          <div className="flex-1 text-white relative z-10 text-start">
            <span className="inline-block px-3 py-1 bg-accent-500 text-white text-xs font-bold rounded-full mb-2">{t('limitedOffer')}</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">{t('unlockWholesale')}</h2>
            <p className="text-primary-200">{t('unlockDesc')}</p>
          </div>
          <Link to="/products" className="flex-shrink-0 btn-accent gap-2 py-3 px-6 rounded-2xl font-bold">
            {t('shopNow')} <ArrowRightIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 reveal">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{t('shopByCategory')}</h2>
            <Link to="/products" className="text-primary-600 text-sm font-semibold hover:underline flex items-center gap-1 dark:text-primary-400">
              {t('allCategories')} <ArrowRightIcon className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.id}`}
                className="card-hover p-4 flex flex-col items-center justify-center gap-3 text-center group dark:bg-dark-800 dark:border-white/5 h-full">
                <span className="text-3xl sm:text-4xl transition-transform duration-300 group-hover:scale-110 flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-50 dark:bg-dark-700 shadow-sm">{cat.icon}</span>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-primary-600 transition-colors dark:text-gray-300 dark:group-hover:text-primary-400 leading-snug line-clamp-1">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 mb-4 reveal">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{t('featuredProducts')}</h2>
              <p className="text-gray-500 text-sm mt-0.5 dark:text-gray-400">{t('featuredDesc')}</p>
            </div>
            <Link to="/products" className="btn-secondary py-2 px-4 text-sm dark:bg-dark-800 dark:border-white/10 dark:text-primary-400 dark:hover:bg-white/5">
              {t('viewAll')} <ArrowRightIcon className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Trust section */}
      <section className="bg-gray-900 mt-16 py-12 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-2">{t('whyChooseUsHeading')}</h2>
          <p className="text-gray-400 mb-8">{t('whyChooseUsSub')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🔒', title: t('securePaymentsTitle'), desc: t('securePaymentsDesc') },
              { icon: '📦', title: t('bulkFulfillmentTitle'), desc: t('bulkFulfillmentDesc') },
              { icon: '🤝', title: t('dedicatedSupportTitle'), desc: t('dedicatedSupportDesc') },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
