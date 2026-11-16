// Marathi language and formatting utilities

export const MARATHI_MONTHS = [
  'जानेवारी',
  'फेब्रुवारी',
  'मार्च',
  'एप्रिल',
  'मे',
  'जून',
  'जुलै',
  'ऑगस्ट',
  'सप्टेंबर',
  'ऑक्टोबर',
  'नोव्हेंबर',
  'डिसेंबर',
];

export const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MARATHI_DAYS = [
  'रविवार',
  'सोमवार',
  'मंगळवार',
  'बुधवार',
  'गुरुवार',
  'शुक्रवार',
  'शनिवार',
];

export const toMarathiDigits = (num) => {
  if (num === null || num === undefined) return '';
  const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => marathiDigits[parseInt(digit)]);
};

export const formatMilkQuantity = (qty) => {
  if (qty === null || qty === undefined) return '-';
  if (qty === 0) return '० / +';
  if (qty === 0.5) return '०.५ L (||)';
  if (qty === 1.5) return '१.५ L (१||)';
  if (qty === 2.5) return '२.५ L (२||)';
  return `${qty} L`;
};

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹०';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

export const getMonthNameMarathi = (monthNum) => {
  return MARATHI_MONTHS[monthNum - 1] || '';
};

export const getMonthNameEnglish = (monthNum) => {
  return ENGLISH_MONTHS[monthNum - 1] || '';
};
