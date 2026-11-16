import React, { useState } from 'react';
import { Milk, ShieldCheck, KeyRound, ChevronRight, AlertCircle, Sparkles, Lock } from 'lucide-react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function LoginView({ onLoginSuccess }) {
  const { language, t } = useLanguage();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.adminLogin(username, password);
      if (res.success && res.token) {
        localStorage.setItem('sadguru_dairy_token', res.token);
        localStorage.setItem('nilesh_dairy_token', res.token);
        onLoginSuccess(res.user);
      } else {
        setError(res.message || (language === 'mr' ? 'चुकीचा युजरनेम किंवा पासवर्ड' : 'Invalid username or password'));
      }
    } catch (err) {
      setError(language === 'mr' ? 'सर्व्हरशी संपर्क होऊ शकला नाही' : 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header Illustration */}
        <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 p-7 text-white text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="inline-flex p-3.5 bg-white/15 rounded-2xl mb-3 backdrop-blur-md shadow-inner border border-white/20">
            <Milk className="w-10 h-10 text-sky-200" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide">{t('dairyName')}</h2>
          <p className="text-xs text-blue-200 mt-1 font-medium">
            {t('appDesc')}
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-sky-200">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>{t('operatorLoginTitle')}</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-7">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('adminUsernameLabel')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('adminPasswordLabel')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                className="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
                required
              />
            </div>

            {/* Quick Demo Credentials Fill */}
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('admin');
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('quickAdminCreds')}</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>{t('loading')}</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{t('operatorLoginBtn')}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
