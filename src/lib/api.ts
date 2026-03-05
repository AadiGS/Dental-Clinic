const API_BASE = '/api';

export const api = {
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async getSlots(date) {
    const res = await fetch(`${API_BASE}/slots?date=${date}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.details || err.error || 'Failed to fetch slots');
    }
    return res.json();
  },

  async bookAppointment(data) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to book appointment');
    return res.json();
  },

  async getAdminAppointments(token, date) {
    const res = await fetch(`${API_BASE}/admin/appointments?date=${date}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  async adminBookAppointment(token, data) {
    const res = await fetch(`${API_BASE}/admin/appointments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to book appointment');
    return res.json();
  },

  async cancelAppointment(token, id) {
    const res = await fetch(`${API_BASE}/admin/appointments/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to cancel appointment');
    return res.json();
  }
};
