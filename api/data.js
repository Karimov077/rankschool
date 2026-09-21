const CLOUD_BUCKET = 'https://kvdb.io/X7nSnNuhtRNBG5eEBiFtFz';

function getKey(request) {
  const url = new URL(request.url, `https://${request.headers.host || 'localhost'}`);
  return url.searchParams.get('key') || 'ustozrank_data_v1';
}

module.exports = async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'PUT') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const endpoint = `${CLOUD_BUCKET}/${encodeURIComponent(getKey(request))}`;
    const upstream = await fetch(endpoint, {
      method: request.method,
      headers: request.method === 'PUT' ? { 'Content-Type': 'application/json' } : undefined,
      body: request.method === 'PUT' ? JSON.stringify(request.body) : undefined
    });
    const body = await upstream.text();
    response.status(upstream.status);
    response.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    response.send(body);
  } catch (error) {
    response.status(502).json({ error: 'Cloud storage unavailable' });
  }
};