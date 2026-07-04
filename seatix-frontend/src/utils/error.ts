/**
 * Extracts the most specific error message from an API error response.
 * Falls back to a provided default message, then a generic fallback.
 *
 * Server envelope: { status, message, data }
 * Validation errors: { message: string[] } — joins the array.
 */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (!err || typeof err !== 'object') return fallback;

  const e = err as {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
    message?: string;
  };

  const serverMsg = e.response?.data?.message;
  if (serverMsg) {
    if (Array.isArray(serverMsg)) return serverMsg[0] ?? fallback;
    return serverMsg;
  }

  if (e.message) return e.message;

  return fallback;
}
