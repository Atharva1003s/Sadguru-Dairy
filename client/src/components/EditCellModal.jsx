import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Milk } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MARATHI_MONTHS, ENGLISH_MONTHS } from '../utils/marathiUtils';

export default function EditCellModal({
  isOpen,
  onClose,
  customer,
  day,
  month,
  year,
  initialQty,
  onSave,
}) {
  const { language, t, customerName } = useLanguage();
  const [qty, setQty] = useState(initialQty !== null && initialQty !== undefined ? initialQty : 1.0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const monthNames = language === 'mr' ? MARATHI_MONTHS : ENGLISH_MONTHS;

  useEffect(() => {
    setQty(initialQty !== null && initialQty !== undefined ? initialQty : (customer?.defaultQuantity || 1.0));
  }, [customer, day, initialQty]);

  if (!isOpen || !customer) return null;

  const quickAmounts = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 0];

  const handleConfirm = async () => {
    setSaving(true);
    await onSave(customer._id, day, qty, notes);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-bold text-blue-600">
              {language === 'mr' ? 'दिनांक' : 'Date'}: {day} {monthNames[month - 1]} {year}
            </div>
            <h4 className="font-bold text-slate-900 text-base">
              #{customer.serialNo} {customerName(customer)}
            </h4>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4">
          <label className="block text-xs font-bold text-slate-600 mb-2">
            {t('chooseQtyForDate')}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQty(q)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  qty === q
                    ? q === 0
                      ? 'bg-rose-500 text-white border-rose-600 shadow'
                      : 'bg-blue-600 text-white border-blue-600 shadow'
                    : q === 0
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {q === 0 ? t('holidayOption') : `${q} L`}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            {t('typeQty')}
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={qty}
            onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
            className="w-full py-2 px-3 text-sm font-black bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            {t('optionalNote')}
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('noteReasonPlaceholder')}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
          >
            {saving ? t('saving') : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
