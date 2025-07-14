const cryptoJs = require('crypto-js');
const {
  truncate,
  isValidSlug,
  decryptAnswer,
  calculateCoins,
  calculateScore,
  firebaseAuthErrorMessage,
} = require('../../lib/quiz');

function encryptAnswer(value, key) {
  const paddedKey = cryptoJs.enc.Utf8.parse(`${key}0000`);
  const iv = cryptoJs.lib.WordArray.random(16);
  const encrypted = cryptoJs.AES.encrypt(value, paddedKey, { iv });
  return {
    ciphertext: encrypted.ciphertext.toString(cryptoJs.enc.Base64),
    iv: iv.toString(cryptoJs.enc.Hex),
  };
}

describe('quiz helpers', () => {
  it('truncates long text', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
    expect(truncate('hi', 5)).toBe('hi');
    expect(truncate('', 5)).toBe('');
  });

  it('validates slugs', () => {
    expect(isValidSlug('math-basics')).toBe(true);
    expect(isValidSlug('   ')).toBe(false);
  });

  it('decrypts quiz answers', () => {
    const payload = encryptAnswer('Paris', 'player-1');
    expect(decryptAnswer(payload, 'player-1')).toBe('Paris');
    expect(decryptAnswer(null, 'player-1')).toBe('');
  });

  it('calculates coins from score percentage', () => {
    const config = { minimum_coins_winning_percentage: 70, maximum_winning_coins: 4 };
    expect(calculateCoins(4, 5, config)).toBe(4);
    expect(calculateCoins(2, 5, config)).toBe(1);
    expect(calculateCoins(0, 5, config)).toBe(0);
  });

  it('calculates weighted score', () => {
    expect(calculateScore(4, 5, 2, 1)).toBe(7);
    expect(calculateScore(1, 5, 2, 1)).toBe(-2);
  });

  it('returns empty string for invalid decrypt payloads', () => {
    expect(decryptAnswer({ ciphertext: 'bad', iv: '1234' }, 'player-1')).toBe('');
    expect(decryptAnswer(null, 'player-1')).toBe('');
  });

  it('maps firebase auth errors', () => {
    expect(firebaseAuthErrorMessage('auth/wrong-password')).toBe('Invalid password');
    expect(firebaseAuthErrorMessage('auth/unknown')).toContain('Unknown error');
  });
});
