import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { resolveImageUrl } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShoppingCartIcon, MinusIcon, PlusIcon, TagIcon, ArchiveBoxIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(r => {
      setProduct(r.data.data);
      setLoading(false);
    }).catch(() => { navigate('/products'); });
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="shimmer rounded-2xl aspect-square dark:bg-dark-700" />
      <div className="space-y-4">{[1,2,3,4,5].map(i => <div key={i} className="shimmer h-6 rounded dark:bg-dark-700" />)}</div>
    </div>
  );
  if (!product) return null;

  const images = product.images?.length > 0
    ? product.images.map(img => ({ ...img, imageUrl: resolveImageUrl(img.imageUrl) }))
    : [{ imageUrl: `https://picsum.photos/seed/${product.id}/600/600` }];
  const isWholesale = qty >= product.wholesaleMinQty;
  const price = isWholesale ? parseFloat(product.wholesalePrice) : parseFloat(product.unitPrice);
  const total = price * qty;

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success(`${qty}× ${product.name} ✓`);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in`}>
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors dark:text-gray-400 dark:hover:text-primary-400">
        <ArrowLeftIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        {t('backToProducts')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="card overflow-hidden aspect-square dark:bg-dark-800 dark:border-white/5">
            <img src={images[activeImg]?.imageUrl} alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = `https://picsum.photos/seed/${product.id + 99}/600/600`; }} />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-primary-500 shadow-glow' : 'border-gray-200 hover:border-primary-300 dark:border-white/10'}`}>
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover"
                    onError={e => { e.target.src = `https://picsum.photos/seed/${product.id + i}/100/100`; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400">
                <TagIcon className={`w-3 h-3 ${dir === 'rtl' ? 'ms-1' : 'me-1'}`} />{product.category?.name}
              </span>
              {product.isFeatured && <span className="badge bg-accent-100 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400">⭐ {t('featured')}</span>}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
            <p className="text-gray-500 text-xs font-mono dark:text-gray-400">{t('sku')} {product.sku}</p>
          </div>

          {/* Pricing */}
          <div className="card p-4 sm:p-5 bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/30 dark:to-dark-800 dark:border-white/5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all ${!isWholesale ? 'border-primary-500 bg-white shadow-sm dark:bg-dark-700' : 'border-gray-200 dark:border-white/10'}`}>
                <div className="text-xs text-gray-500 font-medium mb-1 dark:text-gray-400">{t('unitPrice')}</div>
                <div className="font-display text-base sm:text-xl font-bold text-gray-900 dark:text-white">${parseFloat(product.unitPrice).toFixed(2)}</div>
                <div className="text-xs text-gray-400">{t('unit')}</div>
              </div>
              <div className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all ${isWholesale ? 'border-accent-400 bg-white shadow-sm dark:bg-dark-700' : 'border-gray-200 dark:border-white/10'}`}>
                <div className="text-xs text-accent-500 font-semibold mb-1">🔥 {t('wholesalePrice')}</div>
                <div className="font-display text-base sm:text-xl font-bold text-accent-600 dark:text-accent-400">${parseFloat(product.wholesalePrice).toFixed(2)}</div>
                <div className="text-xs text-gray-400">{product.wholesaleMinQty}+ {t('unit')}</div>
              </div>
            </div>
            {isWholesale && (
              <div className="mt-3 p-2 bg-accent-50 rounded-lg text-xs text-accent-700 font-medium text-center dark:bg-accent-950/30 dark:text-accent-400">
                🎉 {t('wholesaleApplied')} {t('savePerUnit', [`$${((parseFloat(product.unitPrice) - parseFloat(product.wholesalePrice))).toFixed(2)}`])}
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-3">
            <ArchiveBoxIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {t('stock')} <strong className={product.stock > 100 ? 'text-green-600' : product.stock > 10 ? 'text-yellow-600' : 'text-red-600'}>{product.stock.toLocaleString()}</strong>
            </span>
          </div>

          {/* Quantity */}
          <div>
            <label className="label">{t('quantity')}</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden dark:border-white/10 w-fit">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <MinusIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <input type="number" value={qty} min={1} max={product.stock}
                  onChange={e => setQty(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-20 text-center py-2.5 border-x border-gray-200 focus:outline-none text-sm font-bold dark:border-white/10 dark:bg-dark-700 dark:text-white" />
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <PlusIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {qty >= product.wholesaleMinQty
                  ? <span className="text-accent-500 font-semibold">✓ {t('wholesaleApplied')}</span>
                  : <span>{t('wholesaleDiscountStarts')} {product.wholesaleMinQty - qty} {t('unit')}</span>}
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-white/5">
            <span className="text-sm text-gray-600 font-medium dark:text-gray-400">{t('subtotal')}</span>
            <span className="font-display text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="btn-primary flex-1 justify-center py-3.5">
              <ShoppingCartIcon className="w-5 h-5" />
              {product.stock === 0 ? t('outOfStock') : t('addToCart')}
            </button>
            <Link to="/cart" className="btn-secondary py-3.5 px-5 dark:bg-dark-800 dark:border-white/10 dark:text-primary-400">
              {t('cart')} <ArrowRightIcon className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          {/* Description */}
          {product.description && (
            <div className="pt-4 border-t border-gray-100 dark:border-white/5">
              <h3 className="font-semibold text-gray-800 mb-2 dark:text-gray-200">{t('category')}</h3>
              <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
