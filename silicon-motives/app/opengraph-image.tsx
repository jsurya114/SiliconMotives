import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'SiliconMotives';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const card = await readFile(join(process.cwd(), 'public/brand/social/siliconmotives-og-navy.png'));
  const imageUrl = `data:image/png;base64,${card.toString('base64')}`;
  return new ImageResponse(<img src={imageUrl} alt="SiliconMotives" width={1200} height={630} style={{ display: 'block', width: '100%', height: '100%' }} />, size);
}
