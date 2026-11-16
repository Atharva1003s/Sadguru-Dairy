import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsView({ onSettingsUpdated }) {
  const { language, t } = useLanguage();
  const [settings, setSettings] = useState({
    dairyName: 'सद्गुरू दुग्धालय (Sadguru Dairy)',
    dairyTagline: '१००% शुद्ध दूध - मंगल हो',
    ownerName: 'मालक / व्यवस्थापक',
    phone: '9822000000',
    defaultCowRate: 60,
    defaultBuffaloRate: 75,
    upiId: 'sadgurudairy@upi',
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [reseeding, setReseeding] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.settings) {
        setSettings(res.settings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setErr('');
    try {
      const res = await api.updateSettings(settings);
      if (res.success) {
        setMsg(language === 'mr' ? 'सेटिंग्ज यशस्वीरित्या जतन केल्या!' : 'Settings successfully saved!');
        if (onSettingsUpdated) onSettingsUpdated();
        setTimeout(() => setMsg(''), 4000);
      } else {
        setErr(res.message);
      }
    } catch (e) {
      setErr(language === 'mr' ? 'सर्व्हर त्रुटी' : 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleReseed = async () => {
    const confirmPrompt =
      language === 'mr'
        ? 'तुम्हाला मूळ रजिस्टर वहीतील सर्व ९४ ग्राहक पुन्हा रीसीड करायचे आहेत का?'
        : 'Are you sure you want to reseed all 94 original register customers from the notebook?';

    if (!window.confirm(confirmPrompt)) {
      return;
    }

    setReseeding(true);
    setMsg('');
    try {
      const res = await api.reseedCustomers();
      if (res.success) {
        setMsg(
          language === 'mr'
            ? 'रजिस्टर वहीतील ग्राहक यशस्वीरीत्या रीसीड केले!'
            : 'Register customers successfully reseeded!'
        );
        if (onSettingsUpdated) onSettingsUpdated();
      }
    } catch (e) {
      setErr('Reseed failed');
    } finally {
      setReseeding(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{t('settingsTitle')}</h3>
            <p className="text-xs text-slate-500">{t('settingsSub')}</p>
          </div>
        </div>

        {msg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{msg}</span>
          </div>
        )}

        {err && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('cowRateLabel')}
              </label>
              <input
                type="number"
                value={settings.defaultCowRate}
                onChange={(e) =>
                  setSettings({ ...settings, defaultCowRate: parseFloat(e.target.value) || 0 })
                }
                className="w-full py-2.5 px-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-emerald-950 font-black text-lg outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('buffaloRateLabel')}
              </label>
              <input
                type="number"
                value={settings.defaultBuffaloRate}
                onChange={(e) =>
                  setSettings({ ...settings, defaultBuffaloRate: parseFloat(e.target.value) || 0 })
                }
                className="w-full py-2.5 px-3 bg-indigo-50/50 border border-indigo-200 rounded-xl text-indigo-950 font-black text-lg outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('dairyNameLabel')}
            </label>
            <input
              type="text"
              value={settings.dairyName}
              onChange={(e) => setSettings({ ...settings, dairyName: e.target.value })}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('taglineLabel')}
            </label>
            <input
              type="text"
              value={settings.dairyTagline}
              onChange={(e) => setSettings({ ...settings, dairyTagline: e.target.value })}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('dairyPhoneLabel')}
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('upiIdLabel')}
              </label>
              <input
                type="text"
                value={settings.upiId}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                placeholder="e.g. 9822000000@ybl"
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? t('saving') : t('saveSettingsBtn')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reseed Section */}
      <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 text-amber-900">
        <h4 className="font-bold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{t('reseedTitle')}</span>
        </h4>
        <p className="text-xs text-amber-800 mt-1">
          {t('reseedSub')}
        </p>

        <button
          type="button"
          onClick={handleReseed}
          disabled={reseeding}
          className="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${reseeding ? 'animate-spin' : ''}`} />
          <span>{reseeding ? t('loading') : t('reseedBtn')}</span>
        </button>
      </div>
    </div>
  );
}
