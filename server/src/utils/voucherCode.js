import crypto from 'crypto';

export function generateVoucherCode(prefix = 'RL') {
  const cleanPrefix = prefix.replace(/[^A-Za-z0-9]/g, '').substring(0, 4).toUpperCase();
  const randomChars = crypto.randomBytes(3).toString('hex').substring(0, 5).toUpperCase();
  return `${cleanPrefix}-${randomChars}`;
}

export function generateDiscountCode(restoName = 'RESTO') {
  const clean = restoName.replace(/[^A-Za-z0-9]/g, '').substring(0, 4).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `DISC5-${clean}-${random}`;
}
