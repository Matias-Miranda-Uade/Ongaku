export const emptyRequest = Object.freeze({ status: 'idle', error: '', fetchedAt: 0 });
export const cacheDuration = 30000;
export const getMessage = error => typeof error === 'string' ? error : error.message || String(error);
export const reviewsKey = vinylId => vinylId == null ? 'all' : `vinyl:${vinylId}`;
export const eligibilityKey = (userId, vinylId) => `${userId}:${vinylId}`;
export const shouldFetch = (request = emptyRequest, force = false, replace = false) => {
  if (request.status === 'loading' && !replace) return false;
  return force || request.status !== 'succeeded' || Date.now() - request.fetchedAt >= cacheDuration;
};
// Conserva en el payload serializable los datos del ApiError que la UI necesita
// (estado HTTP y errores por campo); el mensaje sigue disponible como `message`.
export const getErrorDetails = error => ({
  message: getMessage(error),
  status: error?.status ?? 0,
  fieldErrors: error?.fieldErrors ?? {},
  isNotFound: error?.status === 404,
  isConflict: error?.status === 409,
  isUnauthorized: error?.status === 401,
  isForbidden: error?.status === 403
});
