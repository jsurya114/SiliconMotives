import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

try {
  loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url)));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

// Only these public values are sent to the browser; never serialize process.env.
export function browserConfig() {
  const config = {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
  };
  return `window.SM_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
}
