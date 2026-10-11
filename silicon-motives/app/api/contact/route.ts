import { handleContactRequest } from '@/lib/contact-route.mjs';
export const runtime = 'nodejs';
export const maxDuration = 30;
export async function POST(request: Request) { return handleContactRequest(request); }
