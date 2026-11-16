import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Edit,
  KeyRound,
  Trash2,
  CheckCircle,
  Milk,
  Phone,
  Check,
  X,
} from 'lucide-react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function CustomerManagement({
  customers,
  onRefresh,
  onEditCustomer,
  onAddNewCustomer,
}) {
  const { language, t, customerName } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [statusErr, setStatusErr] = useState('');

  const filtered = (customers || []).filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      String(c.serialNo).includes(term) ||
      (c.nameMarathi && c.nameMarathi.includes(term)) ||
      (c.nameEnglish && c.nameEnglish.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term))
    );
  });

  const handleResetPin = async (customer) => {
    const confirmPrompt =
      language === 'mr'
        ? `तुम्हाला नक्की ${customerName(customer)} यांचा पिन '1234' वर रीसेट करायचा आहे का?`
        : `Are you sure you want to reset PIN to '1234' for ${customerName(customer)}?`;

    if (!window.confirm(confirmPrompt)) {
      return;
    }

    try {
      const res = await api.resetCustomerPin(customer._id);
      if (res.success) {
        setStatusMsg(
          language === 'mr'
            ? `${customerName(customer)} यांचा पिन 1234 वर रीसेट झाला!`
            : `PIN reset to 1234 for ${customerName(customer)}!`
        );
        setTimeout(() => setStatusMsg(''), 4000);
      } else {
        setStatusErr(res.message || 'Reset failed');
      }
    } catch (err) {
      setStatusErr('Server error');
    }
  };

  const handleDelete = async (customer) => {
    const confirmPrompt =
      language === 'mr'
        ? `तुम्हाला नक्की ${customerName(customer)} यांना निष्क्रिय (Deactivate) करायचे आहे का?`
        : `Are you sure you want to deactivate ${customerName(customer)}?`;

    if (!window.confirm(confirmPrompt)) {
      return;
    }

    try {
      const res = await api.deleteCustomer(customer._id);
      if (res.success) {
        setStatusMsg(
          language === 'mr'
            ? `${customerName(customer)} निष्क्रिय केले.`
            : `${customerName(customer)} deactivated.`
        );
        onRefresh();
        setTimeout(() => setStatusMsg(''), 4000);
      } else {
        setStatusErr(res.message);
      }
    } catch (err) {
      setStatusErr('Server error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchCustomerInGrid')}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          />
        </div>

        <button
          type="button"
          onClick={onAddNewCustomer}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-blue-500/20 cursor-pointer transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('addNewCustomer')}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}
      {statusErr && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
          <X className="w-4 h-4 text-red-600" />
          <span>{statusErr}</span>
        </div>
      )}

      {/* Customer Cards Grid / Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-800 text-white font-bold">
              <tr className="border-b border-slate-700 divide-x divide-slate-700">
                <th className="py-3 px-3 text-center w-14">{t('srNo')}</th>
                <th className="py-3 px-4 min-w-[180px]">{t('customerName')}</th>
                <th className="py-3 px-3 min-w-[130px]">{t('phoneCol')}</th>
                <th className="py-3 px-3 text-center min-w-[90px]">{t('typeCol')}</th>
                <th className="py-3 px-3 text-center min-w-[100px]">{t('defaultQtyCol')}</th>
                <th className="py-3 px-3 text-center min-w-[80px]">{t('ratePerLtrCol')}</th>
                <th className="py-3 px-3 text-center min-w-[80px]">{t('pinCol')}</th>
                <th className="py-3 px-3 text-center min-w-[130px]">{t('managementCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((c, idx) => (
                <tr
                  key={c._id}
                  className={`divide-x divide-slate-100 hover:bg-blue-50/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                    #{c.serialNo}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    <div>{customerName(c)}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {language === 'mr' ? c.nameEnglish : c.nameMarathi}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {c.phone}
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold">
                    {c.milkType === 'buffalo' ? (
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200 text-[11px]">
                        🐃 {t('buffalo')}
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                        🐄 {t('cow')}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                    {c.defaultQuantity} {t('litres')}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-indigo-700">
                    {c.customRate ? `₹${c.customRate}` : t('defaultWord')}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                    {c.pin || '1234'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditCustomer(c)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors cursor-pointer"
                        title="Edit Customer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetPin(c)}
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors cursor-pointer"
                        title="Reset PIN (1234)"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Deactivate Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
