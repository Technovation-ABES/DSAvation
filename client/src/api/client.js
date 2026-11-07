export async function api(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const requestId = `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  try {
    const response = await fetch(`/api${path}`, {
      credentials: 'same-origin',
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        'X-Client-Request-Id': requestId,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMsg = payload.error || `Request failed (${response.status}).`;
      console.warn(
        `[DSAvation API ${response.status}] ${method} /api${path} (ref: ${payload.reqId || requestId}):`,
        errorMsg
      );
      const err = new Error(errorMsg);
      err.status = response.status;
      err.payload = payload;
      err.requestId = payload.reqId || requestId;
      throw err;
    }
    return payload;
  } catch (error) {
    if (error.name !== 'AbortError' && !error.status) {
      console.error(
        `[DSAvation Network Error] ${method} /api${path} (ref: ${requestId}):`,
        error.message
      );
    }
    throw error;
  }
}

