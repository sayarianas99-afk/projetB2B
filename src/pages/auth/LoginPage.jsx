import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BuildingStorefrontIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`${t('loginWelcome')}, ${user.fullName}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@wholesale.com', password: 'Admin@123' });
    else setForm({ email: 'client@wholesale.com', password: 'Client@123' });
  };

  return (
    <div className={`min-h-screen flex hero-gradient hero-mesh ${dir}`}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="CreaCarte" className="h-14 w-auto object-contain brightness-0 invert" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-4 leading-tight">{t('loginSubtitle')}</h1>
          <p className="text-primary-200 text-lg leading-relaxed mb-8">{t('descText')}</p>
          <div className="grid grid-cols-2 gap-4">
            {[t('businessesStat'), t('volumeStat'), t('shippingStat'), t('suppliersStat')].map(s => (
              <div key={s} className="bg-white/10 backdrop-blur rounded-xl p-3 text-sm font-medium">✓ {s}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 shadow-premium border border-white/50 hover:shadow-glow transition-all duration-300 animate-slide-up">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="CreaCarte" className="h-12 w-auto object-contain" />
          </div>

          <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">{t('loginWelcome')}</h2>
          <p className="text-gray-500 text-sm mb-6">{t('loginSubtitle')}</p>

          {/* Demo buttons
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => fillDemo('admin')} id="demo-admin-btn"
              className="py-2.5 px-3 text-xs font-bold rounded-xl border border-primary-200 text-primary-600 bg-white/50 hover:bg-primary-50 active:scale-95 transition-all">
              {t('adminDemoBtn')}
            </button>
            <button onClick={() => fillDemo('client')} id="demo-client-btn"
              className="py-2.5 px-3 text-xs font-bold rounded-xl border border-gray-200 text-gray-700 bg-white/50 hover:bg-gray-50 active:scale-95 transition-all">
              {t('clientDemoBtn')}
            </button>
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label text-gray-700">{t('emailInput')}</label>
              <input type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input focus:ring-primary-500 border-gray-300/80 bg-white/80 backdrop-blur-sm"
                placeholder="you@company.com" required />
            </div>
            <div>
              <label className="label text-gray-700">{t('passwordInput')}</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className={`input ${dir === 'rtl' ? 'pl-10 pr-4' : 'pr-10 pl-4'} focus:ring-primary-500 border-gray-300/80 bg-white/80 backdrop-blur-sm`}
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600`}>
                  {showPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 shadow-lg hover:shadow-glow">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? t('signingIn') : t('signIn')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('dontHaveAccount')}{' '}
            <Link to="/register" className="text-primary-650 font-bold hover:underline">{t('createAccountLink')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
