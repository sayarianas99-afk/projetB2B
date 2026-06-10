
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', unitPrice: '', wholesalePrice: '', wholesaleMinQty: '100',
    stock: '', categoryId: '', sku: '', isFeatured: false, isActive: true,
  });

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data));
    if (isEdit) {
      api.get(`/products/${id}`).then(r => {
        const p = r.data.data;
        setForm({
          name: p.name || '', description: p.description || '',
          unitPrice: p.unitPrice, wholesalePrice: p.wholesalePrice,
          wholesaleMinQty: p.wholesaleMinQty, stock: p.stock,
          categoryId: p.categoryId, sku: p.sku || '',
          isFeatured: p.isFeatured, isActive: p.isActive,
        });
        if (p.images?.length) {
          setImagePreviews(p.images.map(img => img.imageUrl));
        }
      });
    }
  }, [id]);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const setCheck = k => e => setForm(p => ({ ...p, [k]: e.target.checked }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setImagePreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removePreview = (i) => {
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
    setImageFiles(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.unitPrice || !form.wholesalePrice || !form.categoryId || !form.stock) {
      return toast.error('Veuillez remplir tous les champs obligatoires');
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      imageFiles.forEach(f => fd.append('images', f));

      if (isEdit) await api.put(`/admin/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      toast.success(`Produit ${isEdit ? 'mis à jour' : 'créé'} avec succès !`);
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Échec de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin/products')} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="page-title">{isEdit ? 'Modifier le produit' : 'Ajouter un produit'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="card p-6 space-y-4 dark:bg-dark-800 dark:border-white/5">
          <h2 className="section-title">Informations du produit</h2>
          <div>
            <label className="label">Nom du produit *</label>
            <input value={form.name} onChange={set('name')} className="input" placeholder="ex: Bande LED industrielle 5m" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">SKU</label>
              <input value={form.sku} onChange={set('sku')} className="input" placeholder="LED-001" />
            </div>
            <div>
              <label className="label">Catégorie *</label>
              <select value={form.categoryId} onChange={set('categoryId')} className="input" required>
                <option value="">Sélectionner une catégorie...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={set('description')} className="input" rows={4} placeholder="Description détaillée du produit..." />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card p-6 space-y-4 dark:bg-dark-800 dark:border-white/5">
          <h2 className="section-title">Prix & Inventaire</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Prix unitaire ($) *</label>
              <input type="number" step="0.01" min="0" value={form.unitPrice} onChange={set('unitPrice')} className="input" placeholder="12.99" required />
            </div>
            <div>
              <label className="label">Prix de gros ($) *</label>
              <input type="number" step="0.01" min="0" value={form.wholesalePrice} onChange={set('wholesalePrice')} className="input" placeholder="9.99" required />
            </div>
            <div>
              <label className="label">Qté min. gros *</label>
              <input type="number" min="1" value={form.wholesaleMinQty} onChange={set('wholesaleMinQty')} className="input" placeholder="100" />
            </div>
            <div>
              <label className="label">Stock *</label>
              <input type="number" min="0" value={form.stock} onChange={set('stock')} className="input" placeholder="1000" required />
            </div>
          </div>
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={setCheck('isFeatured')} className="w-4 h-4 rounded text-primary-600 accent-primary-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Produit en vedette</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={setCheck('isActive')} className="w-4 h-4 rounded text-primary-600 accent-primary-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Actif (visible)</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 space-y-4 dark:bg-dark-800 dark:border-white/5">
          <h2 className="section-title">Images du produit</h2>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all">
            <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Cliquer pour télécharger (max 10, 5 Mo chacune)</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">JPG, PNG, WebP supportés</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
          </label>
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-700">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePreview(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                  {i === 0 && <div className="absolute bottom-1 left-1 text-xs bg-primary-600 text-white px-1.5 rounded font-medium">Principal</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le produit'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary dark:bg-dark-700 dark:border-white/10 dark:text-gray-300">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
