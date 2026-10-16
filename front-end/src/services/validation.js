export class FieldError extends Error {
  constructor(field, message) { super(message); this.name = 'FieldError'; this.field = field; }
}
export function validateField(field, validator, ...args) {
  try { return validator(...args); } catch (error) { throw new FieldError(field, error.message); }
}
export function requireFields(values, names) {
  for (const name of names) if (!String(values[name] ?? '').trim()) throw new FieldError(name, 'Please complete all required fields.');
}
export function validateEmail(value) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) throw new Error('Please enter a valid email address.');
}
export function validatePhone(value) {
  let digits = String(value).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length !== 10) throw new Error('Phone number must be exactly 10 digits');
  if (!/^[6-9]/.test(digits)) throw new Error('Phone number must start with 6, 7, 8, or 9');
  if (/^(\d)\1{9}$/.test(digits)) throw new Error('Invalid number — all digits cannot be the same');
  if (['1234567890','0123456789','9876543210','1111111111','1234512345'].includes(digits)) throw new Error('Please enter a real phone number — dummy patterns are not accepted');
  if (/^(\d{2})\1{4}$/.test(digits) || /^(\d{3})\1{2}\d/.test(digits)) throw new Error('Invalid number — sequential repeated pattern detected');
}
export function validatePasswords(first, second) {
  if (String(first).length < 8) throw new Error('Password must be at least 8 characters');
  if (!/[A-Z]/.test(first)) throw new Error('Must include at least one uppercase letter');
  if (!/[0-9]/.test(first)) throw new Error('Must include at least one number');
  if (!/[^A-Za-z0-9]/.test(first)) throw new Error('Must include at least one special character');
  if (first !== second) throw new Error('Passwords do not match.');
}
export function validatePasswordFields(values, first, second) {
  try { validatePasswords(values[first], values[second]); }
  catch (error) { throw new FieldError(values[first] !== values[second] && error.message === 'Passwords do not match.' ? second : first, error.message); }
}
export function validateCard(values, prefix = '') {
  const number = String(values[`${prefix}card-number`] || '').replace(/\D/g, '');
  if (!/^(4\d{15}|5[12]\d{14})$/.test(number)) throw new FieldError(`${prefix}card-number`, 'Please enter a 16-digit Visa or Mastercard (51 or 52).');
  if (String(values[`${prefix}card-holder-name`] || '').trim().length < 2) throw new FieldError(`${prefix}card-holder-name`, 'Please enter the cardholder name.');
  const [month, year] = String(values[`${prefix}card-expiry`] || '').split('/').map(Number);
  const now = new Date();
  if (!(month >= 1 && month <= 12 && year >= 0) || !/^\d{2}\/\d{2}$/.test(values[`${prefix}card-expiry`] || '') || new Date(2000 + year, month) <= new Date(now.getFullYear(), now.getMonth(), 1)) throw new FieldError(`${prefix}card-expiry`, 'Card has expired or expiry date is invalid.');
  if (!/^\d{3,4}$/.test(values[`${prefix}card-cvv`] || '')) throw new FieldError(`${prefix}card-cvv`, 'Please enter a valid CVV.');
  return { cardLast4: number.slice(-4), cardType: number.startsWith('4') ? 'Visa' : 'Mastercard' };
}
export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
export function validateDate(value, { field, min, max } = {}) {
  const text = String(value || '');
  const date = new Date(`${text}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== text) throw new FieldError(field, 'Please enter a valid date.');
  if (min && text < min) throw new FieldError(field, 'Please choose today or a future date.');
  if (max && text > max) throw new FieldError(field, 'Please choose today or an earlier date.');
}
