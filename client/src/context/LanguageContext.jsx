import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  mr: {
    // Brand
    dairyName: 'सद्गुरू दुग्धालय',
    dairySub: '१००% शुद्ध दूध',
    dairyTagline: 'दैनिक दूध रतीब व्यवस्थापन प्रणाली',
    appPortal: 'सद्गुरू दुग्धालय - व्यवस्थापक पोर्टल',
    appDesc: 'दूध रतीब वही, दैनिक नोंद, ग्राहक हिशोब व बिलिंग व्यवस्थापन',

    // Header & Common
    langName: 'मराठी',
    switchLang: 'English मध्ये पहा',
    logout: 'बाहेर पडा',
    adminRole: 'डेअरी चालक / व्यवस्थापक (Dairy Operator)',
    cowMilk: 'गाय दूध (Cow)',
    buffaloMilk: 'म्हैस दूध (Buffalo)',
    cow: 'गाय',
    buffalo: 'म्हैस',
    litres: 'लिटर',
    rate: 'दर',
    amount: 'रक्कम',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    status: 'स्थिती',
    action: 'कृती',
    notes: 'टीप',
    srNo: 'अ.क्र.',
    customerName: 'ग्राहकाचे नाव',
    all: 'सर्व',
    today: 'आज',
    future: 'भावी',
    none: '-',
    absent: 'सुट्टी (+)',
    close: 'बंद करा',
    loading: 'लोड होत आहे...',
    saving: 'जतन होत आहे...',
    selectCustomerPrompt: 'ग्राहक निवडा:',

    // Operator Login
    operatorLoginTitle: 'डेअरी व्यवस्थापक लॉगिन (Operator Login)',
    operatorLoginSub: 'डेअरी चालक किंवा मालकांसाठी सुरक्षित नियंत्रण कक्ष',
    adminUsernameLabel: 'युजरनेम / मोबाईल नंबर:',
    adminPasswordLabel: 'पासवर्ड:',
    quickAdminCreds: 'डिफॉल्ट क्रेडेंशियल्स भरा (admin / admin)',
    operatorLoginBtn: 'व्यवस्थापक कक्षात प्रवेश करा',

    // Unified Dashboard Tabs
    tabRegister: '१. रतीबाची वही (Register Book)',
    tabDailyEntry: '२. दैनिक रतीब नोंद (Daily Entry)',
    tabCustomerDetails: '३. ग्राहक कॅलेंडर व हिशोब (Customer View)',
    tabCustomers: '४. ग्राहक व्यवस्थापन (Customers)',
    tabBilling: '५. मासिक बिले व WhatsApp (Billing)',
    tabSettings: '६. दर व सेटिंग्ज (Settings)',

    // Daily Quick Entry
    dailyEntryTitle: 'दैनिक दूध रतीब नोंदणी (Daily Delivery Entry)',
    dailyEntrySub: 'ग्राहकाचे आजचे किंवा कोणत्याही तारखेचे दूध १-क्लिकने नोंदवा',
    selectDateLabel: 'तारीख निवडा:',
    selectCustomerLabel: 'ग्राहक निवडा:',
    searchCustPlaceholder: 'ग्राहकाचे नाव किंवा वही क्र. शोधा...',
    howMuchGiven: 'दूध प्रमाण निवडा:',
    halfLtr: '०.५ L (अर्धा)',
    oneLtr: '१.० L (एक)',
    oneHalfLtr: '१.५ L (दीड)',
    twoLtr: '२.० L (दोन)',
    twoHalfLtr: '२.५ L',
    threeLtr: '३.० L',
    holidayOption: 'सुट्टी / ० L (+)',
    otherQty: 'इतर प्रमाण (Custom):',
    entryRecordedSuccess: 'दूध नोंद यशस्वीरित्या जतन झाली!',
    autoFillTodayBtn: 'आजचे सर्व रतीब एका क्लिकवर भरा',
    autoFillTooltip: 'ज्यांचे आजचे दूध भरलेले नाही त्यांचे नेहमीचे दूध एका क्लिकवर नोंदवा',

    // Register Grid
    allCustomers: 'सर्व ग्राहक',
    searchCustomerInGrid: 'ग्राहकाचे नाव किंवा वही क्र. शोधा...',
    printRegisterBtn: 'प्रिंट वही (Register)',
    totalCowMilk: 'एकूण गाय दूध',
    totalBuffaloMilk: 'एकूण म्हैस दूध',
    totalAllMilk: 'एकूण सर्व दूध (Total)',
    totalMonthBill: 'एकूण महिना बिल (रक्कम)',
    totalLitresCol: 'एकूण L',
    rateCol: 'दर ₹',
    amountCol: 'रक्कम ₹',
    actionCol: 'कृती',
    grandTotal: 'एकूण सर्व दूध (Grand Total)',

    // Single Customer Details / Calendar
    custOverviewTitle: 'ग्राहक मासिक रतीब कॅलेंडर व तपशील',
    custOverviewSub: 'प्रत्येक ग्राहकाचा १ ते ३१ तारखांचा कॅलेंडर तक्ता, मासिक हिशोब व पावती',
    totalMilkTaken: 'एकूण घेतलेले दूध',
    thisMonthMilk: 'या महिन्यातील एकूण रतीब',
    ratePerLitre: 'प्रति लिटर दर',
    monthlyBill: 'चालू महिन्याचे बिल',
    totalPayable: 'देय एकूण रक्कम',
    daysStats: 'दिवसांची आकडेवारी',
    daysMilkTaken: 'दिवस दूध',
    daysAbsent: 'सुट्टी',
    outOfTotal: 'एकूण {days} पैकी',
    myRegisterCalendar: 'मासिक रतीब तक्ता (Monthly Register)',
    calendarHint: 'कोणत्याही तारखेवर क्लिक करून त्या दिवसाचे दूध त्वरित बदलू शकता',
    milkTakenLegend: 'दूध घेतले (Milk Taken)',
    absentLegend: 'सुट्टी / नाही घेतले (Absent / 0 L)',
    todayLegend: 'आजचा दिवस (Today)',
    editDateMilk: 'दिनांक {day} {month} चे दूध बदला',
    chooseQtyForDate: 'या तारखेसाठी घेतलेले दूध प्रमाण निवडा:',
    typeQty: 'लिटर संख्या टाका:',
    optionalNote: 'टीप (ऐच्छिक):',
    noteReasonPlaceholder: 'कारण उदा. पाहुणे, कार्यक्रम...',

    // Customer Management
    addNewCustomer: 'नवीन ग्राहक जोडा (+ Add)',
    phoneCol: 'मोबाईल नंबर',
    typeCol: 'प्रकार',
    defaultQtyCol: 'नियमित रतीब',
    ratePerLtrCol: 'दर प्रति L',
    pinCol: 'सिक्युरिटी पिन',
    managementCol: 'व्यवस्थापन',
    defaultWord: 'डिफॉल्ट',
    editCustomerTitle: 'ग्राहक माहिती संपादन',
    addCustomerTitle: 'नवीन ग्राहक जोडा',
    custNameMarathiLabel: 'ग्राहकाचे नाव (मराठीत): *',
    custNameEnglishLabel: 'इंग्रजी नाव (English Name):',
    serialNoLabel: 'वही अनुक्रमांक (Sr No):',
    milkTypeLabel: 'दूध प्रकार (Milk Type):',
    defaultQtyLabel: 'नियमित रतीब (लिटर):',
    customRateLabel: 'खास दर (₹/L) (ऐच्छिक):',
    phoneInputLabel: 'मोबाईल नंबर:',
    pinInputLabel: 'लॉगिन पिन (PIN):',

    // Billing & WhatsApp
    billingTitle: 'मासिक बिले व WhatsApp पावत्या',
    billingSub: 'प्रत्येक ग्राहकाचे बिल तपासा, पावती प्रिंट करा किंवा थेट WhatsApp वर मेसेज पाठवा',
    printReceiptBtn: 'पावती प्रिंट',
    sendWhatsAppBtn: 'WhatsApp बिल',

    // Receipt Modal
    receiptTitle: 'दूध रतीब बिल पावती',
    receiptMonth: 'पावती महिना:',
    receiptCustName: 'ग्राहकाचे नाव:',
    receiptMilkType: 'दूध प्रकार:',
    receiptTotalMilk: 'महिन्याचे एकूण दूध:',
    receiptRate: 'प्रति लिटर दर:',
    receiptPayableTotal: 'एकूण देय रक्कम',
    receiptStatusPending: 'देय (Pending)',
    receiptUpiHint: 'UPI द्वारे पैसे पाठवा:',
    receiptBlessing: '।। मंगल हो ।। धन्यवाद! पुन्हा सेवा करण्याची संधी द्या.',

    // Settings
    settingsTitle: 'डेअरी सेटिंग्ज व दुधाचे दर',
    settingsSub: 'गाय आणि म्हशीच्या दुधाचे दर, डेअरी नाव व UPI पेमेंट माहिती बदला',
    cowRateLabel: 'गाय दूध दर (₹ प्रति लिटर):',
    buffaloRateLabel: 'म्हैस दूध दर (₹ प्रति लिटर):',
    dairyNameLabel: 'डेअरीचे नाव:',
    taglineLabel: 'टॅगलाईन (उदा. १००% शुद्ध दूध - मंगल हो):',
    dairyPhoneLabel: 'डेअरी संपर्क फोन:',
    upiIdLabel: 'UPI पेमेंट ID (पावतीवर दाखवण्यासाठी):',
    saveSettingsBtn: 'सेटिंग्ज जतन करा',
    reseedTitle: 'मूळ वहीतील ग्राहक रीसीड करा',
    reseedSub: 'फोटोमधील सर्व ९४ ग्राहकांची नावे (संजय सोळंकी, केजवे, भरत परमार, इ.) पुन्हा डेटाबेसमध्ये लोड करायची असल्यास हे वापरा.',
    reseedBtn: 'सर्व ग्राहक रीसीड करा',

    // Footer
    footerRights: 'सद्गुरू दुग्धालय • दैनिक दूध रतीब व्यवस्थापन प्रणाली',
    footerSecure: 'डेअरी चालक व मालक नियंत्रण कक्ष',
  },

  en: {
    // Brand
    dairyName: 'Sadguru Dairy',
    dairySub: '100% Pure Milk',
    dairyTagline: 'Daily Milk Delivery Management System',
    appPortal: 'Sadguru Dairy - Operator Portal',
    appDesc: 'Milk Register Book, Daily Deliveries, Customer Ledgers & Billing',

    // Header & Common
    langName: 'English',
    switchLang: 'मराठी मध्ये पहा',
    logout: 'Logout',
    adminRole: 'Dairy Operator / Owner',
    cowMilk: 'Cow Milk',
    buffaloMilk: 'Buffalo Milk',
    cow: 'Cow',
    buffalo: 'Buffalo',
    litres: 'Litres',
    rate: 'Rate',
    amount: 'Amount',
    save: 'Save',
    cancel: 'Cancel',
    status: 'Status',
    action: 'Action',
    notes: 'Note',
    srNo: 'Sr. No.',
    customerName: 'Customer Name',
    all: 'All',
    today: 'Today',
    future: 'Future',
    none: '-',
    absent: 'Skip / None (+)',
    close: 'Close',
    loading: 'Loading...',
    saving: 'Saving...',
    selectCustomerPrompt: 'Select Customer:',

    // Operator Login
    operatorLoginTitle: 'Dairy Operator Login',
    operatorLoginSub: 'Secure access for Dairy Owner & Operator',
    adminUsernameLabel: 'Username / Mobile Number:',
    adminPasswordLabel: 'Password:',
    quickAdminCreds: 'Fill Default Credentials (admin / admin)',
    operatorLoginBtn: 'Login to Operator Portal',

    // Unified Dashboard Tabs
    tabRegister: '1. Register Book (Grid)',
    tabDailyEntry: '2. Daily Milk Entry',
    tabCustomerDetails: '3. Customer Ledger & Calendar',
    tabCustomers: '4. Customer Management',
    tabBilling: '5. Monthly Bills & WhatsApp',
    tabSettings: '6. Rates & Settings',

    // Daily Quick Entry
    dailyEntryTitle: 'Daily Milk Delivery Entry',
    dailyEntrySub: 'Record daily milk delivered to any customer with 1 click',
    selectDateLabel: 'Select Date:',
    selectCustomerLabel: 'Select Customer:',
    searchCustPlaceholder: 'Search customer name or book no...',
    howMuchGiven: 'Select Milk Quantity:',
    halfLtr: '0.5 L',
    oneLtr: '1.0 L',
    oneHalfLtr: '1.5 L',
    twoLtr: '2.0 L',
    twoHalfLtr: '2.5 L',
    threeLtr: '3.0 L',
    holidayOption: 'Skip / 0 L (+)',
    otherQty: 'Custom Quantity:',
    entryRecordedSuccess: 'Milk entry successfully saved!',
    autoFillTodayBtn: "Auto-Fill Today's Deliveries",
    autoFillTooltip: 'Fill standard default daily quantity for all customers in 1 click',

    // Register Grid
    allCustomers: 'All Customers',
    searchCustomerInGrid: 'Search customer name or book number...',
    printRegisterBtn: 'Print Register',
    totalCowMilk: 'Total Cow Milk',
    totalBuffaloMilk: 'Total Buffalo Milk',
    totalAllMilk: 'Total Milk Delivered',
    totalMonthBill: 'Total Month Bill (Revenue)',
    totalLitresCol: 'Total L',
    rateCol: 'Rate ₹',
    amountCol: 'Amount ₹',
    actionCol: 'Action',
    grandTotal: 'Grand Total Milk Delivered',

    // Single Customer Details / Calendar
    custOverviewTitle: 'Customer Monthly Calendar & Details',
    custOverviewSub: 'Individual 1 to 31 day delivery calendar, monthly totals and printable bill slip',
    totalMilkTaken: 'Total Milk Taken',
    thisMonthMilk: 'Total delivered this month',
    ratePerLitre: 'Rate per Litre',
    monthlyBill: "This Month's Bill",
    totalPayable: 'Total Amount Payable',
    daysStats: 'Delivery Statistics',
    daysMilkTaken: 'Days Milk Taken',
    daysAbsent: 'Days Skipped',
    outOfTotal: 'Out of {days} days',
    myRegisterCalendar: 'Monthly Delivery Register',
    calendarHint: 'Click on any day cell to instantly edit that date milk',
    milkTakenLegend: 'Milk Taken',
    absentLegend: 'Skipped / No Milk (0 L)',
    todayLegend: 'Today',
    editDateMilk: 'Change Milk for Date: {day} {month}',
    chooseQtyForDate: 'Select milk quantity for this date:',
    typeQty: 'Enter Litres:',
    optionalNote: 'Note (Optional):',
    noteReasonPlaceholder: 'Reason e.g. Guests, Holiday...',

    // Customer Management
    addNewCustomer: '+ Add New Customer',
    phoneCol: 'Mobile Number',
    typeCol: 'Type',
    defaultQtyCol: 'Default Daily',
    ratePerLtrCol: 'Rate / Litre',
    pinCol: 'PIN',
    managementCol: 'Actions',
    defaultWord: 'Default',
    editCustomerTitle: 'Edit Customer Information',
    addCustomerTitle: 'Add New Customer',
    custNameMarathiLabel: 'Customer Name (Marathi): *',
    custNameEnglishLabel: 'English Name:',
    serialNoLabel: 'Register Serial No (Sr No):',
    milkTypeLabel: 'Milk Type:',
    defaultQtyLabel: 'Standard Daily Quantity (Litres):',
    customRateLabel: 'Custom Rate (₹/L) (Optional):',
    phoneInputLabel: 'Mobile Phone:',
    pinInputLabel: 'Login PIN:',

    // Billing & WhatsApp
    billingTitle: 'Monthly Bills & WhatsApp Statements',
    billingSub: 'Review each customer bill, print physical receipts, or send WhatsApp messages directly',
    printReceiptBtn: 'Print Receipt',
    sendWhatsAppBtn: 'WhatsApp Bill',

    // Receipt Modal
    receiptTitle: 'Milk Delivery Bill Receipt',
    receiptMonth: 'Bill Month:',
    receiptCustName: 'Customer Name:',
    receiptMilkType: 'Milk Type:',
    receiptTotalMilk: 'Monthly Total Milk:',
    receiptRate: 'Rate per Litre:',
    receiptPayableTotal: 'Total Payable Amount',
    receiptStatusPending: 'Pending Payment',
    receiptUpiHint: 'Pay Online via UPI:',
    receiptBlessing: 'Thank you for your patronage! Sadguru Dairy.',

    // Settings
    settingsTitle: 'Dairy Settings & Milk Rates',
    settingsSub: 'Configure cow & buffalo milk rates, dairy business name, and UPI ID',
    cowRateLabel: 'Cow Milk Rate (₹ per Litre):',
    buffaloRateLabel: 'Buffalo Milk Rate (₹ per Litre):',
    dairyNameLabel: 'Dairy Business Name:',
    taglineLabel: 'Tagline (e.g. 100% Pure Milk):',
    dairyPhoneLabel: 'Contact Phone Number:',
    upiIdLabel: 'UPI ID for Payment (Shown on bills):',
    saveSettingsBtn: 'Save Settings',
    reseedTitle: 'Reseed Register Customers',
    reseedSub: 'Reload all original 94 customers from the notebook images if needed.',
    reseedBtn: 'Reseed All 94 Customers',

    // Footer
    footerRights: 'Sadguru Dairy • Daily Milk Delivery Register Management System',
    footerSecure: 'Dairy Operator & Owner Control Desk',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('nilesh_dairy_lang') || 'mr';
  });

  const toggleLanguage = () => {
    const next = language === 'mr' ? 'en' : 'mr';
    setLanguage(next);
    localStorage.setItem('nilesh_dairy_lang', next);
  };

  const setSpecificLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('nilesh_dairy_lang', lang);
  };

  const t = (key, params = {}) => {
    const langDict = translations[language] || translations.mr;
    let text = langDict[key] || translations.mr[key] || key;
    Object.keys(params).forEach((paramKey) => {
      text = text.replace(`{${paramKey}}`, params[paramKey]);
    });
    return text;
  };

  const customerName = (c) => {
    if (!c) return '';
    if (language === 'en') {
      return c.nameEnglish || c.nameMarathi || c.name;
    }
    return c.nameMarathi || c.name || c.nameEnglish;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        setLanguage: setSpecificLanguage,
        t,
        customerName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
