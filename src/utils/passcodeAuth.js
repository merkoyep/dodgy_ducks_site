const DEFAULT_ITERATIONS = 250000;

export const PASSCODE_SESSION_KEY = 'dragonboat-planner-passcode-ok';
export const PASSCODE_ATTEMPTS_KEY = 'dragonboat-planner-passcode-attempts';
export const PASSCODE_LOCK_UNTIL_KEY = 'dragonboat-planner-passcode-lock-until';

export const passcodeConfig = {
  hash: import.meta.env.VITE_SITE_PASSCODE_HASH || '',
  salt: import.meta.env.VITE_SITE_PASSCODE_SALT || '',
  iterations: Number(import.meta.env.VITE_SITE_PASSCODE_ITERATIONS || DEFAULT_ITERATIONS),
};

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function normalizeHex(value = '') {
  return String(value).trim().toLowerCase();
}

function constantTimeEquals(a, b) {
  const left = normalizeHex(a);
  const right = normalizeHex(b);
  if (left.length !== right.length) return false;

  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
}

export function isPasscodeConfigured(config = passcodeConfig) {
  return Boolean(config.hash && config.salt && Number.isFinite(config.iterations) && config.iterations > 0);
}

export async function derivePasscodeHash(passcode, salt, iterations = DEFAULT_ITERATIONS) {
  if (!window.crypto?.subtle) {
    throw new Error('Secure browser crypto is unavailable.');
  }

  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passcode),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );

  const bits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  );

  return bytesToHex(new Uint8Array(bits));
}

export async function verifyPasscode(passcode, config = passcodeConfig) {
  if (!isPasscodeConfigured(config)) return false;
  const derivedHash = await derivePasscodeHash(passcode, config.salt, config.iterations);
  return constantTimeEquals(derivedHash, config.hash);
}
