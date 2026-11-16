import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Milk,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Plus,
  Minus,
  Check,
  ChevronRight,
  User,
} from 'lucide-react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { MARATHI_DAYS, MARATHI_MONTHS, ENGLISH_MONTHS } from '../utils/marathiUtils';

export default function DailyQuickEntryView({
  customers,
  onRecordSuccess,
  onBatchFillToday,
}) {
  const { language, t, customerName } = useLanguage();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers.length > 0 ? customers[0]._id : ''
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [qty, setQty] = useState(1.0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const englishDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = language === 'mr' ? MARATHI_MONTHS : ENGLISH_MONTHS;
  const dayNames = language === 'mr' ? MARATHI_DAYS : englishDays;

  const filteredCustomers = (customers || []).filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      String(c.serialNo).includes(term) ||
      (c.nameMarathi && c.nameMarathi.includes(term)) ||
      (c.nameEnglish && c.nameEnglish.toLowerCase().includes(term))
    );
  });

  const selectedCustomerObj = (customers || []).find((c) => c._id === selectedCustomerId);

  useEffect(() => {
    if (selectedCustomerObj) {
      setQty(selectedCustomerObj.defaultQuantity || 1.0);
    }
  }, [selectedCustomerId]);

  const handleSave = async (amount = qty) => {
    if (!selectedCustomerId || !selectedDate) return;
    setSaving(true);
    setToastMsg('');
    try {
      const res = await api.recordMilk({
        customerId: selectedCustomerId,
        date: selectedDate,
        quantity: amount,
        notes,
      });

      if (res.success) {
        setToastMsg(
          language === 'mr'
            ? `${customerName(selectedCustomerObj)} यांचे ${amount}L दूध नोंदवले!`
            : `Recorded ${amount}L for ${customerName(selectedCustomerObj)}!`
        );
        if (onRecordSuccess) onRecordSuccess();

        // Automatically advance to the next customer in list for superfast delivery recording!
        const currentIndex = filteredCustomers.findIndex((c) => c._id === selectedCustomerId);
        if (currentIndex >= 0 && currentIndex < filteredCustomers.length - 1) {
          setSelectedCustomerId(filteredCustomers[currentIndex + 1]._id);
        }

        setTimeout(() => setToastMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const quickAmounts = [
    { amount: 0.5, label: t('halfLtr') },
    { amount: 1.0, label: t('oneLtr') },
    { amount: 1.5, label: t('oneHalfLtr') },
    { amount: 2.0, label: t('twoLtr') },
    { amount: 2.5, label: t('twoHalfLtr') },
    { amount: 3.0, label: t('threeLtr') },
    { amount: 0, label: t('holidayOption') },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
            <Milk className="w-6 h-6 text-blue-600" />
            <span>{t('dailyEntryTitle')}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('dailyEntrySub')}
          </p>
        </div>

        <button
          type="button"
          onClick={onBatchFillToday}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md shadow-amber-500/25 cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4 text-slate-900" />
          <span>{t('autoFillTodayBtn')}</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Entry Pad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Customer Selector */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              १. {t('selectDateLabel')}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full py-2 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              २. {t('selectCustomerLabel')}
            </label>
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchCustPlaceholder')}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
              {filteredCustomers.map((c) => {
                const isSelected = c._id === selectedCustomerId;
                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => setSelectedCustomerId(c._id)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-800 border-slate-100 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`font-mono text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        #{c.serialNo}
                      </span>
                      <span className="truncate">{customerName(c)}</span>
                    </div>
                    <span className={`text-[10px] font-semibold ${isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                      {c.defaultQuantity}L
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Fast Milk Action Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5">
          {selectedCustomerObj ? (
            <>
              {/* Selected Customer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl">
                    {selectedCustomerObj.milkType === 'buffalo' ? '🐃' : '🐄'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-900 font-extrabold px-2 py-0.5 rounded-lg">
                        #{selectedCustomerObj.serialNo}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {selectedCustomerObj.milkType === 'buffalo' ? t('buffaloMilk') : t('cowMilk')}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mt-0.5">
                      {customerName(selectedCustomerObj)}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-semibold">{t('defaultDaily')}</div>
                  <div className="text-lg font-black text-blue-700">
                    {selectedCustomerObj.defaultQuantity} {t('litres')}
                  </div>
                </div>
              </div>

              {/* 1-Tap Quick Amount Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2.5">
                  ३. {t('howMuchGiven')}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {quickAmounts.map(({ amount: a, label }) => {
                    const isSelected = qty === a;
                    const isZero = a === 0;
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => {
                          setQty(a);
                          handleSave(a);
                        }}
                        className={`py-3.5 px-3 rounded-2xl font-bold text-sm transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer border ${
                          isSelected
                            ? isZero
                              ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-200 scale-102'
                              : 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-200 scale-102'
                            : isZero
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <span className="text-base font-black">{isZero ? '0 L' : `${a} L`}</span>
                        <span className="text-[10px] font-normal opacity-90">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Quantity Adjuster */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-600 pl-2">{t('otherQty')}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(0, parseFloat((qty - 0.5).toFixed(1))))}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={qty}
                      onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
                      className="w-16 py-1 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQty(parseFloat((qty + 0.5).toFixed(1)))}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('notePlaceholder')}
                    className="w-full text-xs bg-transparent outline-none px-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleSave(qty)}
                    disabled={saving}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {saving ? t('saving') : t('save')}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              {t('noCustomerFound')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
