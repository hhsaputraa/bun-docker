export function jsonResponse(
  success: boolean,
  status: number,
  options?: {
    data?: unknown;
    message?: string;
    error?: string;
  }
): Response {
  return new Response(
    JSON.stringify({
      success,
      data: options?.data ?? null,
      message: options?.message ?? null,
      error: options?.error ?? null,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Shortcut helpers (opsional: sesuaikan pesan default)
export const response = {
  ok: (data?: unknown, message = "Request successful", status = 200) =>
    jsonResponse(true, status, { data, message }),

  created: (data?: unknown, message = "Resource created") =>
    jsonResponse(true, 201, { data, message }),

  notFound: (message = "Resource not found") =>
    jsonResponse(false, 404, { message, error: message }),

  badRequest: (message = "Bad request") =>
    jsonResponse(false, 400, { message, error: message }),

  fail: (message = "Internal server error", status = 500) =>
    jsonResponse(false, status, { message, error: message }),
};
