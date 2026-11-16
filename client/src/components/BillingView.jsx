import React, { useState } from 'react';
import {
  FileText,
  Share2,
  Printer,
  Search,
  IndianRupee,
  Milk,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MARATHI_MONTHS, ENGLISH_MONTHS, formatCurrency } from '../utils/marathiUtils';

export default function BillingView({
  customers,
  year,
  month,
  onPrintReceipt,
  onSendWhatsApp,
}) {
  const { language, t, customerName } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const monthNames = language === 'mr' ? MARATHI_MONTHS : ENGLISH_MONTHS;

  const filtered = (customers || []).filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      String(c.serialNo).includes(term) ||
      (c.nameMarathi && c.nameMarathi.includes(term)) ||
      (c.nameEnglish && c.nameEnglish.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">
            {t('billingTitle')} ({monthNames[month - 1]} {year})
          </h3>
          <p className="text-xs text-slate-500">
            {t('billingSub')}
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchCustomerInGrid')}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Bill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((cust) => {
          return (
            <div
              key={cust._id}
              className="bg-white rounded-3xl p-5 shadow-md border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-lg">
                      #{cust.serialNo}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{customerName(cust)}</h4>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {cust.milkType === 'buffalo' ? `🐃 ${t('buffalo')}` : `🐄 ${t('cow')}`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div className="p-2 bg-blue-50/60 rounded-xl">
                    <div className="text-[10px] text-slate-500 font-bold">{t('totalMilk')}</div>
                    <div className="text-base font-black text-blue-800">{cust.totalLitres} L</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-500 font-bold">{t('rate')}</div>
                    <div className="text-base font-black text-slate-800">₹{cust.rate}</div>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <div className="text-[10px] text-emerald-700 font-bold">{t('monthlyBill')}</div>
                    <div className="text-base font-black text-emerald-800">
                      ₹{cust.totalAmount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onPrintReceipt(cust)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('printReceiptBtn')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSendWhatsApp(cust)}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/30 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t('sendWhatsAppBtn')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
