import { useEffect, useMemo, useState } from 'react';
import {
  PASSCODE_ATTEMPTS_KEY,
  PASSCODE_LOCK_UNTIL_KEY,
  PASSCODE_SESSION_KEY,
  isPasscodeConfigured,
  passcodeConfig,
  verifyPasscode,
} from '../utils/passcodeAuth';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

function getStoredNumber(key) {
  const value = Number(window.localStorage.getItem(key));
  return Number.isFinite(value) ? value : 0;
}

function clearAttemptState() {
  window.localStorage.removeItem(PASSCODE_ATTEMPTS_KEY);
  window.localStorage.removeItem(PASSCODE_LOCK_UNTIL_KEY);
}

function FullScreenPanel({ children }) {
  return (
    <div className='min-h-screen p-5 flex items-center justify-center'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-8'>
        {children}
      </div>
    </div>
  );
}

export default function PasscodeGate({ children }) {
  if (import.meta.env.DEV) return children;

  const configured = isPasscodeConfigured(passcodeConfig);
  const [isUnlocked, setIsUnlocked] = useState(() => window.sessionStorage.getItem(PASSCODE_SESSION_KEY) === 'true');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const lockUntil = useMemo(() => getStoredNumber(PASSCODE_LOCK_UNTIL_KEY), [now]);
  const isLocked = lockUntil > now;
  const remainingLockSeconds = Math.ceil((lockUntil - now) / 1000);

  useEffect(() => {
    if (!isLocked) return undefined;
    const timeout = window.setTimeout(() => setNow(Date.now()), Math.min(lockUntil - now, 1000));
    return () => window.clearTimeout(timeout);
  }, [isLocked, lockUntil, now]);

  if (isUnlocked) return children;

  if (!configured) {
    return (
      <FullScreenPanel>
        <h1 className='text-2xl font-bold text-gray-900 mb-3'>Access is not configured</h1>
        <p className='text-gray-700'>
          This production build is locked because no passcode hash was provided at build time.
        </p>
      </FullScreenPanel>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNow(Date.now());

    const currentLockUntil = getStoredNumber(PASSCODE_LOCK_UNTIL_KEY);
    if (currentLockUntil > Date.now()) {
      setError(`Too many attempts. Try again in ${Math.ceil((currentLockUntil - Date.now()) / 1000)} seconds.`);
      return;
    }

    if (!passcode) {
      setError('Enter the passcode to continue.');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      const ok = await verifyPasscode(passcode);
      if (ok) {
        clearAttemptState();
        window.sessionStorage.setItem(PASSCODE_SESSION_KEY, 'true');
        setIsUnlocked(true);
        return;
      }

      const nextAttempts = getStoredNumber(PASSCODE_ATTEMPTS_KEY) + 1;
      window.localStorage.setItem(PASSCODE_ATTEMPTS_KEY, String(nextAttempts));

      if (nextAttempts >= MAX_ATTEMPTS) {
        const nextLockUntil = Date.now() + LOCKOUT_MS;
        window.localStorage.setItem(PASSCODE_LOCK_UNTIL_KEY, String(nextLockUntil));
        window.localStorage.setItem(PASSCODE_ATTEMPTS_KEY, '0');
        setNow(Date.now());
        setError('Too many attempts. Please wait before trying again.');
      } else {
        setError('That passcode did not work.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to verify the passcode in this browser.');
    } finally {
      setIsChecking(false);
      setPasscode('');
    }
  };

  return (
    <FullScreenPanel>
      <div className='text-center mb-6'>
        <div className='text-4xl mb-3'>🔒</div>
        <h1 className='text-3xl font-bold text-gray-900'>Team TBD</h1>
        <p className='text-gray-600 mt-2'>Enter the passcode to view the planner.</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <label className='block'>
          <span className='block text-sm font-bold text-gray-700 mb-2'>Passcode</span>
          <input
            type='password'
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            disabled={isChecking || isLocked}
            autoComplete='current-password'
            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none disabled:bg-gray-100'
            autoFocus
          />
        </label>

        {error && <p className='text-sm font-semibold text-red-600'>{error}</p>}
        {isLocked && (
          <p className='text-sm text-gray-600'>Try again in {remainingLockSeconds} seconds.</p>
        )}

        <button
          type='submit'
          disabled={isChecking || isLocked}
          className='w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors'
        >
          {isChecking ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </FullScreenPanel>
  );
}
