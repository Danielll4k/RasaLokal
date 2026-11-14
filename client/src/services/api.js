const API_BASE = '/api';

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

export async function verifyVoucherCode(code) {
  const res = await fetch(`${API_BASE}/vouchers/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  return res.json();
}

export async function submitReview(payload) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchMyDiscountVouchers() {
  try {
    const res = await fetch(`${API_BASE}/vouchers/my-discounts`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    return [];
  }
}

export async function issueCashierVoucher(payload) {
  const res = await fetch(`${API_BASE}/vouchers/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function redeemCashierDiscount(payload) {
  const res = await fetch(`${API_BASE}/vouchers/redeem-discount`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchMerchantAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/merchant/stats`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    return null;
  }
}

export async function fetchUserProfile() {
  try {
    const res = await fetch(`${API_BASE}/profile`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    return null;
  }
}
