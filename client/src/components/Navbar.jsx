import React from 'react';
import { Milk, User, LogOut, ShieldCheck, Calendar, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MARATHI_DAYS, MARATHI_MONTHS, ENGLISH_MONTHS } from '../utils/marathiUtils';

export default function Navbar({ user, onLogout }) {
  const { language, toggleLanguage, t, customerName } = useLanguage();
  const today = new Date();

  const englishDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = language === 'mr' ? MARATHI_DAYS[today.getDay()] : englishDays[today.getDay()];
  const monthName = language === 'mr' ? MARATHI_MONTHS[today.getMonth()] : ENGLISH_MONTHS[today.getMonth()];
  const dateStr = `${dayName}, ${today.getDate()} ${monthName} ${today.getFullYear()}`;

  return (
    <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
            <Milk className="w-6 h-6 text-sky-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wide bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                {t('dairyName')}
              </h1>
              <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold px-2 py-0.5 rounded-full">
                {t('dairySub')}
              </span>
            </div>
            <p className="text-[11px] text-blue-200/80 font-medium tracking-wider">
              {t('dairyTagline')}
            </p>
          </div>
        </div>

        {/* Date & Language Toggle & User Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Date Display */}
          <div className="hidden lg:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 text-xs text-blue-100">
            <Calendar className="w-3.5 h-3.5 text-sky-300" />
            <span>{dateStr}</span>
          </div>

          {/* Language Switcher Pill */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-gradient-to-r from-sky-400/20 to-blue-400/20 hover:from-sky-400/30 hover:to-blue-400/30 px-3 py-1.5 rounded-xl border border-sky-300/30 text-xs font-bold text-sky-200 hover:text-white transition-all cursor-pointer shadow-sm"
            title="भाषा बदला / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-sky-300" />
            <span className="font-bold">{language === 'mr' ? 'English' : 'मराठी'}</span>
          </button>

          {/* User Status & Actions */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-200 flex items-center justify-center font-bold">
                  {user.role === 'admin' ? (
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-sky-300" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{customerName(user)}</span>
                    {user.serialNo ? (
                      <span className="bg-white/20 text-[10px] px-1 py-0.2 rounded font-mono">
                        #{user.serialNo}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-[10px] text-sky-200/90 font-medium">
                    {user.role === 'admin' ? (
                      <span className="text-amber-300 font-semibold">{t('adminRole')}</span>
                    ) : (
                      <span>
                        {user.milkType === 'buffalo' ? t('buffaloMilk') : t('cowMilk')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title={t('logout')}
                className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold border border-red-400/30 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
