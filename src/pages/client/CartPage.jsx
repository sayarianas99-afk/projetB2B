import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { resolveImageUrl } from '../../utils/api';
import { TrashIcon, MinusIcon, PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const items = useCart().items;
  const updateQuantity = useCart().updateQuantity;
  const removeItem = useCart().removeItem;
  const total = useCart().total;
  const clearCart = useCart().clearCart;
  const navigate = useNavigate();
  const { t, dir } = useLanguage();

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-2 dark:text-white">{t('cartIsEmpty')}</h2>
      <p className="text-gray-500 mb-6 dark:text-gray-400">{t('heroDesc')}</p>
      <Link to="/products" className="btn-primary mx-auto">{t('shopNow')}</Link>
    </div>
  );

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">
          {t('shoppingCart')} <span className="text-gray-400 font-normal text-lg">({items.length})</span>
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
          <TrashIcon className="w-4 h-4" /> {t('clear')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.productId} className="card p-4 flex gap-4 items-start dark:bg-dark-800 dark:border-white/5">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-700 flex-shrink-0">
                <img src={resolveImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover"
                  onError={e => { e.target.src = `https://picsum.photos/seed/${item.productId}/100/100`; }} />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId}`}
                  className="font-semibold text-gray-900 dark:text-white text-sm hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 leading-snug">
                  {item.name}
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-primary-600 font-bold dark:text-primary-400">${item.price.toFixed(2)}</span>
                  {item.quantity >= item.wholesaleMinQty && (
                    <span className="badge bg-accent-100 text-accent-600 text-xs dark:bg-accent-950/40 dark:text-accent-400">
                      {t('wholesaleApplied')}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden dark:border-white/10 w-fit">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-50 dark:hover:bg-white/5">
                      <MinusIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <input type="number" value={item.quantity} min={1}
                      onChange={e => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                      className="w-14 text-center py-1 text-sm font-bold border-x border-gray-200 focus:outline-none dark:border-white/10 dark:bg-dark-700 dark:text-white" />
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-50 dark:hover:bg-white/5">
                      <PlusIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <span className="font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.productId)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 transition-colors">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24 dark:bg-dark-800 dark:border-white/5">
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-4">{t('orderSummary')}</h2>
            <div className="space-y-2 text-sm mb-4">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="truncate max-w-[160px]">{item.name} ×{item.quantity}</span>
                  <span className="font-medium dark:text-gray-300">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-white/5 pt-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300">{t('subtotal')}</span>
                <span className="font-display text-xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full justify-center py-3">
              {t('proceedToCheckout')} <ArrowRightIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </button>
            <Link to="/products" className="btn-ghost w-full justify-center mt-2 text-sm dark:text-gray-400 dark:hover:text-white">
              {t('continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
