const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '');

export const apiUrl = (path) => {
  if (!path.startsWith('/')) {
    return `${normalizedBaseUrl}/${path}`;
  }

  return `${normalizedBaseUrl}${path}`;
};
