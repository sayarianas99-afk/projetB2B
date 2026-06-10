import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, TagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { t, dir } = useLanguage();
  const image = product.images?.[0]?.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`${product.name} ${t('regSuccess') ? 'added to cart!' : ''}`); // wait, we can just toast a success message
  };

  return (
    <Link to={`/products/${product.id}`} className="card-hover group block dark:bg-dark-800 dark:border-white/5">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-dark-700 aspect-square">
        <img
          src={image} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = `https://picsum.photos/seed/${product.id + 100}/400/400`; }}
        />
        {product.isFeatured && (
          <span className={`absolute top-2.5 ${dir === 'rtl' ? 'right-2.5' : 'left-2.5'} badge bg-accent-500 text-white text-xs`}>{t('featured')}</span>
        )}
        {product.stock <= 10 && product.stock > 0 && (
          <span className={`absolute top-2.5 ${dir === 'rtl' ? 'left-2.5' : 'right-2.5'} badge bg-red-500 text-white text-xs`}>{t('lowStock')}</span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="badge bg-red-600 text-white font-bold">{t('outOfStock')}</span>
          </div>
        )}
        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product, 1);
              toast.success(`${product.name} +1`);
            }}
            disabled={product.stock === 0}
            className="w-full py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            {t('quickAdd')}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 text-start">
        <div className="flex items-center gap-1.5 mb-1.5">
          <TagIcon className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium truncate">{product.category?.name}</span>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{product.name}</h3>
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-xs text-gray-400 mb-0.5">{t('unitPrice')}</div>
            <div className="font-bold text-gray-900 dark:text-white">${parseFloat(product.unitPrice).toFixed(2)}</div>
          </div>
          <div className="text-end">
            <div className="text-xs text-accent-500 font-medium mb-0.5">{product.wholesaleMinQty}+ {t('unit')}</div>
            <div className="font-bold text-accent-500">${parseFloat(product.wholesalePrice).toFixed(2)}</div>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <span className="text-xs text-gray-400">{t('stock')} <span className={`font-semibold ${product.stock > 100 ? 'text-green-600' : product.stock > 10 ? 'text-yellow-600' : 'text-red-600'}`}>{product.stock.toLocaleString()}</span></span>
          <span className="text-xs text-gray-450 dark:text-gray-400">{t('sku')} {product.sku}</span>
        </div>
      </div>
    </Link>
  );
}
