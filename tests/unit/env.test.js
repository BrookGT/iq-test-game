const { readApiUrl, readSiteUrl, readApiEndpoint } = require('../../lib/env');

describe('env', () => {
  it('reads api and site urls from env', () => {
    expect(readApiUrl({ NEXT_PUBLIC_BASE_URL: 'http://127.0.0.1:5000' }))
      .toBe('http://127.0.0.1:5000');
    expect(readSiteUrl({ NEXT_PUBLIC_APP_WEB_URL: 'http://localhost:3000' }))
      .toBe('http://localhost:3000');
  });

  it('falls back to localhost defaults', () => {
    expect(readApiUrl({})).toBe('http://127.0.0.1:5000');
    expect(readSiteUrl({})).toBe('http://localhost:3000');
    expect(readApiEndpoint({})).toBe('/api/');
  });

  it('normalizes endpoint prefix', () => {
    expect(readApiEndpoint({ NEXT_PUBLIC_END_POINT: 'api/' })).toBe('/api/');
    expect(readApiEndpoint({ NEXT_PUBLIC_END_POINT: '/v1/' })).toBe('/v1/');
  });

  it('trims api url values', () => {
    expect(readApiUrl({ NEXT_PUBLIC_BASE_URL: ' http://127.0.0.1:5000/ ' }))
      .toBe('http://127.0.0.1:5000');
  });

  it('reads values from process env when no argument is passed', () => {
    const prevApi = process.env.NEXT_PUBLIC_BASE_URL;
    const prevSite = process.env.NEXT_PUBLIC_APP_WEB_URL;
    const prevEndpoint = process.env.NEXT_PUBLIC_END_POINT;
    process.env.NEXT_PUBLIC_BASE_URL = 'http://api.test';
    process.env.NEXT_PUBLIC_APP_WEB_URL = 'http://site.test';
    process.env.NEXT_PUBLIC_END_POINT = '/v2/';
    expect(readApiUrl()).toBe('http://api.test');
    expect(readSiteUrl()).toBe('http://site.test');
    expect(readApiEndpoint()).toBe('/v2/');
    process.env.NEXT_PUBLIC_BASE_URL = prevApi;
    process.env.NEXT_PUBLIC_APP_WEB_URL = prevSite;
    process.env.NEXT_PUBLIC_END_POINT = prevEndpoint;
  });
});
