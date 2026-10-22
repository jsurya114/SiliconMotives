import { ImageResponse } from 'next/og';

export const alt = 'SiliconMotives — Custom Software, Cloud Infrastructure & DevOps';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '72px', background: '#0b1a2b', color: '#ecf0f2', fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ display: 'flex', color: '#7ee2d1', fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>ENGINEERING FROM KERALA · REMOTE-FIRST</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, letterSpacing: -3 }}>SiliconMotives</div>
        <div style={{ display: 'flex', fontSize: 34, color: '#c5d0d8' }}>Custom Software · Cloud Infrastructure · DevOps</div>
      </div>
      <div style={{ display: 'flex', width: 96, height: 8, borderRadius: 4, background: '#7ee2d1' }} />
    </div>,
    size,
  );
}
