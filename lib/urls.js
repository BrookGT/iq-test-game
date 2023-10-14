function trimTrailingSlash(url) {
  return url.replace(/\/+$/, '');
}

function resolveBackendUrl(value, fallback = 'http://127.0.0.1:5000') {
  const raw = (value || fallback).trim();
  return trimTrailingSlash(raw);
}

function joinUrl(base, path) {
  const normalizedBase = trimTrailingSlash(base);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

module.exports = {
  trimTrailingSlash,
  resolveBackendUrl,
  joinUrl,
};
