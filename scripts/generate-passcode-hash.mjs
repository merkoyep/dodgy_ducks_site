import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { stdin as input, stdout as output } from 'node:process';

const ITERATIONS = Number(process.env.VITE_SITE_PASSCODE_ITERATIONS || 250000);

function readHiddenLine(prompt) {
  if (!input.isTTY) {
    return new Promise((resolve) => {
      let value = '';
      input.setEncoding('utf8');
      input.on('data', (chunk) => { value += chunk; });
      input.on('end', () => resolve(value.trimEnd()));
    });
  }

  return new Promise((resolve) => {
    let value = '';
    const wasRaw = input.isRaw;

    output.write(prompt);
    input.setRawMode(true);
    input.resume();
    input.setEncoding('utf8');

    const cleanup = () => {
      input.setRawMode(Boolean(wasRaw));
      input.pause();
      input.off('data', onData);
      output.write('\n');
    };

    const onData = (char) => {
      if (char === '\u0003') {
        cleanup();
        process.exit(130);
      }

      if (char === '\r' || char === '\n') {
        cleanup();
        resolve(value);
        return;
      }

      if (char === '\u007f' || char === '\b') {
        if (value.length > 0) {
          value = value.slice(0, -1);
          output.write('\b \b');
        }
        return;
      }

      if (char >= ' ') {
        value += char;
        output.write('*');
      }
    };

    input.on('data', onData);
  });
}

const passcode = process.env.PASSCODE || await readHiddenLine('Passcode to hash: ');
if (!passcode) {
  console.error('Passcode cannot be empty.');
  process.exit(1);
}

const salt = process.env.VITE_SITE_PASSCODE_SALT || randomBytes(16).toString('hex');
const hash = pbkdf2Sync(passcode, salt, ITERATIONS, 32, 'sha256').toString('hex');

console.log('\nAdd these as GitHub Actions repository secrets:');
console.log(`VITE_SITE_PASSCODE_SALT=${salt}`);
console.log(`VITE_SITE_PASSCODE_HASH=${hash}`);
console.log(`VITE_SITE_PASSCODE_ITERATIONS=${ITERATIONS}`);
