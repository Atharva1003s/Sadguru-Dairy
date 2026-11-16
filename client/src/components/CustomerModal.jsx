import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CustomerModal({ isOpen, onClose, customer, onSave }) {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    nameMarathi: '',
    nameEnglish: '',
    phone: '',
    serialNo: '',
    category: 'cow',
    milkType: 'cow',
    defaultQuantity: 1.0,
    customRate: '',
    pin: '1234',
    notes: '',
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        nameMarathi: customer.nameMarathi || '',
        nameEnglish: customer.nameEnglish || '',
        phone: customer.phone || '',
        serialNo: customer.serialNo || '',
        category: customer.category || 'cow',
        milkType: customer.milkType || 'cow',
        defaultQuantity: customer.defaultQuantity || 1.0,
        customRate: customer.customRate || '',
        pin: customer.pin || '1234',
        notes: customer.notes || '',
      });
    } else {
      setFormData({
        nameMarathi: '',
        nameEnglish: '',
        phone: '',
        serialNo: '',
        category: 'cow',
        milkType: 'cow',
        defaultQuantity: 1.0,
        customRate: '',
        pin: '1234',
        notes: '',
      });
    }
    setErr('');
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nameMarathi.trim()) {
      setErr(language === 'mr' ? 'ग्राहकाचे नाव आवश्यक आहे' : 'Customer name is required');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (e) {
      setErr(e.message || (language === 'mr' ? 'जतन करताना त्रुटी आली' : 'Failed to save customer'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="font-bold text-slate-900 text-base">
            {customer ? t('editCustomerTitle') : t('addCustomerTitle')}
          </h4>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {err && (
          <div className="mt-3 p-2.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('custNameMarathiLabel')}
            </label>
            <input
              type="text"
              value={formData.nameMarathi}
              onChange={(e) => setFormData({ ...formData, nameMarathi: e.target.value })}
              placeholder="e.g. संजय सोळंकी, भरत परमार"
              className="w-full py-2 px-3 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('custNameEnglishLabel')}
            </label>
            <input
              type="text"
              value={formData.nameEnglish}
              onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
              placeholder="e.g. Sanjay Solanki"
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('serialNoLabel')}
              </label>
              <input
                type="number"
                value={formData.serialNo}
                onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                placeholder="e.g. 95"
                className="w-full py-2 px-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('milkTypeLabel')}
              </label>
              <select
                value={formData.milkType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    milkType: e.target.value,
                    category: e.target.value,
                  })
                }
                className="w-full py-2 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              >
                <option value="cow">🐄 {t('cowMilk')}</option>
                <option value="buffalo">🐃 {t('buffaloMilk')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('defaultQtyLabel')}
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.defaultQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, defaultQuantity: parseFloat(e.target.value) || 0 })
                }
                className="w-full py-2 px-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('customRateLabel')}
              </label>
              <input
                type="number"
                value={formData.customRate}
                onChange={(e) => setFormData({ ...formData, customRate: e.target.value })}
                placeholder="Default rate"
                className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('phoneInputLabel')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 9822123456"
                className="w-full py-2 px-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('pinInputLabel')}
              </label>
              <input
                type="text"
                maxLength={4}
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="w-full py-2 px-3 text-xs font-mono text-center font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
            >
              {saving ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
