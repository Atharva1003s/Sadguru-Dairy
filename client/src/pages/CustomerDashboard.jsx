import React, { useState, useEffect } from 'react';
import {
  Milk,
  Calendar,
  CheckCircle2,
  Clock,
  IndianRupee,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  KeyRound,
  FileText,
  Sparkles,
  Check,
} from 'lucide-react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
  MARATHI_MONTHS,
  ENGLISH_MONTHS,
  MARATHI_DAYS,
  formatCurrency,
} from '../utils/marathiUtils';

export default function CustomerDashboard({ user }) {
  const { language, t, customerName } = useLanguage();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Today entry states
  const [todayQty, setTodayQty] = useState(user.defaultQuantity || 1.0);
  const [todayNotes, setTodayNotes] = useState('');
  const [savingToday, setSavingToday] = useState(false);

  // Past day edit modal state
  const [selectedDayToEdit, setSelectedDayToEdit] = useState(null);
  const [editDayQty, setEditDayQty] = useState(1.0);
  const [editDayNotes, setEditDayNotes] = useState('');

  // PIN change state
  const [showPinModal, setShowPinModal] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');
  const [pinErr, setPinErr] = useState('');

  const englishDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = language === 'mr' ? MARATHI_MONTHS : ENGLISH_MONTHS;
  const dayNames = language === 'mr' ? MARATHI_DAYS : englishDays;

  useEffect(() => {
    loadMonthlyData();
  }, [currentYear, currentMonth]);

  const loadMonthlyData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getCustomerEntries(user._id, currentYear, currentMonth);
      if (res.success) {
        setData(res);
        if (res.todayEntry) {
          setTodayQty(res.todayEntry.quantity);
          setTodayNotes(res.todayEntry.notes || '');
        } else {
          setTodayQty(user.defaultQuantity || 1.0);
          setTodayNotes('');
        }
      } else {
        setError(res.message || (language === 'mr' ? 'माहिती लोड करण्यात अडचण आली' : 'Failed to load data'));
      }
    } catch (err) {
      setError(language === 'mr' ? 'सर्व्हरशी संपर्क होऊ शकला नाही' : 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEntry = async (dateStr, qty, notes = '') => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.recordMilk({
        customerId: user._id,
        date: dateStr,
        quantity: qty,
        notes,
      });

      if (res.success) {
        setSuccessMsg(
          language === 'mr'
            ? res.message || 'दूध यशस्वीरित्या नोंदवले!'
            : `Milk (${qty}L) successfully recorded!`
        );
        await loadMonthlyData();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setError(res.message || (language === 'mr' ? 'नोंद जतन होऊ शकली नाही' : 'Could not save entry'));
      }
    } catch (err) {
      setError(language === 'mr' ? 'सर्व्हर त्रुटी' : 'Server error');
    }
  };

  const handleSaveToday = async (qty = todayQty) => {
    setSavingToday(true);
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    await handleSaveEntry(dateStr, qty, todayNotes);
    setSavingToday(false);
  };

  const handleSavePastDay = async () => {
    if (!selectedDayToEdit) return;
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(selectedDayToEdit).padStart(2, '0')}`;
    await handleSaveEntry(dateStr, editDayQty, editDayNotes);
    setSelectedDayToEdit(null);
  };

  const handlePinChange = async (e) => {
    e.preventDefault();
    setPinErr('');
    setPinMsg('');
    try {
      const res = await api.changePin(oldPin, newPin);
      if (res.success) {
        setPinMsg(language === 'mr' ? 'पिन यशस्वीरित्या बदलला गेला!' : 'PIN successfully updated!');
        setTimeout(() => {
          setShowPinModal(false);
          setOldPin('');
          setNewPin('');
          setPinMsg('');
        }, 1500);
      } else {
        setPinErr(res.message || (language === 'mr' ? 'पिन बदलणे अयशस्वी' : 'Failed to change PIN'));
      }
    } catch (err) {
      setPinErr(language === 'mr' ? 'सर्व्हर त्रुटी' : 'Server error');
    }
  };

  const changeMonth = (delta) => {
    let newM = currentMonth + delta;
    let newY = currentYear;
    if (newM > 12) {
      newM = 1;
      newY += 1;
    } else if (newM < 1) {
      newM = 12;
      newY -= 1;
    }
    setCurrentMonth(newM);
    setCurrentYear(newY);
  };

  const isCurrentMonth =
    today.getFullYear() === currentYear && today.getMonth() + 1 === currentMonth;
  const isTodayRecorded = data && data.todayEntry !== null && data.todayEntry !== undefined;

  // Calculate statistics
  let totalDaysTaken = 0;
  let totalDaysAbsent = 0;
  if (data && data.entriesByDay) {
    Object.values(data.entriesByDay).forEach((e) => {
      if (e.quantity > 0) totalDaysTaken++;
      else if (e.quantity === 0) totalDaysAbsent++;
    });
  }

  const quickAmounts = [
    { qty: 0.5, label: t('halfLtr') },
    { qty: 1.0, label: t('oneLtr') },
    { qty: 1.5, label: t('oneHalfLtr') },
    { qty: 2.0, label: t('twoLtr') },
    { qty: 2.5, label: t('twoHalfLtr') },
    { qty: 3.0, label: t('threeLtr') },
    { qty: 0, label: t('holidayOption') },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Customer Header Card */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 text-3xl shadow-inner">
            {user.milkType === 'buffalo' ? '🐃' : '🐄'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-900 font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
                {t('regNo')} #{user.serialNo}
              </span>
              <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {user.milkType === 'buffalo' ? t('buffaloMilk') : t('cowMilk')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              {customerName(user)}
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              {t('defaultDaily')} <strong>{user.defaultQuantity || 1} {t('litres')}</strong> &bull; {t('rate')}: ₹
              {data?.customer?.rate || (user.milkType === 'buffalo' ? 75 : 60)}/{t('litres')}
            </p>
          </div>
        </div>

        {/* Change PIN Button */}
        <button
          onClick={() => setShowPinModal(true)}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl text-xs font-bold border border-white/20 cursor-pointer transition-all"
        >
          <KeyRound className="w-3.5 h-3.5 text-sky-300" />
          <span>{t('changePin')}</span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center gap-2.5 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-red-800 text-sm font-semibold flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TODAY'S MILK ENTRY WIDGET */}
      {isCurrentMonth && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 pointer-events-none"></div>

          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                {today.getDate()}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                  {t('todayMilkRecord')}
                </h3>
                <p className="text-xs text-slate-500">
                  {dayNames[today.getDay()]}, {today.getDate()} {monthNames[today.getMonth()]}{' '}
                  {today.getFullYear()}
                </p>
              </div>
            </div>

            {isTodayRecorded ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>{t('alreadyRecorded')}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                <span>{t('notRecordedYet')}</span>
              </span>
            )}
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                {t('howMuchTakenToday')}
              </label>

              {/* 1-Tap Quick Quantity Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {quickAmounts.map(({ qty: q, label }) => {
                  const isSelected = todayQty === q;
                  const isZero = q === 0;
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setTodayQty(q);
                        handleSaveToday(q);
                      }}
                      className={`py-3 px-2 rounded-2xl font-bold text-sm transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer border ${
                        isSelected
                          ? isZero
                            ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-200 scale-105'
                            : 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-200 scale-105'
                          : isZero
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      <span>{isZero ? '0 L' : `${q} L`}</span>
                      <span className="text-[10px] font-normal opacity-90">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Adjuster & Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600 pl-2">{t('otherQty')}</span>
                <div className="flex items-center gap-1 ml-auto">
                  <button
                    type="button"
                    onClick={() => setTodayQty(Math.max(0, parseFloat((todayQty - 0.5).toFixed(1))))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={todayQty}
                    onChange={(e) => setTodayQty(parseFloat(e.target.value) || 0)}
                    className="w-16 py-1 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setTodayQty(parseFloat((todayQty + 0.5).toFixed(1)))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <input
                  type="text"
                  value={todayNotes}
                  onChange={(e) => setTodayNotes(e.target.value)}
                  placeholder={t('notePlaceholder')}
                  className="w-full text-xs bg-transparent outline-none px-2"
                />
                <button
                  type="button"
                  onClick={() => handleSaveToday()}
                  disabled={savingToday}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {savingToday ? t('saving') : t('save')}
                </button>
              </div>
            </div>

            {/* Current Recorded Status Info */}
            {isTodayRecorded && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
                <span className="font-semibold">
                  {t('currentEntryRecorded')} <strong>{data.todayEntry.quantity} {t('litres')}</strong>{' '}
                  {data.todayEntry.quantity === 0 ? `(${t('absent')})` : `(${t('amount')}: ₹${data.todayEntry.totalAmount})`}
                </span>
                <span className="text-[11px] text-emerald-700">
                  {t('recordedTime')}: {new Date(data.todayEntry.date).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MONTHLY SUMMARY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-lg">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{t('totalMilkTaken')}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Milk className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {data?.totalLitres || 0} <span className="text-sm font-semibold text-slate-500">{t('litres')}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t('thisMonthMilk')}</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-lg">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{t('ratePerLitre')}</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600">
            ₹{data?.customer?.rate || (user.milkType === 'buffalo' ? 75 : 60)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {user.milkType === 'buffalo' ? t('buffaloMilk') : t('cowMilk')}
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-lg bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-emerald-800">{t('monthlyBill')}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {formatCurrency(data?.totalAmount || 0)}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">{t('totalPayable')}</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-lg">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{t('daysStats')}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-800">
            <span className="text-emerald-600">{totalDaysTaken} {t('daysMilkTaken')}</span> /{' '}
            <span className="text-rose-500">{totalDaysAbsent} {t('daysAbsent')}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {t('outOfTotal', { days: data?.daysInMonth || 30 })}
          </p>
        </div>
      </div>

      {/* MONTHLY CALENDAR REGISTER TABLE (रतीबाची वही) */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>{t('myRegisterCalendar')}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('calendarHint')}
            </p>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1.5 hover:bg-white rounded-xl transition-all cursor-pointer text-slate-700"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-xs sm:text-sm px-2 text-slate-800">
              {monthNames[currentMonth - 1]} {currentYear}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-1.5 hover:bg-white rounded-xl transition-all cursor-pointer text-slate-700"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1 to 31 Day Grid */}
        <div className="mt-6">
          <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
            {Array.from({ length: data?.daysInMonth || 31 }, (_, i) => i + 1).map((day) => {
              const entry = data?.entriesByDay ? data.entriesByDay[day] : null;
              const hasEntry = entry !== undefined && entry !== null;
              const qty = entry ? entry.quantity : null;
              const isToday =
                isCurrentMonth && day === today.getDate();
              const isFuture =
                isCurrentMonth && day > today.getDate();

              let cellStyle = 'bg-slate-50 border-slate-200 text-slate-400';
              if (isToday) {
                cellStyle = 'ring-2 ring-blue-500 bg-blue-50/60 border-blue-300';
              }

              if (hasEntry) {
                if (qty > 0) {
                  cellStyle = isToday
                    ? 'ring-2 ring-blue-600 bg-blue-100 border-blue-400 text-blue-950 font-black'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold';
                } else if (qty === 0) {
                  cellStyle = 'bg-rose-50 border-rose-200 text-rose-700 font-bold';
                }
              }

              return (
                <div
                  key={day}
                  onClick={() => {
                    if (!isFuture) {
                      setSelectedDayToEdit(day);
                      setEditDayQty(entry ? entry.quantity : user.defaultQuantity || 1.0);
                      setEditDayNotes(entry ? entry.notes || '' : '');
                    }
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col justify-between min-h-[76px] cursor-pointer hover:shadow-md ${cellStyle} ${
                    isFuture ? 'opacity-40 cursor-not-allowed' : 'hover:scale-102'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="font-mono text-xs">{day}</span>
                    {isToday && (
                      <span className="bg-blue-600 text-white text-[9px] px-1 rounded-sm">
                        {t('today')}
                      </span>
                    )}
                  </div>

                  <div className="my-1">
                    {hasEntry ? (
                      <div>
                        <span className="text-sm font-black tracking-tight">
                          {qty === 0 ? '+ / 0' : `${qty} L`}
                        </span>
                        {qty > 0 && (
                          <div className="text-[10px] text-emerald-700/80 font-medium">
                            ₹{entry.totalAmount}
                          </div>
                        )}
                        {qty === 0 && (
                          <div className="text-[10px] text-rose-500 font-medium">{t('daysAbsent')}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300 font-medium">
                        {isFuture ? t('future') : '-'}
                      </span>
                    )}
                  </div>

                  <div className="text-[9px] text-slate-400">
                    {entry?.enteredBy === 'admin' ? 'Admin' : hasEntry ? 'Self' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-emerald-100 border border-emerald-300 rounded-md"></span>
            <span>{t('milkTakenLegend')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-rose-100 border border-rose-300 rounded-md"></span>
            <span>{t('absentLegend')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-blue-100 border-2 border-blue-500 rounded-md"></span>
            <span>{t('todayLegend')}</span>
          </div>
        </div>
      </div>

      {/* EDIT PAST DAY MODAL */}
      {selectedDayToEdit !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h4 className="font-bold text-slate-900 text-base mb-1">
              {t('editDateMilk', { day: selectedDayToEdit, month: monthNames[currentMonth - 1] })}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              {t('chooseQtyForDate')}
            </p>

            {/* Quick buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[0.5, 1, 1.5, 2, 2.5, 3, 0].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setEditDayQty(q)}
                  className={`py-2 text-xs font-bold rounded-xl border cursor-pointer ${
                    editDayQty === q
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {q === 0 ? t('holidayOption') : `${q} L`}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                {t('typeQty')}
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={editDayQty}
                onChange={(e) => setEditDayQty(parseFloat(e.target.value) || 0)}
                className="w-full py-2 px-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                {t('optionalNote')}
              </label>
              <input
                type="text"
                value={editDayNotes}
                onChange={(e) => setEditDayNotes(e.target.value)}
                placeholder={t('noteReasonPlaceholder')}
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedDayToEdit(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleSavePastDay}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PIN MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h4 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>{t('changePinTitle')}</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              {t('changePinSub')}
            </p>

            {pinMsg && (
              <div className="mb-3 p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg">
                {pinMsg}
              </div>
            )}
            {pinErr && (
              <div className="mb-3 p-2 bg-red-50 text-red-800 text-xs rounded-lg">{pinErr}</div>
            )}

            <form onSubmit={handlePinChange} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {t('oldPin')}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="1234"
                  className="w-full py-2 px-3 text-center font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {t('newPin')}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="e.g. 5678"
                  className="w-full py-2 px-3 text-center font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  {t('changePin')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
