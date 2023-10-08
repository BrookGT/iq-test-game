const cryptoJs = require('crypto-js');

const FIREBASE_AUTH_ERRORS = {
  'auth/user-not-found': 'User not found',
  'auth/wrong-password': 'Invalid password',
  'auth/email-already-in-use': 'Email already in use',
  'auth/invalid-email': 'Invalid email address',
  'auth/user-disabled': 'User account has been disabled',
  'auth/too-many-requests': 'Too many requests, try again later',
  'auth/operation-not-allowed': 'Operation not allowed',
  'auth/internal-error': 'Internal error occurred',
};

function truncate(text, maxLength) {
  if (!text) {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

function isValidSlug(slug) {
  return Boolean(slug && slug.trim() !== '');
}

function decryptAnswer(encryptedJson, key) {
  if (!encryptedJson || !key) {
    return '';
  }
  const iv = cryptoJs.enc.Hex.parse(encryptedJson.iv);
  const paddedKey = cryptoJs.enc.Utf8.parse(`${key}0000`);
  const cipherParams = cryptoJs.lib.CipherParams.create({
    ciphertext: cryptoJs.enc.Base64.parse(encryptedJson.ciphertext),
  });
  const decrypted = cryptoJs.AES.decrypt(cipherParams, paddedKey, { iv }).toString(cryptoJs.enc.Utf8);
  return decrypted || '';
}

function calculateCoins(score, totalQuestions, config) {
  const percentage = (score * 100) / totalQuestions;
  const minimum = Number(config.minimum_coins_winning_percentage);
  const maximum = Number(config.maximum_winning_coins);
  let earnedCoins = 0;

  if (percentage >= minimum) {
    earnedCoins = maximum;
  } else {
    earnedCoins = Math.round(maximum - (minimum - percentage) / 10);
  }

  return earnedCoins < 0 ? 0 : earnedCoins;
}

function calculateScore(correctCount, totalQuestions, correctTypeQuizScore, incorrectTypeQuizScore) {
  const incorrectCount = totalQuestions - correctCount;
  const correctAnswerScore = correctCount * Number(correctTypeQuizScore);
  const incorrectAnswerScore = incorrectCount * Number(incorrectTypeQuizScore);
  return correctAnswerScore - incorrectAnswerScore;
}

function firebaseAuthErrorMessage(errorCode) {
  if (Object.prototype.hasOwnProperty.call(FIREBASE_AUTH_ERRORS, errorCode)) {
    return FIREBASE_AUTH_ERRORS[errorCode];
  }
  return `Unknown error occurred: ${errorCode}`;
}

module.exports = {
  truncate,
  isValidSlug,
  decryptAnswer,
  calculateCoins,
  calculateScore,
  firebaseAuthErrorMessage,
  FIREBASE_AUTH_ERRORS,
};
