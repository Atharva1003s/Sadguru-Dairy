// Centralized API client for Sadguru Dairy App (सद्गुरू दुग्धालय)

// In production, VITE_API_URL points to the live Render backend
const isDev = import.meta.env.DEV;
let rawBase = import.meta.env.VITE_API_URL || (isDev ? '/api' : 'https://sadguru-dairy-api.onrender.com/api');
rawBase = rawBase.trim().replace(/\/+$/, '');
// Automatically ensure /api suffix if missing (e.g. if user entered https://sadguru-dairy-api.onrender.com)
if (!rawBase.endsWith('/api') && rawBase !== '' && rawBase !== '/api') {
  rawBase = `${rawBase}/api`;
}
const API_BASE = rawBase;

const getAuthHeaders = () => {
  const token = localStorage.getItem('sadguru_dairy_token') || localStorage.getItem('nilesh_dairy_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  adminLogin: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  customerLogin: async (phone, pin) => {
    const res = await fetch(`${API_BASE}/auth/customer-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, pin }),
    });
    return res.json();
  },

  quickCustomerLogin: async (customerId, pin) => {
    const res = await fetch(`${API_BASE}/auth/quick-customer-select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, pin }),
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  changePin: async (oldPin, newPin) => {
    const res = await fetch(`${API_BASE}/auth/change-pin`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ oldPin, newPin }),
    });
    return res.json();
  },

  // Customers
  getCustomerDirectory: async () => {
    const res = await fetch(`${API_BASE}/customers/directory`);
    return res.json();
  },

  getAllCustomers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/customers?${query}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  getCustomerById: async (id) => {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  createCustomer: async (data) => {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateCustomer: async (id, data) => {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  resetCustomerPin: async (id) => {
    const res = await fetch(`${API_BASE}/customers/${id}/reset-pin`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  deleteCustomer: async (id) => {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Milk Entries
  getMonthlyGrid: async (year, month, category = 'all') => {
    const res = await fetch(
      `${API_BASE}/entries/monthly-grid?year=${year}&month=${month}&category=${category}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return res.json();
  },

  getCustomerEntries: async (customerId, year, month) => {
    const res = await fetch(
      `${API_BASE}/entries/customer/${customerId}?year=${year}&month=${month}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return res.json();
  },

  recordMilk: async ({ customerId, date, quantity, notes }) => {
    const res = await fetch(`${API_BASE}/entries/record`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ customerId, date, quantity, notes }),
    });
    return res.json();
  },

  batchFillToday: async (date, category = 'all') => {
    const res = await fetch(`${API_BASE}/entries/batch-fill-today`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ date, category }),
    });
    return res.json();
  },

  deleteEntry: async (id) => {
    const res = await fetch(`${API_BASE}/entries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  updateSettings: async (data) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  reseedCustomers: async () => {
    const res = await fetch(`${API_BASE}/settings/reseed`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};
