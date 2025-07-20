const {
  trimTrailingSlash,
  resolveBackendUrl,
  joinUrl,
} = require('../../lib/urls');

describe('urls', () => {
  it('trims trailing slashes', () => {
    expect(trimTrailingSlash('http://127.0.0.1:5000/')).toBe('http://127.0.0.1:5000');
  });

  it('resolves backend url with fallback', () => {
    expect(resolveBackendUrl('http://api.example.com/')).toBe('http://api.example.com');
    expect(resolveBackendUrl(undefined, 'http://127.0.0.1:5000')).toBe('http://127.0.0.1:5000');
  });

  it('joins base url and path', () => {
    expect(joinUrl('http://127.0.0.1:5000', '/api/users')).toBe('http://127.0.0.1:5000/api/users');
    expect(joinUrl('http://127.0.0.1:5000/', 'api/users')).toBe('http://127.0.0.1:5000/api/users');
  });
});
