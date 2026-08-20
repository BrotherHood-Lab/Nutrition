import crypto from 'crypto';

// Проверка подписи данных, присланных Telegram Login Widget.
// Алгоритм из официальной документации Telegram:
// https://core.telegram.org/widgets/login#checking-authorization
export function verifyTelegramAuth(data, botToken) {
  const { hash, ...fields } = data;
  if (!hash) return false;

  const checkString = Object.keys(fields)
    .sort()
    .map((key) => `${key}=${fields[key]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');

  if (computedHash !== hash) return false;

  // Данные старше суток считаем протухшими
  const authDate = parseInt(fields.auth_date, 10);
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > 86400) return false;

  return true;
}
