export function hasBankDetails(org) {
  return Boolean(org?.bankAccountName?.trim() && /^\d{9,18}$/.test(org.bankAccountNumber || '') && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(org.bankIfsc || ''));
}
