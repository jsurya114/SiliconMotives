import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'SiliconMotives — Custom Software, Cloud Infrastructure & DevOps';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/images/brand/logo-horizontal.png'));
  const logoUrl = `data:image/png;base64,${logo.toString('base64')}`;
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '72px', background: '#ecf0f2', color: '#0b1a2b', fontFamily: 'Arial, sans-serif',
    }}>
      <img src={logoUrl} alt="SiliconMotives" width={515} height={100} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', fontSize: 52, fontWeight: 700, letterSpacing: -2 }}>Software. Infrastructure. Reliability.</div>
        <div style={{ display: 'flex', fontSize: 30, color: '#40566a' }}>Custom Software · Cloud Infrastructure · DevOps</div>
      </div>
      <div style={{ display: 'flex', color: '#40566a', fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>KERALA, INDIA · REMOTE-FIRST</div>
    </div>,
    size,
  );
}
