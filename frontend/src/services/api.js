/**
 * API Service for interacting with backend REST endpoints
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const lookupDomainApi = async (domain) => {
  const response = await fetch(`${API_BASE}/dns/lookup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ domain }),
  });

  const data = await response.json();
  if (!response.ok && response.status !== 400) {
    throw new Error(data.message || data.error || `Server error (${response.status})`);
  }
  return data;
};

export const fetchHistoryApi = async (limit = 50) => {
  const response = await fetch(`${API_BASE}/dns/history?limit=${limit}`);
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || data.error || 'Failed to fetch history');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const fetchHistoryItemApi = async (id) => {
  const response = await fetch(`${API_BASE}/dns/history/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to fetch history item');
  }
  return data;
};

export const deleteHistoryItemApi = async (id) => {
  const response = await fetch(`${API_BASE}/dns/history/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to delete history item');
  }
  return data;
};

export const fetchHealthApi = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) return { status: 'OFFLINE' };
    return await response.json();
  } catch (err) {
    return { status: 'OFFLINE', error: err.message };
  }
};

export const fetchDfaDefinitionApi = async () => {
  const response = await fetch(`${API_BASE}/dns/dfa/definition`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch DFA definition');
  }
  return data;
};
