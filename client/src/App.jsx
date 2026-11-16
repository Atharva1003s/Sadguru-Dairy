import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginView from './pages/LoginView';
import AdminDashboard from './pages/AdminDashboard';
import { api } from './api/client';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { t } = useLanguage();

  // Check existing session on load
  useEffect(() => {
    checkAuthSession();
  }, []);

  const checkAuthSession = async () => {
    const token = localStorage.getItem('sadguru_dairy_token') || localStorage.getItem('nilesh_dairy_token');
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.user && res.user.role === 'admin') {
        setCurrentUser(res.user);
      } else {
        localStorage.removeItem('sadguru_dairy_token');
        localStorage.removeItem('nilesh_dairy_token');
        setCurrentUser(null);
      }
    } catch (e) {
      console.error('Session check failed:', e);
      localStorage.removeItem('sadguru_dairy_token');
      localStorage.removeItem('nilesh_dairy_token');
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('sadguru_dairy_token');
    localStorage.removeItem('nilesh_dairy_token');
    setCurrentUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-sm font-bold tracking-wider">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-['Mukta',sans-serif]">
      {/* Top Header */}
      <Navbar user={currentUser} onLogout={handleLogout} />

      {/* Main Content Area - Unified Dairy Operator Dashboard */}
      <main className="flex-1 pb-12">
        {!currentUser ? (
          <LoginView onLoginSuccess={handleLoginSuccess} />
        ) : (
          <AdminDashboard user={currentUser} />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} {t('footerRights')}</span>
          <span className="text-slate-500">{t('footerSecure')}</span>
        </div>
      </footer>
    </div>
  );
}
