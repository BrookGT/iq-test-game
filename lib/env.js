const { resolveBackendUrl } = require('./urls');

function readApiUrl(env = process.env) {
  return resolveBackendUrl(env.NEXT_PUBLIC_BASE_URL, 'http://127.0.0.1:5000');
}

function readSiteUrl(env = process.env) {
  return resolveBackendUrl(env.NEXT_PUBLIC_APP_WEB_URL, 'http://localhost:3000');
}

function readApiEndpoint(env = process.env) {
  const endpoint = (env.NEXT_PUBLIC_END_POINT || '/api/').trim();
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

module.exports = {
  readApiUrl,
  readSiteUrl,
  readApiEndpoint,
};
