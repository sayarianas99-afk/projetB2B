import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from '../../components/client/ProductCard';
import Pagination from '../../components/common/Pagination';
import { useLanguage } from '../../context/LanguageContext';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const { t, dir } = useLanguage();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'DESC';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (order) params.set('order', order);

    api.get(`/products?${params}`).then(r => {
      setProducts(r.data.data);
      setPagination(r.data.pagination);
    }).finally(() => setLoading(false));
  }, [search, category, sort, order, page]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.set('page', '1');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const sortOptions = [
    { value: 'createdAt-DESC', label: t('newestFirst') },
    { value: 'unitPrice-ASC', label: t('sortPriceLowHigh') },
    { value: 'unitPrice-DESC', label: t('sortPriceHighLow') },
    { value: 'name-ASC', label: t('sortNameAZ') },
  ];

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in ${dir}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title">{t('allProducts')}</h1>
        <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">
          {t('itemsCount', [pagination.total.toLocaleString()])}
        </p>
      </div>

      {/* Search + filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
          <input
            value={search} onChange={e => setParam('search', e.target.value)}
            placeholder={t('searchProductsPlaceholder')}
            className={`input ${dir === 'rtl' ? 'pr-9 pl-4' : 'pl-9 pr-4'} dark:bg-dark-700 dark:border-white/10 dark:text-white`}
          />
        </div>
        <button onClick={() => setFilterOpen(v => !v)} className="sm:hidden btn-secondary py-2.5 px-4 dark:bg-dark-800 dark:border-white/10 dark:text-primary-400">
          <AdjustmentsHorizontalIcon className="w-4 h-4" />{t('filters')}
        </button>
        <div className={`${filterOpen || 'hidden sm:flex'} flex flex-col sm:flex-row gap-3`}>
          <select value={category} onChange={e => setParam('category', e.target.value)} className="input w-auto dark:bg-dark-750 dark:border-white/10 dark:text-white">
            <option value="">{t('allCategories')}</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <select value={`${sort}-${order}`} onChange={e => {
            const [s, o] = e.target.value.split('-');
            const p = new URLSearchParams(searchParams);
            p.set('sort', s); p.set('order', o); p.set('page', '1');
            setSearchParams(p);
          }} className="input w-auto dark:bg-dark-750 dark:border-white/10 dark:text-white">
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {(search || category) && (
            <button onClick={clearFilters} className="btn-ghost py-2.5 px-3 text-sm gap-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
              <XMarkIcon className="w-4 h-4" /> {t('clear')}
            </button>
          )}
        </div>
      </div>

      {/* Active filters */}
      {(search || category) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {search && (
            <span className="badge bg-primary-100 text-primary-700 gap-1 dark:bg-primary-950/40 dark:text-primary-400">
              🔍 "{search}" 
              <button onClick={() => setParam('search', '')} className={`${dir === 'rtl' ? 'mr-1' : 'ml-1'} hover:text-red-600`}>×</button>
            </span>
          )}
          {category && (
            <span className="badge bg-primary-100 text-primary-700 gap-1 dark:bg-primary-950/40 dark:text-primary-400">
              📁 {categories.find(c => c.id == category)?.name} 
              <button onClick={() => setParam('category', '')} className={`${dir === 'rtl' ? 'mr-1' : 'ml-1'} hover:text-red-600`}>×</button>
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="card overflow-hidden dark:bg-dark-800 dark:border-white/5">
              <div className="shimmer aspect-square dark:bg-dark-700" />
              <div className="p-4 space-y-2">
                <div className="shimmer h-3 rounded w-1/3 dark:bg-dark-700" />
                <div className="shimmer h-4 rounded w-full dark:bg-dark-700" />
                <div className="shimmer h-4 rounded w-2/3 dark:bg-dark-700" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-semibold text-gray-700 text-lg mb-1 dark:text-gray-300">{t('noProductsFound')}</h3>
          <p className="text-gray-400 text-sm dark:text-gray-500">{t('noProductsFoundDesc')}</p>
          <button onClick={clearFilters} className="btn-primary mt-4 mx-auto">{t('clearFilters')}</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <Pagination page={page} pages={pagination.pages} onChange={p => setParam('page', p)} />
        </>
      )}
    </div>
  );
}
