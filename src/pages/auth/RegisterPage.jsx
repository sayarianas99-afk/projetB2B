import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BuildingStorefrontIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error(t('pwdLengthError'));
    setLoading(true);
    try {
      await register(form);
      toast.success(t('regSuccess'));
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex hero-gradient hero-mesh items-center justify-center p-6 ${dir}`}>
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 sm:p-10 animate-slide-up">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
            <BuildingStorefrontIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl">WholesaleHub</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">{t('registerTitle')}</h2>
        <p className="text-gray-500 text-sm mb-6">{t('registerSubtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">{t('fullNameInput')}</label>
              <input value={form.fullName} onChange={set('fullName')} className="input" required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t('emailInputReq')}</label>
              <input type="email" value={form.email} onChange={set('email')} className="input" required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t('passwordInputReq')}</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  className={`input ${dir === 'rtl' ? 'pl-10 pr-4' : 'pr-10 pl-4'}`} required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600`}>
                  {showPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">{t('phoneInput')}</label>
              <input value={form.phone} onChange={set('phone')} className="input" />
            </div>
            <div>
              <label className="label">{t('businessAddressInput')}</label>
              <input value={form.address} onChange={set('address')} className="input" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
            {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            {loading ? t('creatingAccount') : t('register')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">{t('signInLink')}</Link>
        </p>
      </div>
    </div>
  );
}
