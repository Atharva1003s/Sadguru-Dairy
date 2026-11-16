import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Milk,
  IndianRupee,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Printer,
  Share2,
} from 'lucide-react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
  MARATHI_MONTHS,
  ENGLISH_MONTHS,
  formatCurrency,
} from '../utils/marathiUtils';

export default function CustomerDetailView({
  customers,
  initialCustomerId,
  year,
  month,
  onPrintReceipt,
  onSendWhatsApp,
  onCellClick,
}) {
  const { language, t, customerName } = useLanguage();
  const today = new Date();

  const [selectedCustomerId, setSelectedCustomerId] = useState(
    initialCustomerId || (customers.length > 0 ? customers[0]._id : '')
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const monthNames = language === 'mr' ? MARATHI_MONTHS : ENGLISH_MONTHS;

  useEffect(() => {
    if (selectedCustomerId) {
      loadCustomerData(selectedCustomerId);
    }
  }, [selectedCustomerId, year, month]);

  const loadCustomerData = async (cId) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getCustomerEntries(cId, year, month);
      if (res.success) {
        setCustomerData(res);
      } else {
        setError(res.message);
      }
    } catch (e) {
      setError('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

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

  // Calculate statistics
  let totalDaysTaken = 0;
  let totalDaysAbsent = 0;
  if (customerData && customerData.entriesByDay) {
    Object.values(customerData.entriesByDay).forEach((e) => {
      if (e.quantity > 0) totalDaysTaken++;
      else if (e.quantity === 0) totalDaysAbsent++;
    });
  }

  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;

  return (
    <div className="space-y-5">
      {/* Customer Picker Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[280px]">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t('selectCustomerPrompt')}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchCustPlaceholder')}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="py-2 px-3 text-xs font-bold bg-blue-50 border border-blue-200 rounded-xl text-blue-950 focus:ring-2 focus:ring-blue-500 outline-none max-w-[220px]"
            >
              {filteredCustomers.map((c) => (
                <option key={c._id} value={c._id}>
                  #{c.serialNo} &bull; {customerName(c)} ({c.milkType === 'buffalo' ? t('buffalo') : t('cow')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCustomerObj && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPrintReceipt({
                ...selectedCustomerObj,
                totalLitres: customerData?.totalLitres || 0,
                totalAmount: customerData?.totalAmount || 0,
                rate: customerData?.customer?.rate || (selectedCustomerObj.milkType === 'buffalo' ? 75 : 60),
              })}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printReceiptBtn')}</span>
            </button>
            <button
              type="button"
              onClick={() => onSendWhatsApp({
                ...selectedCustomerObj,
                totalLitres: customerData?.totalLitres || 0,
                totalAmount: customerData?.totalAmount || 0,
                rate: customerData?.customer?.rate || (selectedCustomerObj.milkType === 'buffalo' ? 75 : 60),
              })}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer shadow-md shadow-emerald-600/20 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{t('sendWhatsAppBtn')}</span>
            </button>
          </div>
        )}
      </div>

      {selectedCustomerObj && (
        <>
          {/* Customer Overview Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 text-3xl shadow-inner">
                {selectedCustomerObj.milkType === 'buffalo' ? '🐃' : '🐄'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-900 font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
                    #{selectedCustomerObj.serialNo}
                  </span>
                  <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    {selectedCustomerObj.milkType === 'buffalo' ? t('buffaloMilk') : t('cowMilk')}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black mt-1">
                  {customerName(selectedCustomerObj)}
                </h2>
                <p className="text-xs text-blue-200 mt-0.5">
                  {t('defaultDaily')} <strong>{selectedCustomerObj.defaultQuantity || 1} {t('litres')}</strong> &bull; {t('rate')}: ₹
                  {customerData?.customer?.rate || (selectedCustomerObj.milkType === 'buffalo' ? 75 : 60)}/{t('litres')}
                </p>
              </div>
            </div>

            <div className="text-right bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15">
              <div className="text-[11px] text-blue-200 uppercase tracking-wider font-semibold">
                {monthNames[month - 1]} {year}
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                ₹{customerData?.totalAmount || 0}
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-md">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold">{t('totalMilkTaken')}</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Milk className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {customerData?.totalLitres || 0} <span className="text-sm font-semibold text-slate-500">{t('litres')}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{t('thisMonthMilk')}</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-md">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold">{t('ratePerLitre')}</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-indigo-600">
                ₹{customerData?.customer?.rate || (selectedCustomerObj.milkType === 'buffalo' ? 75 : 60)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {selectedCustomerObj.milkType === 'buffalo' ? t('buffaloMilk') : t('cowMilk')}
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-md bg-gradient-to-br from-emerald-50/50 to-white">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold text-emerald-800">{t('monthlyBill')}</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                {formatCurrency(customerData?.totalAmount || 0)}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">{t('totalPayable')}</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-md">
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
                {t('outOfTotal', { days: customerData?.daysInMonth || 30 })}
              </p>
            </div>
          </div>

          {/* 1 to 31 Day Calendar Grid */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>{t('myRegisterCalendar')} - {customerName(selectedCustomerObj)}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('calendarHint')}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-4 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
              {Array.from({ length: customerData?.daysInMonth || 31 }, (_, i) => i + 1).map((day) => {
                const entry = customerData?.entriesByDay ? customerData.entriesByDay[day] : null;
                const hasEntry = entry !== undefined && entry !== null;
                const qty = entry ? entry.quantity : null;
                const isToday = isCurrentMonth && day === today.getDate();

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
                    onClick={() => onCellClick(selectedCustomerObj, day, qty)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col justify-between min-h-[76px] cursor-pointer hover:shadow-md hover:scale-102 ${cellStyle}`}
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
                        <span className="text-xs text-slate-300 font-medium">-</span>
                      )}
                    </div>

                    <div className="text-[9px] text-slate-400">
                      {hasEntry ? 'Edit' : '+'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
