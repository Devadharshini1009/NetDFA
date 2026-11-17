import cp from 'node:child_process';
import os from 'node:os';

export function getSystemDnsServers() {
  if (os.platform() !== 'win32') return [];
  try {
    const raw = cp.execFileSync('powershell.exe', [
      '-NoProfile',
      '-Command',
      '(Get-DnsClientServerAddress -AddressFamily IPv4).ServerAddresses',
    ], { encoding: 'utf8', timeout: 3000 });

    const servers = raw
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(s => s && s !== '127.0.0.1' && !s.startsWith('127.'));

    return [...new Set(servers)];
  } catch (err) {
    return [];
  }
}

console.log('Detected servers:', getSystemDnsServers());
