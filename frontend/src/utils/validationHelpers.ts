/**
 * Client-side input validation helpers.
 */

export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return regex.test(email.trim());
}

export function isValidPhoneNumber(phone: string): boolean {
  const regex = /^\+?[0-9\s\-()]{7,20}$/;
  return regex.test(phone.trim());
}

export function isValidPostalCode(zip: string): boolean {
  return /^[a-zA-Z0-9\s-]{3,10}$/.test(zip.trim());
}
