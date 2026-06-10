import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

const EMOJI_OPTIONS = ['📦','⚡','🧵','🔧','🍎','🚗','💊','🏠','🎮','👜','💻','⚽','🌱','🧴','📎','🔩','🎨','📱'];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '📦' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/categories').then(r => setCategories(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openEdit = (cat) => {
    setEditId(cat.id);
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '📦' });
    setShowForm(true);
  };

  const openNew = () => {
    setEditId(null);
    setForm({ name: '', description: '', icon: '📦' });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Nom de catégorie requis');
    setSaving(true);
    try {
      if (editId) await api.put(`/categories/${editId}`, form);
      else await api.post('/categories', form);
      toast.success(`Catégorie ${editId ? 'mise à jour' : 'créée'} !`);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Échec de la sauvegarde');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer la catégorie "${name}" ?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Catégorie supprimée');
      load();
    } catch { toast.error('Échec de la suppression'); }
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Catégories</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{categories.length} catégorie(s)</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <PlusIcon className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="font-display font-bold text-lg dark:text-white">
                {editId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5">
                <XMarkIcon className="w-5 h-5 dark:text-gray-300" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="label">Nom de la catégorie *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="input" placeholder="ex: Électronique" required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="input" rows={2} placeholder="Brève description de la catégorie" />
              </div>
              <div>
                <label className="label">Icône</label>
                <div className="grid grid-cols-9 gap-1.5 p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                  {EMOJI_OPTIONS.map(emoji => (
                    <button key={emoji} type="button" onClick={() => setForm(p => ({ ...p, icon: emoji }))}
                      className={`text-xl p-1.5 rounded-lg transition-all ${form.icon === emoji ? 'bg-primary-100 dark:bg-primary-950 scale-125 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-2xl">{form.icon}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Icône sélectionnée</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckIcon className="w-4 h-4" />}
                  {saving ? 'Enregistrement...' : (editId ? 'Mettre à jour' : 'Créer')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center dark:bg-dark-700 dark:border-white/10 dark:text-gray-300">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-dark-700 rounded-2xl animate-pulse" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="card p-12 text-center text-gray-400 dark:bg-dark-800 dark:border-white/5">
          <div className="text-4xl mb-3">📂</div>
          <p className="dark:text-gray-500">Aucune catégorie. Créez votre première !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow dark:bg-dark-800 dark:border-white/5">
              <div className="w-14 h-14 bg-primary-50 dark:bg-primary-950/40 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                {cat.description && <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{cat.description}</p>}
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-1 block">/{cat.slug}</span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => openEdit(cat)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
