(function initializeApiClient(global) {
  const config = global.APP_CONFIG;

  if (!config || !config.apiBaseUrl) {
    throw new Error("APP_CONFIG.apiBaseUrl is not configured.");
  }

  async function request(path, options = {}) {
    const requestId = global.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const response = await fetch(`${config.apiBaseUrl}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "X-Request-ID": requestId,
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const error = new Error(`API request failed with HTTP ${response.status}.`);
      error.status = response.status;
      error.body = body;
      throw error;
    }

    return {
      body,
      requestId: response.headers.get("X-Request-ID") || body?.requestId || requestId,
    };
  }

  global.AppApi = Object.freeze({
    request,
    status: () => request("/status"),
    health: () => request("/health"),
    ping: () => request("/ping"),
  });
})(window);
