export async function submitIdea(values, fetcher = fetch) {
  let response;
  try {
    response = await fetcher('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values), signal: AbortSignal.timeout(35000),
    });
  } catch (error) {
    throw new Error(error.name === 'TimeoutError'
      ? 'Sending is taking longer than expected. Please email hello@siliconmotives.com if you need to follow up.'
      : 'Please check your connection or email hello@siliconmotives.com directly.');
  }
  let result;
  try { result = await response.json(); } catch { throw new Error('Please try again or email hello@siliconmotives.com directly.'); }
  if (!response.ok || !result.ok) throw new Error(result.error || 'Please try again or email hello@siliconmotives.com directly.');
}
