import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  PlusCircle,
  Calendar,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Milk,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import MonthlyRegisterGrid from '../components/MonthlyRegisterGrid';
import DailyQuickEntryView from '../components/DailyQuickEntryView';
import CustomerDetailView from '../components/CustomerDetailView';
import CustomerManagement from '../components/CustomerManagement';
import BillingView from '../components/BillingView';
import SettingsView from '../components/SettingsView';
import EditCellModal from '../components/EditCellModal';
import CustomerModal from '../components/CustomerModal';
import BillReceiptModal from '../components/BillReceiptModal';
import { MARATHI_MONTHS, ENGLISH_MONTHS } from '../utils/marathiUtils';

export default function AdminDashboard({ user }) {
  const { language, t } = useLanguage();
  const today = new Date();
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'daily_entry' | 'customer_details' | 'customers' | 'billing' | 'settings'

  // Date selection
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-12
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'cow' | 'buffalo'
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [gridData, setGridData] = useState(null);
  const [allCustomers, setAllCustomers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastErr, setToastErr] = useState('');

  // Modals
  const [editCellState, setEditCellState] = useState({
    isOpen: false,
    customer: null,
    day: 1,
    initialQty: 1.0,
  });

  const [customerModalState, setCustomerModalState] = useState({
    isOpen: false,
    customer: null,
  });

  const [receiptModalState, setReceiptModalState] = useState({
    isOpen: false,
    customer: null,
  });

  const monthNames = language === 'mr' ? MARATHI_MONTHS : ENGLISH_MONTHS;

  // Load data on month/year/category change
  useEffect(() => {
    loadAllData();
  }, [selectedYear, selectedMonth, selectedCategory]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [gridRes, customersRes, settingsRes] = await Promise.all([
        api.getMonthlyGrid(selectedYear, selectedMonth, selectedCategory),
        api.getAllCustomers(),
        api.getSettings(),
      ]);

      if (gridRes.success) setGridData(gridRes);
      if (customersRes.success) setAllCustomers(customersRes.customers);
      if (settingsRes.success) setSettings(settingsRes.settings);
    } catch (e) {
      console.error('Failed to load admin data:', e);
      setToastErr(language === 'mr' ? 'माहिती लोड करण्यात अडचण आली' : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (delta) => {
    let newM = selectedMonth + delta;
    let newY = selectedYear;
    if (newM > 12) {
      newM = 1;
      newY += 1;
    } else if (newM < 1) {
      newM = 12;
      newY -= 1;
    }
    setSelectedMonth(newM);
    setSelectedYear(newY);
  };

  // Cell Click handler for Register Table or Calendar
  const handleCellClick = (customer, day, currentQty) => {
    setEditCellState({
      isOpen: true,
      customer,
      day,
      initialQty: currentQty,
    });
  };

  // Save cell edit
  const handleSaveCell = async (customerId, day, qty, notes) => {
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    try {
      const res = await api.recordMilk({
        customerId,
        date: dateStr,
        quantity: qty,
        notes,
      });

      if (res.success) {
        setToastMsg(
          language === 'mr'
            ? `नोंद यशस्वीरित्या जतन झाली (${qty}L)`
            : `Entry successfully saved (${qty}L)`
        );
        loadAllData();
        setTimeout(() => setToastMsg(''), 3000);
      } else {
        setToastErr(res.message);
      }
    } catch (e) {
      setToastErr(language === 'mr' ? 'सर्व्हर त्रुटी' : 'Server error saving entry');
    }
  };

  // Batch Fill Today
  const handleBatchFillToday = async () => {
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const confirmPrompt =
      language === 'mr'
        ? `आजच्या (${today.getDate()} ${monthNames[today.getMonth()]}) तारखेसाठी ज्या ग्राहकांची नोंद नाही त्यांचे नेहमीचे दूध एका क्लिकवर भरायचे का?`
        : `Auto-fill today's (${today.getDate()} ${monthNames[today.getMonth()]}) standard daily deliveries for all unrecorded customers?`;

    if (!window.confirm(confirmPrompt)) {
      return;
    }

    try {
      const res = await api.batchFillToday(todayStr, selectedCategory);
      if (res.success) {
        setToastMsg(
          language === 'mr'
            ? res.message
            : `${res.addedCount} deliveries successfully registered for today!`
        );
        loadAllData();
        setTimeout(() => setToastMsg(''), 4000);
      } else {
        setToastErr(res.message);
      }
    } catch (e) {
      setToastErr(language === 'mr' ? 'सर्व्हर त्रुटी' : 'Server error');
    }
  };

  // Save Customer (Create or Update)
  const handleSaveCustomer = async (formData) => {
    if (customerModalState.customer) {
      const res = await api.updateCustomer(customerModalState.customer._id, formData);
      if (!res.success) throw new Error(res.message);
      setToastMsg(language === 'mr' ? 'ग्राहकाची माहिती अद्ययावत केली!' : 'Customer updated successfully!');
    } else {
      const res = await api.createCustomer(formData);
      if (!res.success) throw new Error(res.message);
      setToastMsg(language === 'mr' ? 'नवीन ग्राहक यशस्वीरित्या जोडला!' : 'New customer added successfully!');
    }
    loadAllData();
    setTimeout(() => setToastMsg(''), 4000);
  };

  // WhatsApp Bill Trigger
  const handleSendWhatsAppBill = (customer) => {
    setReceiptModalState({ isOpen: true, customer });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Subheader & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-md">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('tabRegister')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('daily_entry')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'daily_entry'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('tabDailyEntry')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customer_details')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'customer_details'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t('tabCustomerDetails')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t('tabCustomers')} ({allCustomers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'billing'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('tabBilling')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t('tabSettings')}</span>
          </button>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 hover:bg-white rounded-lg transition-all cursor-pointer text-slate-700"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-xs sm:text-sm px-2 text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>
              {monthNames[selectedMonth - 1]} {selectedYear}
            </span>
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 hover:bg-white rounded-lg transition-all cursor-pointer text-slate-700"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
      {toastErr && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{toastErr}</span>
        </div>
      )}

      {/* TAB 1: REGISTER GRID (वही) */}
      {activeTab === 'register' && (
        <MonthlyRegisterGrid
          gridData={gridData}
          year={selectedYear}
          month={selectedMonth}
          category={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCellClick={handleCellClick}
          onBatchFillToday={handleBatchFillToday}
          onSendWhatsAppBill={handleSendWhatsAppBill}
          loading={loading}
        />
      )}

      {/* TAB 2: DAILY QUICK ENTRY PAD */}
      {activeTab === 'daily_entry' && (
        <DailyQuickEntryView
          customers={allCustomers}
          onRecordSuccess={loadAllData}
          onBatchFillToday={handleBatchFillToday}
        />
      )}

      {/* TAB 3: CUSTOMER CALENDAR & LEDGER */}
      {activeTab === 'customer_details' && (
        <CustomerDetailView
          customers={allCustomers}
          initialCustomerId={allCustomers.length > 0 ? allCustomers[0]._id : ''}
          year={selectedYear}
          month={selectedMonth}
          onPrintReceipt={(cust) =>
            setReceiptModalState({ isOpen: true, customer: cust })
          }
          onSendWhatsApp={(cust) =>
            setReceiptModalState({ isOpen: true, customer: cust })
          }
          onCellClick={handleCellClick}
        />
      )}

      {/* TAB 4: CUSTOMER MANAGEMENT */}
      {activeTab === 'customers' && (
        <CustomerManagement
          customers={allCustomers}
          onRefresh={loadAllData}
          onEditCustomer={(cust) =>
            setCustomerModalState({ isOpen: true, customer: cust })
          }
          onAddNewCustomer={() =>
            setCustomerModalState({ isOpen: true, customer: null })
          }
        />
      )}

      {/* TAB 5: BILLING & WHATSAPP */}
      {activeTab === 'billing' && (
        <BillingView
          customers={gridData?.customers || []}
          year={selectedYear}
          month={selectedMonth}
          onPrintReceipt={(cust) =>
            setReceiptModalState({ isOpen: true, customer: cust })
          }
          onSendWhatsApp={(cust) =>
            setReceiptModalState({ isOpen: true, customer: cust })
          }
        />
      )}

      {/* TAB 6: SETTINGS */}
      {activeTab === 'settings' && (
        <SettingsView onSettingsUpdated={loadAllData} />
      )}

      {/* MODALS */}
      <EditCellModal
        isOpen={editCellState.isOpen}
        onClose={() => setEditCellState({ ...editCellState, isOpen: false })}
        customer={editCellState.customer}
        day={editCellState.day}
        month={selectedMonth}
        year={selectedYear}
        initialQty={editCellState.initialQty}
        onSave={handleSaveCell}
      />

      <CustomerModal
        isOpen={customerModalState.isOpen}
        onClose={() => setCustomerModalState({ ...customerModalState, isOpen: false })}
        customer={customerModalState.customer}
        onSave={handleSaveCustomer}
      />

      <BillReceiptModal
        isOpen={receiptModalState.isOpen}
        onClose={() => setReceiptModalState({ ...receiptModalState, isOpen: false })}
        customer={receiptModalState.customer}
        year={selectedYear}
        month={selectedMonth}
        settings={settings}
      />
    </div>
  );
}
