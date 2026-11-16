import React from 'react';
import { X, Printer, Share2, Milk, CheckCircle2, QrCode } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MARATHI_MONTHS, ENGLISH_MONTHS, formatCurrency } from '../utils/marathiUtils';

export default function BillReceiptModal({
  isOpen,
  onClose,
  customer,
  year,
  month,
  settings,
}) {
  const { language, t, customerName } = useLanguage();
  if (!isOpen || !customer) return null;

  const monthNames = language === 'mr' ? MARATHI_MONTHS : ENGLISH_MONTHS;
  const dairyName = settings?.dairyName || (language === 'mr' ? 'सद्गुरू दुग्धालय (Sadguru Dairy)' : 'Sadguru Dairy');
  const dairyTagline = settings?.dairyTagline || (language === 'mr' ? '१००% शुद्ध दूध - मंगल हो' : '100% Pure Milk');
  const ownerPhone = settings?.phone || '9822000000';
  const upiId = settings?.upiId || 'sadgurudairy@upi';

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `*🥛 ${dairyName}*\n` +
      `--------------------------------\n` +
      `*${language === 'mr' ? 'ग्राहक' : 'Customer'}:* ${customerName(customer)} (#${customer.serialNo})\n` +
      `*${language === 'mr' ? 'महिना' : 'Month'}:* ${monthNames[month - 1]} ${year}\n` +
      `*${language === 'mr' ? 'दूध प्रकार' : 'Milk Type'}:* ${customer.milkType === 'buffalo' ? t('buffaloMilk') : t('cowMilk')}\n` +
      `*${language === 'mr' ? 'एकूण दूध' : 'Total Milk'}:* ${customer.totalLitres} L\n` +
      `*${language === 'mr' ? 'दर' : 'Rate'}:* ₹${customer.rate}/L\n` +
      `*${language === 'mr' ? 'एकूण देय बिल' : 'Total Bill Amount'}:* ₹${customer.totalAmount}\n` +
      `--------------------------------\n` +
      `${language === 'mr' ? 'UPI द्वारे पेमेंट' : 'Pay Online UPI'}: ${upiId}\n` +
      `${language === 'mr' ? 'कृपया बिल रक्कम लवकरात लवकर जमा करावी. धन्यवाद! 🙏' : 'Kindly clear the bill amount at your earliest. Thank you! 🙏'}`
    );

    const targetPhone = customer.phone && !customer.phone.startsWith('980000') ? customer.phone : '';
    const url = targetPhone
      ? `https://wa.me/91${targetPhone}?text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-200">
          <span className="font-bold text-xs text-slate-700">{t('receiptTitle')}</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-6 bg-amber-50/20 text-slate-800">
          {/* Receipt Header */}
          <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
            <div className="text-xl font-black tracking-wide text-slate-900">{dairyName}</div>
            <div className="text-xs text-amber-700 font-bold">{dairyTagline}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {language === 'mr' ? 'मोबाईल:' : 'Mobile:'} {ownerPhone}
            </div>
          </div>

          {/* Customer & Period Info */}
          <div className="py-3 border-b border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('receiptMonth')}</span>
              <span className="font-bold">
                {monthNames[month - 1]} {year}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('receiptCustName')}</span>
              <span className="font-bold text-blue-900">
                #{customer.serialNo} {customerName(customer)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('receiptMilkType')}</span>
              <span className="font-semibold">
                {customer.milkType === 'buffalo' ? t('buffaloMilk') : t('cowMilk')}
              </span>
            </div>
          </div>

          {/* Milk Breakdown Calculation */}
          <div className="py-3 border-b border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span>{t('receiptTotalMilk')}</span>
              <span className="font-bold text-sm text-slate-900">{customer.totalLitres} L</span>
            </div>
            <div className="flex justify-between">
              <span>{t('receiptRate')}</span>
              <span className="font-bold text-sm text-slate-900">₹{customer.rate}</span>
            </div>
          </div>

          {/* Grand Total Highlight */}
          <div className="py-4 border-b-2 border-dashed border-slate-300 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">{t('receiptPayableTotal')}</div>
              <div className="text-2xl font-black text-emerald-700">₹{customer.totalAmount}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400">{t('status')}</div>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {t('receiptStatusPending')}
              </span>
            </div>
          </div>

          {/* Payment UPI Details */}
          {upiId && (
            <div className="pt-3 text-center text-xs text-slate-600">
              <div className="font-bold text-[11px] text-slate-700">{t('receiptUpiHint')}</div>
              <div className="font-mono text-xs bg-slate-100 py-1 px-2 rounded-lg inline-block mt-1 font-semibold text-blue-900">
                {upiId}
              </div>
            </div>
          )}

          <div className="mt-4 text-center text-[10px] text-slate-400">
            {t('receiptBlessing')}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('printReceiptBtn')}</span>
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('sendWhatsAppBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
