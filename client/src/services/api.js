const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('rasalokal_token') || '';
}

export function setAuthToken(token) {
  if (token) localStorage.setItem('rasalokal_token', token);
  else localStorage.removeItem('rasalokal_token');
}

function authHeaders() {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function loginUser(emailOrRole) {
  const payload = typeof emailOrRole === 'object' 
    ? emailOrRole 
    : (String(emailOrRole).includes('@') ? { email: emailOrRole } : { role: emailOrRole });
  
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.success && data.data?.token) {
    setAuthToken(data.data.token);
  }
  return data;
}

export async function fetchRestaurants(query = '', category = '') {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'All') params.append('category', category);
    
    const res = await fetch(`${API_BASE}/restaurants?${params.toString()}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Fetch error:', err);
    return [];
  }
}

export async function fetchRestaurantById(id) {
  try {
    const res = await fetch(`${API_BASE}/restaurants/${id}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error('Fetch resto error:', err);
    return null;
  }
}

export async function fetchRestaurantReviews(restaurantId) {
  try {
    const res = await fetch(`${API_BASE}/reviews/${restaurantId}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Fetch reviews error:', err);
    return [];
  }
}

export async function verifyVoucherCode(code) {
  const res = await fetch(`${API_BASE}/vouchers/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ code })
  });
  return res.json();
}

export async function submitReview(payload) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchMyDiscountVouchers() {
  try {
    const res = await fetch(`${API_BASE}/vouchers/my-discounts`, {
      headers: { ...authHeaders() }
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    return [];
  }
}

export async function issueCashierVoucher(payload) {
  const res = await fetch(`${API_BASE}/vouchers/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function redeemCashierDiscount(payload) {
  const res = await fetch(`${API_BASE}/vouchers/redeem-discount`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchMerchantAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/merchant/stats`, {
      headers: { ...authHeaders() }
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    return null;
  }
}

export async function fetchUserProfile() {
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: { ...authHeaders() }
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    return null;
  }
}
