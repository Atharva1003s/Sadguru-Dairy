import React from 'react';
import {
  Printer,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Milk,
  Edit2,
  Share2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/marathiUtils';

export default function MonthlyRegisterGrid({
  gridData,
  year,
  month,
  category,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  onCellClick,
  onBatchFillToday,
  onSendWhatsAppBill,
  loading,
}) {
  const { language, t, customerName } = useLanguage();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDay = today.getDate();
  const daysInMonth = gridData?.daysInMonth || 31;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Filter customers by search term
  const filteredCustomers = (gridData?.customers || []).filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const srMatch = String(c.serialNo).includes(term);
    const marathiMatch = c.nameMarathi && c.nameMarathi.includes(term);
    const englishMatch = c.nameEnglish && c.nameEnglish.toLowerCase().includes(term);
    return srMatch || marathiMatch || englishMatch;
  });

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              category === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('allCustomers')} ({gridData?.summary?.customerCount || 0})
          </button>
          <button
            type="button"
            onClick={() => onCategoryChange('cow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              category === 'cow'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🐄 {t('cowMilk')}
          </button>
          <button
            type="button"
            onClick={() => onCategoryChange('buffalo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              category === 'buffalo'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🐃 {t('buffaloMilk')}
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[240px] flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchCustomerInGrid')}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isCurrentMonth && (
            <button
              type="button"
              onClick={onBatchFillToday}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-amber-500/20 cursor-pointer transition-all"
              title={t('autoFillTooltip')}
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>{t('autoFillTodayBtn')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer transition-all"
            title="Print Register"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{t('printRegisterBtn')}</span>
          </button>
        </div>
      </div>

      {/* SUMMARY BADGES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-800">{t('totalCowMilk')}</div>
            <div className="text-xl font-black text-emerald-900">
              {gridData?.summary?.totalCowLitres || 0} L
            </div>
          </div>
          <span className="text-2xl">🐄</span>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-indigo-800">{t('totalBuffaloMilk')}</div>
            <div className="text-xl font-black text-indigo-900">
              {gridData?.summary?.totalBuffaloLitres || 0} L
            </div>
          </div>
          <span className="text-2xl">🐃</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-blue-800">{t('totalAllMilk')}</div>
            <div className="text-xl font-black text-blue-900">
              {gridData?.summary?.grandTotalLitres || 0} L
            </div>
          </div>
          <span className="text-2xl">🥛</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-amber-800">{t('totalMonthBill')}</div>
            <div className="text-xl font-black text-amber-900">
              {formatCurrency(gridData?.summary?.grandTotalAmount || 0)}
            </div>
          </div>
          <span className="text-2xl">💰</span>
        </div>
      </div>

      {/* DIGITAL REGISTER TABLE (रतीबाची वही) */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh] relative">
          <table className="w-full text-left border-collapse text-xs">
            {/* Table Header */}
            <thead className="bg-slate-800 text-white sticky top-0 z-20 shadow-md">
              <tr className="border-b border-slate-700 divide-x divide-slate-700">
                <th className="py-2.5 px-2 text-center w-12 sticky left-0 bg-slate-800 z-30 font-bold">
                  {t('srNo')}
                </th>
                <th className="py-2.5 px-3 min-w-[160px] sticky left-12 bg-slate-800 z-30 font-bold">
                  {t('customerName')}
                </th>
                <th className="py-2.5 px-2 text-center w-14 font-semibold text-[11px]">
                  {t('typeCol')}
                </th>

                {/* Day Columns 1 to 31 */}
                {daysArray.map((day) => {
                  const isToday = isCurrentMonth && day === todayDay;
                  return (
                    <th
                      key={day}
                      className={`py-2 px-1 text-center min-w-[34px] font-mono text-[11px] ${
                        isToday ? 'bg-blue-600 text-white font-extrabold ring-1 ring-white' : ''
                      }`}
                    >
                      {day}
                    </th>
                  );
                })}

                <th className="py-2.5 px-2 text-center min-w-[70px] bg-slate-900 font-bold text-sky-300">
                  {t('totalLitresCol')}
                </th>
                <th className="py-2.5 px-2 text-center min-w-[50px] bg-slate-900 font-bold">
                  {t('rateCol')}
                </th>
                <th className="py-2.5 px-3 text-right min-w-[85px] bg-slate-950 font-bold text-amber-300">
                  {t('amountCol')}
                </th>
                <th className="py-2.5 px-2 text-center min-w-[60px] bg-slate-900 font-medium">
                  {t('actionCol')}
                </th>
              </tr>
            </thead>

            {/* Table Body - Customer Rows */}
            <tbody className="divide-y divide-slate-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={daysInMonth + 7}
                    className="py-12 text-center text-slate-400 font-medium text-sm"
                  >
                    {t('noCustomerFound')}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust, idx) => {
                  const isEven = idx % 2 === 0;
                  const rowBg = isEven ? 'bg-white hover:bg-sky-50/50' : 'bg-slate-50/60 hover:bg-sky-50/50';

                  return (
                    <tr
                      key={cust._id}
                      className={`divide-x divide-slate-200 transition-colors ${rowBg}`}
                    >
                      {/* Sticky Serial No */}
                      <td className={`py-2 px-2 text-center font-mono font-bold text-slate-600 sticky left-0 z-10 ${isEven ? 'bg-white' : 'bg-slate-50'}`}>
                        {cust.serialNo}
                      </td>

                      {/* Sticky Customer Name */}
                      <td className={`py-2 px-3 sticky left-12 z-10 font-bold text-slate-800 ${isEven ? 'bg-white' : 'bg-slate-50'}`}>
                        <div className="flex items-center justify-between">
                          <span className="truncate max-w-[140px]">{customerName(cust)}</span>
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            {cust.defaultQuantity}L
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal truncate max-w-[140px]">
                          {language === 'mr' ? cust.nameEnglish : cust.nameMarathi}
                        </div>
                      </td>

                      {/* Milk Type Icon */}
                      <td className="py-2 px-1 text-center font-medium">
                        {cust.milkType === 'buffalo' ? (
                          <span className="text-xs" title={t('buffaloMilk')}>🐃</span>
                        ) : (
                          <span className="text-xs" title={t('cowMilk')}>🐄</span>
                        )}
                      </td>

                      {/* Days 1 to 31 Cells */}
                      {daysArray.map((day) => {
                        const qty = cust.entries ? cust.entries[day] : null;
                        const isToday = isCurrentMonth && day === todayDay;

                        let displayVal = '';
                        let cellColor = '';

                        if (qty !== null && qty !== undefined) {
                          if (qty === 0) {
                            displayVal = '+';
                            cellColor = 'text-rose-500 font-bold bg-rose-50/60';
                          } else if (qty === 0.5) {
                            displayVal = '0.5';
                            cellColor = 'text-blue-700 font-bold';
                          } else if (qty === 1.5) {
                            displayVal = '1.5';
                            cellColor = 'text-indigo-700 font-bold';
                          } else if (qty === 2.5) {
                            displayVal = '2.5';
                            cellColor = 'text-purple-700 font-bold';
                          } else {
                            displayVal = qty;
                            cellColor = 'text-slate-800 font-bold';
                          }
                        } else {
                          displayVal = '-';
                          cellColor = 'text-slate-300';
                        }

                        return (
                          <td
                            key={day}
                            onClick={() => onCellClick(cust, day, qty)}
                            className={`py-2 px-1 text-center font-mono cursor-pointer transition-all hover:bg-blue-100 ${cellColor} ${
                              isToday ? 'bg-blue-50/60 font-black' : ''
                            }`}
                            title={`${customerName(cust)} - Day ${day} (${qty !== null ? qty + ' L' : 'No entry'})`}
                          >
                            {displayVal}
                          </td>
                        );
                      })}

                      {/* Total Litres */}
                      <td className="py-2 px-2 text-center font-mono font-black text-blue-700 bg-blue-50/40">
                        {cust.totalLitres}
                      </td>

                      {/* Rate */}
                      <td className="py-2 px-2 text-center font-mono text-slate-600">
                        ₹{cust.rate}
                      </td>

                      {/* Total Amount */}
                      <td className="py-2 px-3 text-right font-mono font-black text-emerald-700 bg-emerald-50/40">
                        ₹{cust.totalAmount}
                      </td>

                      {/* Action */}
                      <td className="py-2 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => onSendWhatsAppBill(cust)}
                          className="p-1 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors cursor-pointer"
                          title={t('sendWhatsAppBtn')}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Bottom Summary Rows (Just like red ink in the notebook!) */}
            <tfoot className="bg-rose-50 text-rose-950 font-bold sticky bottom-0 z-20 border-t-2 border-rose-300 divide-y divide-rose-200">
              {/* Row 1: Total Cow Milk */}
              <tr className="divide-x divide-rose-200 bg-amber-50/90 text-amber-950">
                <td colSpan={2} className="py-2 px-3 sticky left-0 z-20 bg-amber-100 font-extrabold text-amber-900">
                  🐄 {t('totalCowMilk')}
                </td>
                <td className="text-center font-semibold text-[10px]">L</td>
                {daysArray.map((day) => {
                  const dayVal = gridData?.dailyTotals ? gridData.dailyTotals[day]?.cow || 0 : 0;
                  return (
                    <td key={day} className="py-2 px-0.5 text-center font-mono text-[11px] font-bold text-amber-900">
                      {dayVal > 0 ? dayVal : '-'}
                    </td>
                  );
                })}
                <td className="py-2 px-2 text-center font-mono font-extrabold text-amber-900 bg-amber-200/60">
                  {gridData?.summary?.totalCowLitres || 0}
                </td>
                <td className="text-center">-</td>
                <td className="py-2 px-2 text-right font-mono font-extrabold text-amber-900">
                  ₹{Math.round((gridData?.summary?.totalCowLitres || 0) * 60)}
                </td>
                <td></td>
              </tr>

              {/* Row 2: Total Buffalo Milk */}
              <tr className="divide-x divide-rose-200 bg-indigo-50/90 text-indigo-950">
                <td colSpan={2} className="py-2 px-3 sticky left-0 z-20 bg-indigo-100 font-extrabold text-indigo-900">
                  🐃 {t('totalBuffaloMilk')}
                </td>
                <td className="text-center font-semibold text-[10px]">L</td>
                {daysArray.map((day) => {
                  const dayVal = gridData?.dailyTotals ? gridData.dailyTotals[day]?.buffalo || 0 : 0;
                  return (
                    <td key={day} className="py-2 px-0.5 text-center font-mono text-[11px] font-bold text-indigo-900">
                      {dayVal > 0 ? dayVal : '-'}
                    </td>
                  );
                })}
                <td className="py-2 px-2 text-center font-mono font-extrabold text-indigo-900 bg-indigo-200/60">
                  {gridData?.summary?.totalBuffaloLitres || 0}
                </td>
                <td className="text-center">-</td>
                <td className="py-2 px-2 text-right font-mono font-extrabold text-indigo-900">
                  ₹{Math.round((gridData?.summary?.totalBuffaloLitres || 0) * 75)}
                </td>
                <td></td>
              </tr>

              {/* Row 3: Grand Total */}
              <tr className="divide-x divide-rose-300 bg-rose-100/95 text-rose-950 text-xs">
                <td colSpan={2} className="py-2.5 px-3 sticky left-0 z-20 bg-rose-200 font-black text-rose-900">
                  🥛 {t('grandTotal')}
                </td>
                <td className="text-center font-extrabold text-[10px]">L</td>
                {daysArray.map((day) => {
                  const dayVal = gridData?.dailyTotals ? gridData.dailyTotals[day]?.total || 0 : 0;
                  return (
                    <td key={day} className="py-2 px-0.5 text-center font-mono font-black text-rose-950">
                      {dayVal > 0 ? dayVal : '-'}
                    </td>
                  );
                })}
                <td className="py-2 px-2 text-center font-mono font-black text-rose-950 bg-rose-300/80">
                  {gridData?.summary?.grandTotalLitres || 0} L
                </td>
                <td className="text-center">-</td>
                <td className="py-2 px-3 text-right font-mono font-black text-rose-950 bg-rose-300/80">
                  ₹{gridData?.summary?.grandTotalAmount || 0}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
