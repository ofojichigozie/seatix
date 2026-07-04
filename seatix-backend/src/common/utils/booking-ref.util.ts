export function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).toUpperCase().slice(2, 7);
  return `STX-${year}-${random}`;
}
