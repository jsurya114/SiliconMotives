import { body, handleError, HttpError, imageUpload, json, requireAdmin, sameOrigin, supabase } from '../lib/cms.mjs';
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') throw new HttpError(405, 'Method not allowed.');
    sameOrigin(req);
    const { token } = await requireAdmin(req);
    const image = imageUpload(await body(req, 2900000));
    await supabase(`/storage/v1/object/site-media/${image.path}`, { token, method: 'POST', raw: image.bytes, headers: { 'Content-Type': image.type, 'x-upsert': 'false' } });
    json(res, 201, { url: `${process.env.SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/site-media/${image.path}` });
  } catch (error) { handleError(res, error); }
}
